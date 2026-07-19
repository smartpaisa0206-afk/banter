import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { otpCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail, randomOtp } from '@/lib/email';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ email: z.string().email() });

const TTL = 10 * 60 * 1000; // 10 minutes
const RESEND_WAIT = 30 * 1000; // min gap between codes

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });

  const email = parsed.data.email.toLowerCase().trim();
  const now = Date.now();

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

  // Surface the code to the client whenever no real email provider is
  // configured (dev OR a deployment without RESEND_API_KEY). This keeps
  // passwordless signup usable everywhere; once a real email key is set the
  // code is emailed instead and never shown here.
  const devCode = !process.env.RESEND_API_KEY ? code : undefined;

  return NextResponse.json({ ok: true, devCode });
}
