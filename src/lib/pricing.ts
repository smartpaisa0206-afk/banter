export type Device = 'mobile' | 'desktop' | 'tablet';
export type CountryCode = string;

export interface Plan {
  key: 'free' | 'basic' | 'premium';
  name: string;
  price: string; // formatted, e.g. "₹99/mo" or "$1/mo"
  priceMonthly: number; // base INR amount before conversion
  currency: string;
  feats: string[];
  cta: string | null; // button label, or 'Current', or null
}

// Base prices are defined in INR. Other regions are converted with a static
// rate table so we never depend on a live FX API for the UI.
const BASE = {
  free: { name: 'Free', priceMonthly: 0, feats: ['5 generations / day', 'Core relationships & tones', 'Live suggestions + Hurry mode'] },
  basic: {
    name: 'Basic',
    priceMonthly: 99,
    feats: ['50 generations / day', 'Works: emails, social, marketing', 'Limited History & Saved'],
  },
  premium: {
    name: 'Premium',
    priceMonthly: 299,
    feats: [
      'Unlimited generations',
      'All relationships, tones & languages',
      'Full History & Saved',
      'Native keyboard (Phase 2)',
      'Feel special — exclusive tones',
    ],
  },
} as const;

interface Cur {
  code: string;
  symbol: string;
  rate: number; // multiply INR by this to get local price
}

const CUR: Record<string, Cur> = {};
// Eurozone
const eur: Cur = { code: 'EUR', symbol: '€', rate: 0.011 };
for (const c of ['DE', 'FR', 'ES', 'IT', 'NL', 'IE', 'PT', 'AT', 'BE', 'FI', 'SE', 'PL']) CUR[c] = eur;
CUR.IN = { code: 'INR', symbol: '₹', rate: 1 };
CUR.US = { code: 'USD', symbol: '$', rate: 0.012 };
CUR.GB = { code: 'GBP', symbol: '£', rate: 0.0095 };
CUR.CA = { code: 'CAD', symbol: 'C$', rate: 0.016 };
CUR.AU = { code: 'AUD', symbol: 'A$', rate: 0.018 };
CUR.AE = { code: 'AED', symbol: 'AED ', rate: 0.044 };
CUR.SG = { code: 'SGD', symbol: 'S$', rate: 0.016 };
CUR.BR = { code: 'BRL', symbol: 'R$', rate: 0.068 };
CUR.MX = { code: 'MXN', symbol: 'MX$', rate: 0.21 };
CUR.JP = { code: 'JPY', symbol: '¥', rate: 1.8 };
CUR.ZA = { code: 'ZAR', symbol: 'R', rate: 0.21 };
CUR.DEFAULT = { code: 'USD', symbol: '$', rate: 0.012 };

function ctaFor(key: Plan['key'], role?: string): string | null {
  if (role === key) return 'Current';
  if (key === 'free') return null;
  if (role === 'admin' || role === 'premium') return null;
  if (role === 'basic') return key === 'premium' ? 'Go Premium' : null;
  return key === 'premium' ? 'Go Premium' : 'Upgrade';
}

export interface PricingResult {
  plans: Plan[];
  country: string;
  currency: string;
  device: Device;
}

/**
 * Resolve localized plan pricing from the caller's country and device.
 * Prices are shown in the visitor's local currency; the tier line-up is the
 * same everywhere, but mobile visitors see a note about the keyboard (Phase 2).
 */
export function resolvePricing(opts: {
  country?: string;
  device?: Device;
  currentRole?: string;
}): PricingResult {
  const cc = (opts.country || 'IN').toUpperCase();
  const cur = CUR[cc] || CUR.DEFAULT;
  const device: Device = opts.device || 'desktop';

  const fmt = (inr: number): string => {
    if (inr === 0) return `${cur.symbol}0`;
    const local = Math.max(1, Math.round(inr * cur.rate));
    return `${cur.symbol}${local}/mo`;
  };

  const plans: Plan[] = (['free', 'basic', 'premium'] as const).map((k) => ({
    key: k,
    name: BASE[k].name,
    priceMonthly: BASE[k].priceMonthly,
    currency: cur.code,
    price: fmt(BASE[k].priceMonthly),
    feats: [...BASE[k].feats],
    cta: ctaFor(k, opts.currentRole),
  }));

  return { plans, country: cc, currency: cur.code, device };
}

export function detectDevice(ua: string | null | undefined): Device {
  const s = (ua || '').toLowerCase();
  if (/ipad|tablet/.test(s)) return 'tablet';
  if (/mobile|android|iphone|ipod/.test(s)) return 'mobile';
  return 'desktop';
}

// Read the visitor country from common proxy/CDN headers (Vercel, Cloudflare).
export function detectCountry(headers: Headers): string {
  return (
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('x-country') ||
    'IN'
  );
}
