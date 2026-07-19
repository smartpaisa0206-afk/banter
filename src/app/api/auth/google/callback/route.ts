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

  const redirectUri = `${base}/api/auth/google/callback`;
  const profile = await exchangeGoogleCode(code, redirectUri);
  if (!profile?.email) return fail();

  const user = await upsertUserByEmail(profile.email);
  const ip = req.headers.get('x-forwarded-for') || undefined;
  const token = await createSession(user.id, ip);

  const res = NextResponse.redirect(`${base}/dashboard`);
  setSessionCookie(res, token);
  res.cookies.set('banter_goog_state', '', { path: '/', maxAge: 0 });
  return res;
}
