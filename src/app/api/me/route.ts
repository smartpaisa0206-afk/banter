import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { remainingFor } from '@/lib/usage';
import { llmReady } from '@/lib/engine';
import { effectiveRole, isTrialing, trialDaysLeft } from '@/lib/plans';
import { TRIAL_DAYS, REFERRAL_BONUS_DAYS } from '@/lib/config';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  const role = effectiveRole(user);
  const rem = await remainingFor(role, user.id);
  const referredCount = user.referralCode
    ? (await db.select({ id: users.id }).from(users).where(eq(users.referredBy, user.referralCode)).limit(1000)).length
    : 0;
  return NextResponse.json({
    user: { id: user.id, email: user.email, role, status: user.status },
    remaining: Number.isFinite(rem) ? rem : null, // null = unlimited
    llmReady: llmReady(),
    templateMode: !llmReady(),
    trialing: isTrialing(user),
    trialDaysLeft: trialDaysLeft(user),
    trialEndsAt: user.trialEndsAt ?? null,
    emailVerified: user.emailVerified ?? 0,
    referralCode: user.referralCode ?? null,
    referralLink: user.referralCode ? `${req.nextUrl.origin}/signup?ref=${user.referralCode}` : null,
    referredCount,
    referralBonusDays: REFERRAL_BONUS_DAYS,
    trialDaysTotal: TRIAL_DAYS,
  });
}
