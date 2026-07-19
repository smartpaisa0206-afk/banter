import { NextResponse } from 'next/server';
import { destroySession, sessionTokenFromCookies } from '@/lib/auth';
import { SESSION_COOKIE } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const token = sessionTokenFromCookies();
  if (token) await destroySession(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
