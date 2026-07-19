import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { googleConfigured, googleAuthorizeUrl, appBaseUrl } from '@/lib/oauth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!googleConfigured()) {
    // No credentials configured — bounce back to login with a clear error
    // instead of dumping a JSON error page.
    const base = appBaseUrl(req.nextUrl.origin);
    return NextResponse.redirect(`${base}/login?error=google`);
  }

  const base = appBaseUrl(req.nextUrl.origin);
  const redirectUri = `${base}/api/auth/google/callback`;
  const state = crypto.randomBytes(16).toString('hex');

  const res = NextResponse.redirect(googleAuthorizeUrl(state, redirectUri));
  res.cookies.set('banter_goog_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
