import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const INCLUDE_DIRS = ['src', 'scripts', 'android/app/src', 'public'];
const INCLUDE_FILES = ['package.json', 'next.config.mjs', '.gitignore', '.env.example'];
const SECRET_PATTERNS = [
  { name: 'Groq API key', re: /gsk_[A-Za-z0-9]{20,}/g },
  { name: 'OpenRouter API key', re: /sk-or-v1-[A-Za-z0-9]{20,}/g },
  { name: 'Google/Gemini-style API key', re: /AIza[0-9A-Za-z_-]{25,}/g },
  { name: 'Generic private key', re: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/g },
];

const REQUIRED_ENV = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'APP_ENCRYPTION_KEY',
  'LLM_PROVIDER',
];

function walk(path: string, files: string[] = []) {
  for (const item of readdirSync(path)) {
    const full = join(path, item);
    const rel = relative(ROOT, full).replace(/\\/g, '/');
    if (/(node_modules|\.next|\.git|build|dist|out|coverage)$/.test(rel)) continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|js|jsx|mjs|json|xml|kt|gradle|md|webmanifest|svg)$/.test(item)) files.push(full);
  }
  return files;
}

const files = [
  ...INCLUDE_DIRS.flatMap((d) => walk(join(ROOT, d))),
  ...INCLUDE_FILES.map((f) => join(ROOT, f)),
].filter((f, i, arr) => arr.indexOf(f) === i);

let issues = 0;
console.log('[security-audit] checking source files only; docs are not scanned for billing/API usage.');

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const txt = readFileSync(file, 'utf8');
  for (const p of SECRET_PATTERNS) {
    const matches = txt.match(p.re) || [];
    const real = matches.filter((m) => !m.includes('...') && !m.includes('YOUR') && !m.includes('your_'));
    if (real.length) {
      issues += real.length;
      console.error(`[secret] ${p.name} pattern in ${rel}. Rotate key if real.`);
    }
  }
}

const envExample = readFileSync(join(ROOT, '.env.example'), 'utf8');
for (const key of REQUIRED_ENV) {
  if (!envExample.includes(key)) {
    issues++;
    console.error(`[env] missing ${key} in .env.example`);
  }
}

const gitignore = readFileSync(join(ROOT, '.gitignore'), 'utf8');
for (const required of ['.env', '.env.local', '*.db', 'node_modules', '.next']) {
  if (!gitignore.includes(required)) {
    issues++;
    console.error(`[gitignore] missing ${required}`);
  }
}

if (issues) {
  console.error(`[security-audit] failed with ${issues} issue(s).`);
  process.exit(1);
}
console.log('[security-audit] passed. No obvious source-level secrets found.');
