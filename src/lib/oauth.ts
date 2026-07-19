// Hand-rolled Google OAuth2 (authorization-code flow) — no extra dependency.
// Configure GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET (and APP_BASE_URL) to enable.

export function googleConfigured(): boolean {
  return !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
}

export function googleAuthorizeUrl(state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

interface GoogleProfile {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
}

export async function exchangeGoogleCode(code: string, redirectUri: string): Promise<GoogleProfile | null> {
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) return null;
    const token = await tokenRes.json();
    if (!token.access_token) return null;

    const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!infoRes.ok) return null;
    return (await infoRes.json()) as GoogleProfile;
  } catch {
    return null;
  }
}

// Resolve the public base URL used to build redirect URIs.
export function appBaseUrl(origin?: string | null): string {
  return process.env.APP_BASE_URL || origin || 'http://localhost:3000';
}
