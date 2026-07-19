export interface Lang {
  code: string;
  label: string;
}

export const LANGUAGES: Lang[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ko', label: 'Korean' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'bn', label: 'Bengali' },
  { code: 'mr', label: 'Marathi' },
  { code: 'hing', label: 'Hinglish' },
];

export function langLabel(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.label || code;
}

const SAMPLES: Record<string, string[]> = {
  es: ['hola', 'gracias', 'porque', 'quiero', 'senor', 'senora', 'amigo', 'si', 'estas', 'como'],
  fr: ['bonjour', 'merci', 'oui', 'comment', 'salut', 'madame', 'monsieur', 'bien', 'je', 'tu'],
  de: ['ich', 'danke', 'bitte', 'und', 'ist', 'sehr', 'hallo', 'warum', 'du', 'nicht'],
  it: ['ciao', 'grazie', 'sono', 'perche', 'amico', 'come', 'sei', 'bene', 'buongiorno', 'tu'],
  pt: ['ola', 'obrigado', 'voce', 'sim', 'estou', 'tudo', 'bem', 'porque', 'tambem'],
  hing: ['hai', 'kya', 'nahi', 'mera', 'tera', 'pyaar', 'kal', 'aaj', 'yaar', 'acha', 'tum', 'dil', 'baat', 'tumse'],
};

// Lightweight, dependency-free language detection from user text.
// Uses WHOLE-WORD matching (not naive substring) so an English word like
// "project" is never misread as French ("je"), and only commits to a language
// when >=2 signal words are present — otherwise we keep the user's chosen
// language. This is what stops replies from switching to the wrong language.
export function detectLanguage(text: string): string | null {
  if (!text || !text.trim()) return null;
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
  if (/[\u3040-\u30FF]/.test(text)) return 'ja';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';

  let best: string | null = null;
  let bestScore = 0;
  for (const [code, words] of Object.entries(SAMPLES)) {
    let score = 0;
    for (const w of words) {
      const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp('(^|[^a-z])' + esc + '([^a-z]|$)', 'i');
      if (re.test(text)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = code;
    }
  }
  return bestScore >= 2 ? best : null;
}
