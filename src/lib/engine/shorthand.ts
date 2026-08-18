export type ShorthandStyle = 'english' | 'roman_hinglish' | 'none';

export interface ShorthandMatch {
  pattern: RegExp;
  meaning: string;
  style: Exclude<ShorthandStyle, 'none'>;
}

export interface ShorthandResult {
  original: string;
  interpreted: string;
  style: ShorthandStyle;
  matched: string[];
}

// Common short forms used in Indian WhatsApp/Instagram chats + global texting.
// This is NOT a translation engine. It gives the LLM a clearer interpretation
// when the user types very short casual text like "kkrh" or "pta nhi".
const HINGLISH: ShorthandMatch[] = [
  { pattern: /\bkkrh\b|\bkrrh\b/gi, meaning: 'kya kar rahe ho?', style: 'roman_hinglish' },
  { pattern: /\bkr\s*rhe\b|\bkar\s*rhe\b/gi, meaning: 'kar rahe', style: 'roman_hinglish' },
  { pattern: /\bkr\s*rha\b|\bkar\s*rha\b/gi, meaning: 'kar raha', style: 'roman_hinglish' },
  { pattern: /\bkr\s*rhi\b|\bkar\s*rhi\b/gi, meaning: 'kar rahi', style: 'roman_hinglish' },
  { pattern: /\btm\b/gi, meaning: 'tum', style: 'roman_hinglish' },
  { pattern: /\bky\b|\bq\b/gi, meaning: 'kya / kyun depending context', style: 'roman_hinglish' },
  { pattern: /\bnhi\b|\bnai\b/gi, meaning: 'nahi', style: 'roman_hinglish' },
  { pattern: /\bpta\s*nhi\b|\bpata\s*nhi\b/gi, meaning: 'pata nahi', style: 'roman_hinglish' },
  { pattern: /\bkhna\b/gi, meaning: 'khana', style: 'roman_hinglish' },
  { pattern: /\bkhya\s*liya\b/gi, meaning: 'khana kha liya? or kya liya? depending context', style: 'roman_hinglish' },
  { pattern: /\bkha\s*liya\b|\bkhana\s*kha\s*liya\b/gi, meaning: 'khana kha liya?', style: 'roman_hinglish' },
  { pattern: /\bbtao\b|\bbta\b/gi, meaning: 'batao', style: 'roman_hinglish' },
  { pattern: /\bmtlb\b/gi, meaning: 'matlab', style: 'roman_hinglish' },
  { pattern: /\bbt\b/gi, meaning: 'baat', style: 'roman_hinglish' },
  { pattern: /\bmsg\b/gi, meaning: 'message', style: 'roman_hinglish' },
  { pattern: /\bcl\b/gi, meaning: 'call', style: 'roman_hinglish' },
  { pattern: /\baaj\b/gi, meaning: 'aaj / today', style: 'roman_hinglish' },
  { pattern: /\bkal\b/gi, meaning: 'kal / tomorrow or yesterday depending context', style: 'roman_hinglish' },
  { pattern: /\byaar\b/gi, meaning: 'yaar / buddy / emotional filler', style: 'roman_hinglish' },
  { pattern: /\bach?a\b|\baccha\b/gi, meaning: 'acha / okay / good / really', style: 'roman_hinglish' },
  { pattern: /\bkoi\s*ni\b|\bkoi\s*nhi\b/gi, meaning: 'koi nahi / no problem', style: 'roman_hinglish' },
  { pattern: /\bthk\b|\btk\b|\bthik\b/gi, meaning: 'theek / okay', style: 'roman_hinglish' },
  { pattern: /\bchl\b|\bchlo\b/gi, meaning: 'chalo / okay / let us go', style: 'roman_hinglish' },
  { pattern: /\bruk\b|\bruko\b/gi, meaning: 'ruk / wait', style: 'roman_hinglish' },
];

const ENGLISH: ShorthandMatch[] = [
  { pattern: /\bwyd\b/gi, meaning: 'what are you doing?', style: 'english' },
  { pattern: /\bhru\b/gi, meaning: 'how are you?', style: 'english' },
  { pattern: /\bwbu\b|\bhbu\b/gi, meaning: 'what about you?', style: 'english' },
  { pattern: /\bidk\b/gi, meaning: "I don't know", style: 'english' },
  { pattern: /\bidc\b/gi, meaning: "I don't care", style: 'english' },
  { pattern: /\btbh\b/gi, meaning: 'to be honest', style: 'english' },
  { pattern: /\bbtw\b/gi, meaning: 'by the way', style: 'english' },
  { pattern: /\bbrb\b/gi, meaning: 'be right back', style: 'english' },
  { pattern: /\bnvm\b/gi, meaning: 'never mind', style: 'english' },
  { pattern: /\brn\b/gi, meaning: 'right now', style: 'english' },
  { pattern: /\botw\b|\bomw\b/gi, meaning: 'on my way', style: 'english' },
  { pattern: /\bty\b|\bthx\b|\bthanks\b/gi, meaning: 'thank you', style: 'english' },
  { pattern: /\bnp\b/gi, meaning: 'no problem', style: 'english' },
  { pattern: /\bjk\b/gi, meaning: 'just kidding', style: 'english' },
  { pattern: /\bfr\b/gi, meaning: 'for real', style: 'english' },
  { pattern: /\bngl\b/gi, meaning: 'not gonna lie', style: 'english' },
  { pattern: /\blmk\b/gi, meaning: 'let me know', style: 'english' },
];

export function normalizeShorthand(text: string): ShorthandResult {
  const original = (text || '').trim();
  if (!original) return { original, interpreted: '', style: 'none', matched: [] };

  const matches: string[] = [];
  const meanings: string[] = [];
  let style: ShorthandStyle = 'none';

  for (const item of HINGLISH) {
    item.pattern.lastIndex = 0;
    if (item.pattern.test(original)) {
      matches.push(item.pattern.source);
      meanings.push(item.meaning);
      style = 'roman_hinglish';
    }
  }

  // Only use English shorthand if Hinglish was not detected. This avoids words
  // like "bt" being treated as English when the rest of the sentence is Hinglish.
  if (style === 'none') {
    for (const item of ENGLISH) {
      item.pattern.lastIndex = 0;
      if (item.pattern.test(original)) {
        matches.push(item.pattern.source);
        meanings.push(item.meaning);
        style = 'english';
      }
    }
  }

  const interpreted = meanings.length
    ? `${original}\nLikely meaning(s): ${Array.from(new Set(meanings)).join('; ')}`
    : original;

  return { original, interpreted, style, matched: matches };
}
