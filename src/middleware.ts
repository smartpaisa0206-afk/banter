import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from './lib/config';

// Route-level auth gate. NOTE: this is cookie-presence based only — it checks
// that the session cookie EXISTS, not that the token inside it is valid or
// unexpired. Layouts (src/app/(app)/layout.tsx, src/app/admin/layout.tsx)
// still perform real token verification via getCurrentUser(); this middleware
// just gives faster redirect UX and keeps deep-link ?next= targets intact.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = !!req.cookies.get(SESSION_COOKIE)?.value;

  const res = NextResponse.next();

  if (!hasSession && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    // pathname is server-resolved (always starts with '/'); never let it become a protocol-relative URL.
    const target = pathname.startsWith('/') && !pathname.startsWith('//') ? pathname + req.nextUrl.search : '/dashboard';
    url.searchParams.set('next', target);
    return NextResponse.redirect(url);
  }

  if (hasSession && (pathname === '/login' || pathname === '/signup')) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Pass the resolved pathname to server components so layouts can rebuild a
  // validated ?next= target when a session cookie turns out to be invalid.
  res.headers.set('x-pathname', pathname);
  return res;
}

export const config = {
  matcher: [
    // Protected areas + auth pages; static assets, API, and public files excluded.
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};
