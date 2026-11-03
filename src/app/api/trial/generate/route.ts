import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { generate, relById, toneById } from '@/lib/engine';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GUEST_COOKIE = 'banter_guest';
const TRIAL_DAILY_LIMIT = 3;

// In-memory daily guest quota (same pattern as the app's other in-memory limits).
// Keyed by guest id; resets at UTC midnight. Generous enough to try, tight
// enough that real usage still needs an account.
const buckets = new Map<string, { count: number; day: string }>();
function utcDay() {
  return new Date().toISOString().slice(0, 10);
}
function guestRemaining(guestId: string): number {
  const b = buckets.get(guestId);
  if (!b || b.day !== utcDay()) return TRIAL_DAILY_LIMIT;
  return Math.max(0, TRIAL_DAILY_LIMIT - b.count);
}
function consumeGuest(guestId: string) {
  const day = utcDay();
  const b = buckets.get(guestId);
  if (!b || b.day !== day) buckets.set(guestId, { count: 1, day });
  else b.count += 1;
}

const schema = z.object({
  relationship: z.string().min(1).max(40).default('crush'),
  tone: z.string().min(1).max(40).default('confident'),
  context: z.string().min(1).max(2000),
  language: z.string().min(1).max(16).default('en'),
});

function guestIdFrom(req: NextRequest): string {
  return req.cookies.get(GUEST_COOKIE)?.value || '';
}

function withGuestCookie(res: NextResponse, guestId: string) {
  res.cookies.set(GUEST_COOKIE, guestId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const guestId = guestIdFrom(req) || randomUUID();
  const res = NextResponse.json({ remaining: guestRemaining(guestId), limit: TRIAL_DAILY_LIMIT });
  if (!guestIdFrom(req)) withGuestCookie(res, guestId);
  return res;
}

export async function POST(req: NextRequest) {
  let guestId = guestIdFrom(req);
  const isNew = !guestId;
  if (isNew) guestId = randomUUID();

  // Burst protection per guest.
  const burst = rateLimit(req, { key: 'trial:generate', userId: guestId, limit: 6, windowMs: 60 * 1000 });
  if (!burst.ok) {
    const res = NextResponse.json({ error: 'Too many tries — wait a minute and try again.' }, { status: 429 });
    return withGuestCookie(res, guestId);
  }

  const remaining = guestRemaining(guestId);
  if (remaining <= 0) {
    const res = NextResponse.json(
      { error: 'Trial used up for today.', remaining: 0, limitHit: true },
      { status: 429 },
    );
    return withGuestCookie(res, guestId);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    const res = NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    return withGuestCookie(res, guestId);
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const res = NextResponse.json({ error: 'Tell us what you want to say first.' }, { status: 400 });
    return withGuestCookie(res, guestId);
  }

  const { relationship, tone, context, language } = parsed.data;
  const rel = relById(relationship);
  const t = toneById(tone);
  // Trial only exposes free-tier building blocks.
  if (!rel || !t || t.tier === 'premium') {
    const res = NextResponse.json({ error: 'Pick a relationship and tone to try.' }, { status: 400 });
    return withGuestCookie(res, guestId);
  }

  consumeGuest(guestId);
  try {
    const out = await generate({ relationship, intent: 'dm_reply', tone, language, context, length: 'medium' });
    const text = out.variants?.[0] || out.body || out.statement || '';
    const res = NextResponse.json({ text, remaining: guestRemaining(guestId), limit: TRIAL_DAILY_LIMIT });
    return withGuestCookie(res, guestId);
  } catch (e) {
    console.error('[trial] generate failed:', e instanceof Error ? e.message : e);
    const res = NextResponse.json({ error: 'Could not rewrite that — try again.' }, { status: 500 });
    return withGuestCookie(res, guestId);
  }
}
