import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { upsertUserByEmail, createSession, setSessionCookie } from '@/lib/auth';
import { googleConfigured, exchangeGoogleCode, appBaseUrl } from '@/lib/oauth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const base = appBaseUrl(req.nextUrl.origin);
  const fail = () => NextResponse.redirect(`${base}/login?error=google`);

  const params = req.nextUrl.searchParams;
  const code = params.get('code');
  const state = params.get('state');
  const cookieState = req.cookies.get('banter_goog_state')?.value;

  if (!googleConfigured() || !code || !state || !cookieState || state !== cookieState) {
    return fail();
  }

  // The deep-link target was embedded in the state token as base64url after
  // the first dot. Re-validate it: only same-origin absolute paths allowed.
  let dest = '/dashboard';
  const dot = state.indexOf('.');
  if (dot > 0) {
    try {
      const decoded = Buffer.from(state.slice(dot + 1), 'base64url').toString('utf8');
      if (decoded.startsWith('/') && !decoded.startsWith('//')) dest = decoded;
    } catch {
      // ignore malformed state suffix — fall back to /dashboard
    }
  }

  const redirectUri = `${base}/api/auth/google/callback`;
  const profile = await exchangeGoogleCode(code, redirectUri);
  if (!profile?.email) return fail();

  const user = await upsertUserByEmail(profile.email);
  const ip = req.headers.get('x-forwarded-for') || undefined;
  const token = await createSession(user.id, ip);

  const res = NextResponse.redirect(`${base}${dest}`);
  setSessionCookie(res, token);
  // Clear the OAuth state cookie with the same flags it was set with.
  res.cookies.set('banter_goog_state', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
