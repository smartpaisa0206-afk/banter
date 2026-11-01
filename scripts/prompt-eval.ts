import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { detectLanguage } from '../src/lib/engine/languages';
import { normalizeShorthand } from '../src/lib/engine/shorthand';
import { detectSituation } from '../src/lib/engine/suggestionQuality';

interface Case {
  name: string;
  input: string;
  expectedLanguage?: string;
  expectedStyle?: string;
  expectedSituation?: string;
  mustNotDetect?: string;
}

function effectiveLanguage(input: string): string {
  const shorthand = normalizeShorthand(input);
  if (shorthand.style === 'roman_hinglish') return 'hing';
  if (shorthand.style === 'english') return 'en';
  return detectLanguage(input) || 'en';
}

const cases: Case[] = JSON.parse(readFileSync(join(process.cwd(), 'tests', 'prompt-cases.json'), 'utf8'));
let failed = 0;

for (const c of cases) {
  const shorthand = normalizeShorthand(c.input);
  const lang = effectiveLanguage(c.input);
  const situation = detectSituation(c.input);
  const errors: string[] = [];

  if (c.expectedLanguage && lang !== c.expectedLanguage) errors.push(`language ${lang} != ${c.expectedLanguage}`);
  if (c.expectedStyle && shorthand.style !== c.expectedStyle) errors.push(`style ${shorthand.style} != ${c.expectedStyle}`);
  if (c.expectedSituation && situation !== c.expectedSituation) errors.push(`situation ${situation} != ${c.expectedSituation}`);
  if (c.mustNotDetect && lang === c.mustNotDetect) errors.push(`must not detect ${c.mustNotDetect}`);

  if (errors.length) {
    failed++;
    console.error(`FAIL ${c.name}: ${errors.join('; ')}`);
  } else {
    console.log(`PASS ${c.name}`);
  }
}

if (failed) {
  console.error(`[prompt-eval] ${failed}/${cases.length} failed`);
  process.exit(1);
}
console.log(`[prompt-eval] all ${cases.length} cases passed without calling paid AI APIs.`);
