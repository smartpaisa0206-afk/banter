export type Role = 'free' | 'basic' | 'premium' | 'admin';
export type Access = 'none' | 'limited' | 'full';

export interface TierInfo {
  id: Role;
  name: string;
  dailyLimit: number; // Infinity = unlimited
  hasWorks: boolean; // email / social / marketing "extra works"
  history: Access;
  saved: Access;
  keyboard: boolean; // native keyboard (phase 2)
  badge: boolean; // "feel special"
}

export const TIERS: Record<Role, TierInfo> = {
  free: { id: 'free', name: 'Free', dailyLimit: 5, hasWorks: false, history: 'none', saved: 'none', keyboard: false, badge: false },
  basic: { id: 'basic', name: 'Basic', dailyLimit: 50, hasWorks: true, history: 'limited', saved: 'limited', keyboard: false, badge: false },
  premium: { id: 'premium', name: 'Premium', dailyLimit: Infinity, hasWorks: true, history: 'full', saved: 'full', keyboard: true, badge: true },
  admin: { id: 'admin', name: 'Admin', dailyLimit: Infinity, hasWorks: true, history: 'full', saved: 'full', keyboard: true, badge: true },
};

export function roleOf(role: string | undefined | null): Role {
  if (role === 'basic' || role === 'premium' || role === 'admin') return role;
  return 'free';
}

export function dailyLimitFor(role: string | undefined | null): number {
  return TIERS[roleOf(role)].dailyLimit;
}
export function canUseWorks(role: string | undefined | null): boolean {
  return TIERS[roleOf(role)].hasWorks;
}
export function historyAccess(role: string | undefined | null): Access {
  return TIERS[roleOf(role)].history;
}
export function savedAccess(role: string | undefined | null): Access {
  return TIERS[roleOf(role)].saved;
}
export function isPremium(role: string | undefined | null): boolean {
  const r = roleOf(role);
  return r === 'premium' || r === 'admin';
}
