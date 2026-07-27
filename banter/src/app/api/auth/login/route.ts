import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, createSession } from '@/lib/auth';
import { isLockedOut, registerFailedAttempt, clearAttempts } from '@/lib/security';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/config';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (isLockedOut(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  const u = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!u.length || !verifyPassword(parsed.data.password, u[0].passwordHash, u[0].salt)) {
    registerFailedAttempt(ip);
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
  if (u[0].status === 'banned') {
    return NextResponse.json({ error: 'This account has been disabled.' }, { status: 403 });
  }

  clearAttempts(ip);
  const token = await createSession(u[0].id, ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
