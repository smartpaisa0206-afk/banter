import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, hashPassword, createSession } from '@/lib/auth';
import { isLockedOut, registerFailedAttempt, clearAttempts } from '@/lib/security';
import { clientIp } from '@/lib/rateLimit';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/config';
import { logSecurityEvent } from '@/lib/securityEvents';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Fixed dummy hash/salt so that a login for a nonexistent user takes the same
// scrypt work as a real password check — response time must not reveal which
// emails have accounts.
const DUMMY = hashPassword('banter-dummy-password-that-nobody-knows-' + 'x'.repeat(16));

export async function POST(req: NextRequest) {
  const ip = clientIp(req) || 'local';
  if (isLockedOut(ip)) {
    await logSecurityEvent({ req, eventType: 'login_locked', source: 'web', success: false, severity: 'warn' });
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  const u = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const passwordOk = u.length
    ? verifyPassword(parsed.data.password, u[0].passwordHash, u[0].salt)
    : verifyPassword(parsed.data.password, DUMMY.hash, DUMMY.salt);
  if (!passwordOk) {
    registerFailedAttempt(ip);
    await logSecurityEvent({ req, eventType: 'login_failed', source: 'web', success: false, severity: 'warn', metadata: { email } });
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
  if (!u.length || u[0].status === 'banned') {
    // Keep the ban effective (userFromToken already returns null for banned
    // users) but don't reveal account status — same generic 401 as a wrong
    // password so banned emails aren't enumerable.
    await logSecurityEvent({ req, userId: u[0].id, eventType: 'login_failed', source: 'web', success: false, severity: 'critical', metadata: { reason: 'banned' } });
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  clearAttempts(ip);
  await logSecurityEvent({ req, userId: u[0].id, eventType: 'login_success', source: 'web', success: true });
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
