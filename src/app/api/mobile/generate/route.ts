import { NextRequest, NextResponse } from 'next/server';
import { userFromMobileToken } from '@/lib/auth';
import { generate, relAccessible, toneAccessible, intentAccessible, intentById } from '@/lib/engine';
import { canUseWorks } from '@/lib/plans';
import { withinLimit, remainingFor, reserveGeneration, finalizeReservation, QuotaExceededError } from '@/lib/usage';
import { encryptText } from '@/lib/security';
import { logSecurityEvent } from '@/lib/securityEvents';
import { rateLimit } from '@/lib/rateLimit';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  relationship: z.string().min(1),
  intent: z.string().min(1),
  tone: z.string().min(1),
  language: z.string().min(1),
  context: z.string().max(4000).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  hurry: z.boolean().optional(),
  token: z.string().optional(),
});

// Native keyboard generation. Auth via bearer token (header or body).
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
  const body = await req.json().catch(() => ({}));
  const token = bearer || body?.token;
  const user = await userFromMobileToken(token);
  if (!user) {
    await logSecurityEvent({ req, eventType: 'mobile_generate_failed', source: 'android_keyboard', success: false, severity: 'warn', metadata: { reason: 'unauthorized' } });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const burst = rateLimit(req, { key: 'generate:mobile', userId: user.id, limit: 10, windowMs: 60 * 1000 });
  if (!burst.ok) {
    await logSecurityEvent({ req, userId: user.id, eventType: 'mobile_generate_failed', source: 'android_keyboard', success: false, severity: 'warn', metadata: { reason: 'burst_rate_limited' } });
    return NextResponse.json({ error: 'Too many keyboard requests. Slow down and try again.' }, { status: 429 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const { relationship, intent, tone, language, context, length, hurry } = parsed.data;

  if (!relAccessible(relationship, user.role))
    return NextResponse.json({ error: 'Upgrade to use this relationship.' }, { status: 403 });
  if (!toneAccessible(tone, user.role))
    return NextResponse.json({ error: 'Upgrade to use this tone.' }, { status: 403 });
  const intentCfg = intentById(intent);
  if (!intentCfg || !intentAccessible(intent, user.role))
    return NextResponse.json({ error: 'Upgrade to use this intent.' }, { status: 403 });
  if (intentCfg.category === 'works' && !canUseWorks(user.role))
    return NextResponse.json({ error: 'Upgrade to use Works.' }, { status: 403 });

  if (!(await withinLimit(user.role, user.id))) {
    const rem = await remainingFor(user.role, user.id);
    await logSecurityEvent({ req, userId: user.id, eventType: 'generation_limit_hit', source: 'android_keyboard', success: false, severity: 'warn', metadata: { relationship, intent, tone } });
    return NextResponse.json(
      { error: 'Daily limit reached.', remaining: Number.isFinite(rem) ? rem : null, limitHit: true },
      { status: 429 },
    );
  }

  // Reserve the quota BEFORE the ~20s LLM call; the reserve insert is never
  // swallowed, so a DB failure becomes a 500 instead of a free generation.
  let reservationId: string;
  try {
    reservationId = await reserveGeneration({
      userId: user.id,
      role: user.role,
      relationship,
      intent,
      tone,
      language,
      length: length || 'medium',
      hurry: !!hurry,
      contextEnc: context ? encryptText(context) : null,
    });
  } catch (e) {
    if (e instanceof QuotaExceededError) {
      const rem = await remainingFor(user.role, user.id);
      return NextResponse.json(
        { error: 'Daily limit reached.', remaining: Number.isFinite(rem) ? rem : null, limitHit: true },
        { status: 429 },
      );
    }
    console.error('[mobile/generate] quota reserve failed:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Could not start generation. Please try again.' }, { status: 500 });
  }

  const output = await generate({ relationship, intent, tone, language, context, length, hurry });
  await finalizeReservation(reservationId, encryptText(JSON.stringify(output)));
  await logSecurityEvent({ req, userId: user.id, eventType: 'mobile_generate_success', source: 'android_keyboard', success: true, metadata: { relationship, intent, tone, language, hurry: !!hurry } });
  const rem = await remainingFor(user.role, user.id);
  return NextResponse.json({ ...output, remaining: Number.isFinite(rem) ? rem : null });
}
