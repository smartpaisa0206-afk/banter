export interface ToneConfig {
  id: string;
  label: string;
  tier: 'all' | 'basic' | 'premium';
  description: string;
}

export const TONES: ToneConfig[] = [
  { id: 'warm', label: 'Warm', tier: 'all', description: 'Kind, caring, human.' },
  { id: 'confident', label: 'Confident', tier: 'all', description: 'Sure of yourself, calm.' },
  { id: 'formal', label: 'Formal', tier: 'all', description: 'Polite and proper.' },
  { id: 'playful', label: 'Playful', tier: 'basic', description: 'Light, fun, teasing.' },
  { id: 'assertive', label: 'Assertive', tier: 'basic', description: 'Clear boundaries, no apology.' },
  { id: 'empathetic', label: 'Empathetic', tier: 'basic', description: 'Deeply understanding.' },
  { id: 'casual', label: 'Casual', tier: 'basic', description: 'Chill, everyday.' },
  { id: 'power', label: 'Power Move', tier: 'premium', description: 'Premium-only: command the room.' },
];

export function toneById(id: string) {
  return TONES.find((t) => t.id === id);
}
export function toneLabel(id: string) {
  return toneById(id)?.label || id;
}
export function toneAccessible(id: string, role: string) {
  const t = toneById(id);
  if (!t) return false;
  if (t.tier === 'all') return true;
  if (t.tier === 'basic') return role !== 'free';
  return role === 'premium' || role === 'admin';
}
