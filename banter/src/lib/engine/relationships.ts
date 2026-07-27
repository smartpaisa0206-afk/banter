export interface RelationshipConfig {
  id: string;
  label: string;
  tier: 'all' | 'basic';
  description: string;
}

export const RELATIONSHIPS: RelationshipConfig[] = [
  { id: 'partner', label: 'Partner', tier: 'all', description: 'Boyfriend, girlfriend, spouse.' },
  { id: 'crush', label: 'Crush', tier: 'all', description: 'Someone you like but are not with yet.' },
  { id: 'friend', label: 'Friend', tier: 'all', description: 'A close friend.' },
  { id: 'parent', label: 'Parent', tier: 'all', description: 'Mom or dad.' },
  { id: 'stranger', label: 'Stranger', tier: 'all', description: 'Someone you just met.' },
  { id: 'boss', label: 'Boss', tier: 'basic', description: 'Your manager or superior.' },
  { id: 'client', label: 'Client', tier: 'basic', description: 'A customer or client.' },
  { id: 'colleague', label: 'Colleague', tier: 'basic', description: 'A coworker.' },
  { id: 'teacher', label: 'Teacher', tier: 'basic', description: 'A professor or mentor.' },
];

export function relById(id: string) {
  return RELATIONSHIPS.find((r) => r.id === id);
}
export function relLabel(id: string) {
  return relById(id)?.label || id;
}
export function relAccessible(id: string, role: string) {
  const r = relById(id);
  if (!r) return false;
  if (r.tier === 'all') return true;
  return role !== 'free';
}
