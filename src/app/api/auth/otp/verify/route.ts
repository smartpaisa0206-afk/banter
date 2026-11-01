import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { otpCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { upsertUserByEmail, createSession, setSessionCookie } from '@/lib/auth';
import { SESSION_MAX_AGE } from '@/lib/config';
import { isLockedOut, registerFailedAttempt, clearAttempts } from '@/lib/security';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ email: z.string().email(), code: z.string().min(4).max(10) });

// Brute-force guard: ~5 wrong codes per email → lockout, and the stored code
// is invalidated so a later unlock can't resume guessing against it.
const OTP_MAX_ATTEMPTS = 5;

function codesMatch(stored: string, supplied: string): boolean {
  const a = Buffer.from(stored, 'utf8');
  const b = Buffer.from(supplied, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email and code.' }, { status: 400 });

  const email = parsed.data.email.toLowerCase().trim();
  const now = Date.now();
  const lockKey = `otp:${email}`;

  if (isLockedOut(lockKey, OTP_MAX_ATTEMPTS)) {
    return NextResponse.json({ error: 'Too many wrong codes. Request a new one.' }, { status: 429 });
  }

  const rec = await db.query.otpCodes.findFirst({ where: eq(otpCodes.email, email) });
  const valid = !!rec && !rec.verified && rec.expiresAt >= now && codesMatch(rec.code, parsed.data.code);

  if (!valid) {
    registerFailedAttempt(lockKey);
    if (isLockedOut(lockKey, OTP_MAX_ATTEMPTS)) {
      // Invalidate the stored code so guesses can't continue against it.
      await db.delete(otpCodes).where(eq(otpCodes.email, email));
    }
    return NextResponse.json({ error: 'Invalid or expired code. Request a new one.' }, { status: 401 });
  }

  clearAttempts(lockKey);
  await db.update(otpCodes).set({ verified: true }).where(eq(otpCodes.email, email));

  const user = await upsertUserByEmail(email);
  const ip = req.headers.get('x-forwarded-for') || undefined;
  const token = await createSession(user.id, ip);

  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, token);
  return res;
}
