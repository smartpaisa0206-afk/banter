export type Device = 'mobile' | 'desktop' | 'tablet';
export type CountryCode = string;
export type PlanKey = 'free' | 'starter' | 'go' | 'plus' | 'pro' | 'business';

export interface Plan {
  key: PlanKey;
  name: string;
  price: string; // formatted, e.g. "₹299/mo" or "$4/mo"
  priceMonthly: number; // base INR amount before conversion
  currency: string;
  feats: string[];
  cta: string | null; // button label, or 'Current', or null
}

// Base prices are defined in INR. Other regions are converted with a static
// rate table so we never depend on a live FX API for the UI.
const BASE: Record<PlanKey, { name: string; priceMonthly: number; feats: string[] }> = {
  free: {
    name: 'Free',
    priceMonthly: 0,
    feats: ['Personal mode preview', '5 generations / day', 'Core tones + live suggestions'],
  },
  starter: {
    name: 'Starter',
    priceMonthly: 199,
    feats: ['More daily writing room', 'Personal replies + rewrites', 'Save your best messages'],
  },
  go: {
    name: 'Go',
    priceMonthly: 299,
    feats: ['Personal + Professional mode', 'Emails and follow-ups', '50 generations / day', 'Limited history'],
  },
  plus: {
    name: 'Plus',
    priceMonthly: 499,
    feats: ['Unlimited daily writing', 'Professional mails, notices, posts', 'Full history & saved', 'All tones and languages'],
  },
  pro: {
    name: 'Pro',
    priceMonthly: 829,
    feats: ['Everything in Plus', 'Priority AI writing', 'Longer professional drafts', 'Keyboard access when Phase 2 launches'],
  },
  business: {
    name: 'Business',
    priceMonthly: 1299,
    feats: ['Team-ready writing workflow', 'Business emails and marketing copy', 'Priority support', 'Best for creators and small teams'],
  },
};

interface Cur {
  code: string;
  symbol: string;
  rate: number; // multiply INR by this to get local price
}

const CUR: Record<string, Cur> = {};
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
CUR.MX = { code: 'MX$', symbol: 'MX$', rate: 0.21 };
CUR.JP = { code: 'JPY', symbol: '¥', rate: 1.8 };
CUR.ZA = { code: 'ZAR', symbol: 'R', rate: 0.21 };
CUR.DEFAULT = { code: 'USD', symbol: '$', rate: 0.012 };

function ctaFor(key: PlanKey, role?: string): string | null {
  if (role === 'admin') return null;
  if (role === 'free' && key === 'free') return 'Current';
  if (role === 'basic' && key === 'go') return 'Current';
  if (role === 'premium' && key === 'plus') return 'Current';
  if (key === 'free') return null;
  return `Upgrade to ${BASE[key].name}`;
}

export interface PricingResult {
  plans: Plan[];
  country: string;
  currency: string;
  device: Device;
}

export function resolvePricing(opts: { country?: string; device?: Device; currentRole?: string }): PricingResult {
  const cc = (opts.country || 'IN').toUpperCase();
  const cur = CUR[cc] || CUR.DEFAULT;
  const device: Device = opts.device || 'desktop';

  const fmt = (inr: number): string => {
    if (inr === 0) return `${cur.symbol}0`;
    const local = Math.max(1, Math.round(inr * cur.rate));
    return `${cur.symbol}${local}/mo`;
  };

  const order: PlanKey[] = ['free', 'starter', 'go', 'plus', 'pro', 'business'];
  const plans: Plan[] = order.map((k) => ({
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

export function detectCountry(headers: Headers): string {
  return headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || headers.get('x-country') || 'IN';
}
