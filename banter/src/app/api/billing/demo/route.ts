import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  if (process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is configured; use Stripe for billing.' }, { status: 400 });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  await db.update(users).set({ role: 'premium' }).where(eq(users.id, user.id));
  return NextResponse.json({ ok: true, role: 'premium' });
}
