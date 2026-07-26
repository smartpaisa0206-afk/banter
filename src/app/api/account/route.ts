import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { SESSION_COOKIE } from '@/lib/config';
import { db } from '@/lib/db';
import { feedback, generations, mobileTokens, savedMessages, sessions, users } from '@/lib/db/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db.delete(generations).where(eq(generations.userId, user.id));
  await db.delete(savedMessages).where(eq(savedMessages.userId, user.id));
  await db.delete(mobileTokens).where(eq(mobileTokens.userId, user.id));
  await db.delete(sessions).where(eq(sessions.userId, user.id));
  await db.delete(feedback).where(eq(feedback.userId, user.id));
  await db.delete(users).where(eq(users.id, user.id));

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
