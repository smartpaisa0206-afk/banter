import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { users, otpCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, createSession } from '@/lib/auth';
import { SESSION_COOKIE, SESSION_MAX_AGE, TRIAL_DAYS, REFERRAL_BONUS_DAYS } from '@/lib/config';
import { sendEmail, randomOtp } from '@/lib/email';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  ref: z.string().max(40).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password (min 8 characters).' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  // --- Referral + free-trial handling -------------------------------------
  // Invite code may arrive in the body or the ?ref= query param (shared link).
  const ref = (parsed.data.ref || req.nextUrl.searchParams.get('ref') || '').toString().trim();
  let referredBy: string | null = null;
  let referralBonusDays = 0;
  if (ref) {
    const referrer = await db
      .select({ id: users.id, trialEndsAt: users.trialEndsAt })
      .from(users)
      .where(eq(users.referralCode, ref))
      .limit(1);
    if (referrer.length) {
      referredBy = ref;
      referralBonusDays = REFERRAL_BONUS_DAYS;
      // Extend the referrer's trial too (double-sided loop: both win).
      const base = referrer[0].trialEndsAt && referrer[0].trialEndsAt! > Date.now()
        ? referrer[0].trialEndsAt!
        : Date.now();
      await db
        .update(users)
        .set({ trialEndsAt: base + REFERRAL_BONUS_DAYS * 86_400_000 })
        .where(eq(users.id, referrer[0].id));
    }
  }

  const { hash, salt } = hashPassword(parsed.data.password);
  // New user earns the base trial + a welcome bonus if they were referred.
  const trialEndsAt = Date.now() + (TRIAL_DAYS + referralBonusDays) * 86_400_000;
  const referralCode = crypto.randomBytes(5).toString('hex').slice(0, 8);
  const [u] = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      email,
      passwordHash: hash,
      salt,
      role: 'free',
      status: 'active',
      trialEndsAt,
      referralCode,
      referredBy,
      createdAt: Date.now(),
    })
    .returning({ id: users.id });

  const token = await createSession(u.id, req.headers.get('x-forwarded-for') || undefined);

  // Email verification: new accounts start unverified. Send a 6-digit code.
  // In dev (no RESEND_API_KEY) the code is returned so you can test; in prod
  // it is emailed and never shown.
  const vCode = randomOtp(6);
  await db
    .insert(otpCodes)
    .values({ id: crypto.randomUUID(), email, code: vCode, createdAt: Date.now(), expiresAt: Date.now() + 10 * 60 * 1000, verified: false })
    .catch(() => {});
  await sendEmail({
    to: email,
    subject: 'Verify your Banter email',
    body: `Your Banter verification code is ${vCode}. It expires in 10 minutes.`,
  }).catch(() => {});
  const devCode = !process.env.RESEND_API_KEY ? vCode : undefined;

  const res = NextResponse.json({ ok: true, devCode });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
