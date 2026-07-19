export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || 'Banter';
export const BRAND_TAGLINE =
  process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Say the right thing to the right person.';

export const SESSION_COOKIE = 'banter_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Caps for "limited" history / saved on the Basic tier
export const HISTORY_LIMIT = 25;
export const SAVED_LIMIT = 25;
