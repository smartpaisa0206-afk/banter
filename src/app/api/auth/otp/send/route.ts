import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { otpCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail, randomOtp } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ email: z.string().email() });

const TTL = 10 * 60 * 1000; // 10 minutes
const RESEND_WAIT = 30 * 1000; // min gap between codes
const IP_WINDOW_MS = 15 * 60 * 1000; // per-IP send cap window
const IP_MAX_SENDS = 8; // sends per window per IP

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });

  const email = parsed.data.email.toLowerCase().trim();
  const now = Date.now();

  const rl = rateLimit(req, { key: 'otp-send', limit: IP_MAX_SENDS, windowMs: IP_WINDOW_MS });
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many codes requested. Try again later.' }, { status: 429 });
  }

  const existing = await db.query.otpCodes.findFirst({ where: eq(otpCodes.email, email) });
  if (existing && existing.expiresAt > now && now - existing.createdAt < RESEND_WAIT) {
    return NextResponse.json({ error: 'Please wait a moment before requesting another code.' }, { status: 429 });
  }

  // Replace any prior codes for this email.
  await db.delete(otpCodes).where(eq(otpCodes.email, email));

  const code = randomOtp(6);
  await db.insert(otpCodes).values({
    id: crypto.randomUUID(),
    email,
    code,
    createdAt: now,
    expiresAt: now + TTL,
    verified: false,
  });

  await sendEmail({
    to: email,
    subject: 'Your Banter login code',
    body: `Your Banter login code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
  });

  // Surface the code to the client only in development without a real email
  // provider configured. Never leak codes in production: there, the code is
  // always emailed instead.
  const devCode =
    process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY ? code : undefined;

  return NextResponse.json({ ok: true, devCode });
}
