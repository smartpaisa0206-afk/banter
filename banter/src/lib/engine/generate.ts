import { relById, relLabel } from './relationships';
import { toneById, toneLabel } from './tones';
import { intentById, intentLabel, outputFormat, type OutputFormat } from './intents';
import { langLabel, detectLanguage } from './languages';

export interface GenerateInput {
  relationship: string;
  intent: string;
  tone: string;
  language: string;
  context?: string;
  length?: 'short' | 'medium' | 'long';
  hurry?: boolean;
}

export interface GenerateOutput {
  format: OutputFormat;
  variants: string[];
  subject?: string;
  body?: string;
  statement?: string;
  tip?: string;
  coachNote?: string;
  language: string;
  relationshipLabel: string;
  intentLabel: string;
  toneLabel: string;
  intimacy?: boolean;
  usedFallback?: boolean;
  fallbackReason?: string | null;
}

interface LLMResult {
  variants?: string[];
  suggestions?: string[];
  tip?: string;
  coachNote?: string | null;
  subject?: string;
  body?: string;
  statement?: string;
}

// Where a result came from, so we can surface honest fallback messaging.
type Source = 'llm' | 'none' | 'error';

const NORMAL_TIMEOUT = 20_000;
const STREAM_TIMEOUT = 30_000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseJSON(text: string): any {
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    try {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
    } catch {
      /* ignore */
    }
    return null;
  }
}

/**
 * fetch with a hard timeout + a single transparent retry on network blips
 * or 429/5xx. Keeps the app responsive even when a provider is flaky.
 */
async function safeFetch(
  url: string,
  init: RequestInit,
  opts: { timeoutMs?: number; retries?: number } = {},
): Promise<Response> {
  const timeoutMs = opts.timeoutMs ?? NORMAL_TIMEOUT;
  const retries = opts.retries ?? 1;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: ac.signal });
      clearTimeout(timer);
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        await sleep(350 * (attempt + 1));
        continue;
      }
      return res;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (attempt < retries) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

function reasonText(source: Source, reason?: string): string | null {
  if (source === 'none')
    return 'Template mode — no AI key set. Add a Groq/OpenAI key in .env to go live.';
  if (source === 'error') {
    if (reason === 'timeout') return 'The AI took too long — showing smart templates. Try again or switch on Hurry mode.';
    if (reason === 'network') return 'Could not reach the AI right now — showing smart templates instead.';
    return `AI hiccup (${reason}) — showing smart templates so you are never stuck.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Safety net: a small model can slip ambiguous / vulgar wording into a romantic
// or sensitive message (e.g. Hindi "hila"). We catch it, rewrite once with the
// bad words banned, and only if that still fails do we fall back to templates.
// ---------------------------------------------------------------------------
const RISKY_HI = [
  'hila', 'hilana', 'sula', 'sulana', 'chipak', 'rangeen', 'tharki',
  'chut', 'lund', 'gaand', 'bhos', 'rand', 'saali',
];
const RISKY_EN = ['fuck', 'shit', 'bitch', 'dick', 'cock', 'pussy', 'sex', 'horny', 'slut', 'whore', 'asshole', 'bastard'];

function findRisky(text: string, langCode: string): string[] {
  const norm = (text || '').toLowerCase().replace(/[^a-z\u0900-\u097F0-9]/g, ' ');
  const hay = ' ' + norm + ' ';
  const list = ['hi', 'hing', 'ta', 'te', 'bn', 'mr', 'ur'].includes(langCode)
    ? [...RISKY_HI, ...RISKY_EN]
    : RISKY_EN;
  return list.filter((w) => hay.includes(' ' + w + ' '));
}

function needsSafetyNet(input: GenerateInput): boolean {
  const i = intentById(input.intent);
  return !!i && (!!i.intimacy || !!i.sensitive);
}

async function regenerate(
  input: GenerateInput,
  avoid: string[],
  langLabel: string,
  format: string = 'chat',
): Promise<LLMResult | null> {
  const intent = intentById(input.intent);
  const sys =
    buildSystem({ langLabel, langCode: input.language, intimacy: intent?.intimacy, hurry: input.hurry, format }) +
    ` AVOID these words/phrases entirely: ${avoid.join(', ')}. Keep the message clearly romantic, respectful, and tasteful.`;
  const { result } = await callLLM(sys, buildUser(input), format);
  return result;
}

// ---------------------------------------------------------------------------
// Provider callers (non-streaming) — used by mobile API + live suggestions
// ---------------------------------------------------------------------------
async function callLLM(
  system: string,
  user: string,
  format: string = 'chat',
): Promise<{ result: LLMResult | null; source: Source; reason?: string }> {
  const provider = process.env.LLM_PROVIDER;
  try {
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const res = await safeFetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.9,
            max_tokens: 600,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
        },
        { timeoutMs: NORMAL_TIMEOUT },
      );
      if (!res.ok) return { result: null, source: 'error', reason: `OpenAI ${res.status}` };
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      return { result: content ? parseJSON(content) : null, source: 'llm' };
    }
    if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      const res = await safeFetch(
        'https://api.anthropic.com/v1/messages',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 600,
            system,
            messages: [
              {
                role: 'user',
                content:
                  user + '\n\nReply ONLY with a JSON object: ' + jsonShapeSpec(format) + '.',
              },
            ],
          }),
        },
        { timeoutMs: NORMAL_TIMEOUT },
      );
      if (!res.ok) return { result: null, source: 'error', reason: `Anthropic ${res.status}` };
      const data = await res.json();
      const content = data?.content?.[0]?.text;
      return { result: content ? parseJSON(content) : null, source: 'llm' };
    }
    if (provider === 'ollama') {
      const base = process.env.OLLAMA_HOST || 'http://localhost:11434';
      const model = process.env.OLLAMA_MODEL || 'llama3';
      const res = await safeFetch(
        `${base}/api/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            stream: false,
            format: 'json',
            options: { num_predict: 600 },
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
        },
        { timeoutMs: NORMAL_TIMEOUT },
      );
      if (!res.ok) return { result: null, source: 'error', reason: `Ollama ${res.status}` };
      const data = await res.json();
      const content = data?.message?.content;
      return { result: content ? parseJSON(content) : null, source: 'llm' };
    }
    if (provider === 'groq' && process.env.GROQ_API_KEY) {
      const res = await safeFetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
            temperature: 0.9,
            max_tokens: 600,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
        },
        { timeoutMs: NORMAL_TIMEOUT },
      );
      if (!res.ok) return { result: null, source: 'error', reason: `Groq ${res.status}` };
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      return { result: content ? parseJSON(content) : null, source: 'llm' };
    }
  } catch {
    return { result: null, source: 'error', reason: 'network' };
  }
  return { result: null, source: 'none' };
}

// ---------------------------------------------------------------------------
// Streaming (non-blocking first byte -> perceived speed). Shared by web UI.
// ---------------------------------------------------------------------------
async function readSSE(
  res: Response,
  onDelta: (piece: string) => void,
  extract: (json: any) => string | null | undefined,
): Promise<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith('data:')) continue;
      const data = t.slice(5).trim();
      if (data === '[DONE]') continue;
      try {
        const json = JSON.parse(data);
        const piece = extract(json);
        if (piece) {
          full += piece;
          onDelta(piece);
        }
      } catch {
        /* partial chunk, ignore */
      }
    }
  }
  return full;
}

async function readNDJSON(
  res: Response,
  onDelta: (piece: string) => void,
  extract: (json: any) => string | null | undefined,
): Promise<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      try {
        const json = JSON.parse(t);
        const piece = extract(json);
        if (piece) {
          full += piece;
          onDelta(piece);
        }
      } catch {
        /* ignore */
      }
    }
  }
  return full;
}

async function streamLLM(
  system: string,
  user: string,
  onDelta: (piece: string) => void,
  signal?: AbortSignal,
  format: string = 'chat',
): Promise<{ text: string; source: Source; reason?: string }> {
  const provider = process.env.LLM_PROVIDER;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), STREAM_TIMEOUT);
  if (signal) signal.addEventListener('abort', () => ac.abort());

  const common = (url: string, body: any, headers: Record<string, string>) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: ac.signal,
    });

  try {
    if (provider === 'groq' && process.env.GROQ_API_KEY) {
      const res = await common(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
          temperature: 0.9,
          max_tokens: 600,
          stream: true,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        },
        { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      );
      if (!res.ok) return { text: '', source: 'error', reason: `Groq ${res.status}` };
      const full = await readSSE(res, onDelta, (j) => j?.choices?.[0]?.delta?.content);
      clearTimeout(timer);
      return { text: full, source: 'llm' };
    }
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const res = await common(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          temperature: 0.9,
          max_tokens: 600,
          stream: true,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        },
        { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      );
      if (!res.ok) return { text: '', source: 'error', reason: `OpenAI ${res.status}` };
      const full = await readSSE(res, onDelta, (j) => j?.choices?.[0]?.delta?.content);
      clearTimeout(timer);
      return { text: full, source: 'llm' };
    }
    if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      const res = await common(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 600,
          stream: true,
          system,
          messages: [
            {
              role: 'user',
              content:
                user +
                '\n\nReply ONLY with a JSON object: ' + jsonShapeSpec(format) + '.',
            },
          ],
        },
        { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      );
      if (!res.ok) return { text: '', source: 'error', reason: `Anthropic ${res.status}` };
      const full = await readSSE(res, onDelta, (j) =>
        j?.type === 'content_block_delta' ? j?.delta?.text : null,
      );
      clearTimeout(timer);
      return { text: full, source: 'llm' };
    }
    if (provider === 'ollama') {
      const base = process.env.OLLAMA_HOST || 'http://localhost:11434';
      const model = process.env.OLLAMA_MODEL || 'llama3';
      const res = await common(
        `${base}/api/chat`,
        {
          model,
          stream: true,
          format: 'json',
          options: { num_predict: 600 },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        },
        {},
      );
      if (!res.ok) return { text: '', source: 'error', reason: `Ollama ${res.status}` };
      const full = await readNDJSON(res, onDelta, (j) => j?.message?.content);
      clearTimeout(timer);
      return { text: full, source: 'llm' };
    }
  } catch {
    clearTimeout(timer);
    return { text: '', source: 'error', reason: ac.signal.aborted ? 'timeout' : 'network' };
  }
  clearTimeout(timer);
  return { text: '', source: 'none' };
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------
function langNoteFor(code: string | undefined, label: string): string {
  if (code === 'hi' || code === 'hing') {
    return ` Write natural, modern, respectful Hindi as a young Indian adult texts${
      code === 'hing' ? ' (a Romanized Hindi / Hinglish mix is perfect)' : ''
    }. Stay faithful to the user's context and intent — reflect what they actually described; do not invent unrelated or physical actions. Keep it clearly romantic and respectful; avoid double-meaning or vulgar words.`;
  }
  if (code === 'ta' || code === 'te' || code === 'bn' || code === 'mr') {
    return ` Write natural, respectful ${label} as a young adult would text. Stay faithful to the user's context; do not invent unrelated actions. Avoid vulgar or double-meaning words.`;
  }
  if (code && code !== 'en') {
    return ` Write natural, respectful ${label}. Stay faithful to the user's context and intent.`;
  }
  return '';
}

function jsonShapeSpec(format: string): string {
  if (format === 'email')
    return '{"subject": string (a short, clear email subject line), "body": string (the email body, ready to send), "tip": string, "coachNote": string|null}';
  if (format === 'notice')
    return '{"statement": string (one clear, formal statement/notice, ready to send), "tip": string, "coachNote": string|null}';
  return '{"variants": string[], "tip": string, "coachNote": string|null}';
}

function buildSystem(opts: { langLabel: string; langCode?: string; intimacy?: boolean; hurry?: boolean; category?: string; format?: string }): string {
  const base = `You are Banter, a relationship-aware message coach for adults (18-25 couples and anyone who overthinks texts). Give ready-to-send messages — natural, specific, matched to relationship, intent, and tone. Reply in ${opts.langLabel}.`;
  const isStructured = opts.format === 'email' || opts.format === 'notice';
  const voice = isStructured
    ? `Sound like a real human, not a robot. No "As an AI". Mature and tasteful. Write a single, polished, copy-paste-ready result. Do not wrap it in quotes.`
    : `Sound like a real human, not a robot or a self-help book. No "As an AI". Mature and tasteful. Each variant is 1-2 short sentences, specific and copy-paste ready. Do not wrap messages in quotes.`;
  const langNote = langNoteFor(opts.langCode, opts.langLabel);
  const coherence = ' Keep ONE consistent tone (the chosen tone) and ONE language across every variant. Never mix languages mid-message or contradict the chosen tone.';
  const intimacy = opts.intimacy
    ? ` This is romantic/flirty. Keep it tasteful and romantic — suggestive but classy. NEVER use crude, vulgar, or sexually explicit words in any language. Avoid ambiguous slang that could be misread as crude (for example, in Hindi avoid words like "hila/hilana" and similar low-register terms). Imply closeness and connection — a date, time together — rather than explicit acts. This protects the user's relationship.`
    : '';
  const worksFmt = opts.category === 'works'
    ? ' This is a work/brand message — format it for the channel: email = a short Subject line + Body; social = a hook/caption; notice = a clear, formal statement. Stay professional and on-brand.'
    : '';
  const hurry = opts.hurry
    ? (isStructured ? ' Keep it concise and to the point.' : ' Return exactly 1-2 ultra-short, copy-paste-ready lines.')
    : (isStructured ? ' Return one polished, ready-to-send result.' : ' Return 3 distinct variants of varying style.');
  const out = ' Output strict JSON: ' + jsonShapeSpec(opts.format || 'chat') + ' (tip = one practical tip, max 1 sentence, no lecture; coachNote = a one-line caution only if the moment is sensitive, else null).';
  return base + ' ' + voice + ' ' + langNote + coherence + intimacy + worksFmt + hurry + out;
}

function buildUser(input: GenerateInput): string {
  const rel = relLabel(input.relationship);
  const intent = intentLabel(input.intent);
  const tone = toneLabel(input.tone);
  const len = input.length || 'medium';
  return `Relationship: ${rel}\nIntent: ${intent}\nTone: ${tone}\nLength: ${len}\n${
    input.context ? `Context: ${input.context}\n` : ''
  }Generate the message(s) now.`;
}

// Whether an LLM result actually satisfies the requested output format.
function hasContent(r: LLMResult | null, format: string): boolean {
  if (!r) return false;
  if (format === 'email') return typeof r.subject === 'string' && r.subject.trim().length > 0 && typeof r.body === 'string' && r.body.trim().length > 0;
  if (format === 'notice') return typeof r.statement === 'string' && r.statement.trim().length > 0;
  return Array.isArray(r.variants) && r.variants.length > 0;
}

function templateFallback(input: GenerateInput, format: string = 'chat'): LLMResult {
  const rel = relById(input.relationship)?.label || input.relationship;
  const intent = intentById(input.intent)?.label || input.intent;
  const tone = toneById(input.tone)?.label || input.tone;
  const ctx = input.context ? ` (${input.context})` : '';
  const v1 = `Hey — for your ${intent.toLowerCase()} with your ${rel.toLowerCase()} in a ${tone.toLowerCase()} tone${ctx}, here's a way to say it.`;
  const v2 = `I've been thinking about you and wanted to say something${ctx ? ' — ' + input.context : ''}.`;
  const v3 = `You mean a lot to me. I just wanted you to know.`;
  const tip = intentById(input.intent)?.tip || 'Be genuine and specific.';
  const coach = intentById(input.intent)?.coach || null;
  if (format === 'email') {
    return { subject: `${intent} — ${rel}`, body: `${v1}\n\n${v2}`, tip, coachNote: coach };
  }
  if (format === 'notice') {
    return { statement: `${v1} ${v2}`, tip, coachNote: coach };
  }
  if (input.hurry) return { variants: [v1], tip, coachNote: coach };
  return { variants: [v1, v2, v3], tip, coachNote: coach };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function llmReady(): boolean {
  const p = process.env.LLM_PROVIDER;
  if (p === 'openai') return !!process.env.OPENAI_API_KEY;
  if (p === 'anthropic') return !!process.env.ANTHROPIC_API_KEY;
  if (p === 'groq') return !!process.env.GROQ_API_KEY;
  if (p === 'ollama') return true; // local, may or may not be running
  return false;
}

export async function generate(input: GenerateInput): Promise<GenerateOutput> {
  const rel = relById(input.relationship);
  const tone = toneById(input.tone);
  const intent = intentById(input.intent);
  if (!rel || !tone || !intent) throw new Error('Invalid relationship/intent/tone');

  const format = outputFormat(intent);

  let langCode = input.language || 'en';
  const detected = input.context ? detectLanguage(input.context) : null;
  if (detected) langCode = detected;
  const lLabel = langLabel(langCode);

  const sys = buildSystem({ langLabel: lLabel, langCode, intimacy: intent.intimacy, hurry: input.hurry, category: intent.category, format });
  const usr = buildUser(input);
  const { result, source, reason } = await callLLM(sys, usr, format);

  let usedFallback = false;
  let fallbackReason: string | null = null;
  let r = result;
  if (!hasContent(r, format)) {
    r = templateFallback(input, format);
    usedFallback = true;
    fallbackReason = reasonText(source, reason);
  }

  // Safety net: a romantic/sensitive message must never ship ambiguous or
  // vulgar wording. Rewrite once with the bad words banned; else play safe.
  // (Relationship/chat intents only — structured work formats aren't sensitive.)
  if (!usedFallback && needsSafetyNet(input) && format === 'chat' && r && findRisky((r.variants ?? []).join(' '), langCode).length) {
    const avoid = findRisky((r.variants ?? []).join(' '), langCode);
    const retry = await regenerate(input, avoid, lLabel, format);
    if (retry && Array.isArray(retry.variants) && retry.variants.length && !findRisky((retry.variants ?? []).join(' '), langCode).length) {
      r = retry;
    } else {
      r = templateFallback(input, format);
      usedFallback = true;
      fallbackReason = 'Kept it tasteful — rewrote to safe options.';
    }
  }

  if (!r) r = templateFallback(input, format);

  return {
    format,
    variants: format === 'email' ? [r.body ?? ''] : format === 'notice' ? [r.statement ?? ''] : r.variants!,
    subject: format === 'email' ? r.subject : undefined,
    body: format === 'email' ? r.body : undefined,
    statement: format === 'notice' ? r.statement : undefined,
    tip: r.tip,
    coachNote: r.coachNote ?? undefined,
    language: langCode,
    relationshipLabel: rel.label,
    intentLabel: intent.label,
    toneLabel: tone.label,
    intimacy: intent.intimacy,
    usedFallback,
    fallbackReason,
  };
}

export type StreamEvent =
  | { type: 'meta'; relationshipLabel: string; intentLabel: string; toneLabel: string; language: string }
  | { type: 'delta'; text: string }
  | { type: 'done'; output: GenerateOutput }
  | { type: 'error'; message: string };

export async function streamGenerate(
  input: GenerateInput,
  emit: (e: StreamEvent) => void,
  signal?: AbortSignal,
): Promise<GenerateOutput> {
  const rel = relById(input.relationship);
  const tone = toneById(input.tone);
  const intent = intentById(input.intent);
  if (!rel || !tone || !intent) throw new Error('Invalid relationship/intent/tone');

  const format = outputFormat(intent);

  let langCode = input.language || 'en';
  const detected = input.context ? detectLanguage(input.context) : null;
  if (detected) langCode = detected;
  const lLabel = langLabel(langCode);

  emit({
    type: 'meta',
    relationshipLabel: rel.label,
    intentLabel: intent.label,
    toneLabel: tone.label,
    language: langCode,
  });

  const sys = buildSystem({ langLabel: lLabel, langCode, intimacy: intent.intimacy, hurry: input.hurry, category: intent.category, format });
  const usr = buildUser(input);

  const assemble = (r: LLMResult, usedFallback: boolean, fallbackReason: string | null): GenerateOutput => ({
    format,
    variants: format === 'email' ? [r.body ?? ''] : format === 'notice' ? [r.statement ?? ''] : r.variants!,
    subject: format === 'email' ? r.subject : undefined,
    body: format === 'email' ? r.body : undefined,
    statement: format === 'notice' ? r.statement : undefined,
    tip: r.tip,
    coachNote: r.coachNote ?? undefined,
    language: langCode,
    relationshipLabel: rel.label,
    intentLabel: intent.label,
    toneLabel: tone.label,
    intimacy: intent.intimacy,
    usedFallback,
    fallbackReason,
  });

  try {
    const { text, source, reason } = await streamLLM(sys, usr, (piece) => emit({ type: 'delta', text: piece }), signal, format);
    let r = text ? parseJSON(text) : null;
    let usedFallback = false;
    let fallbackReason: string | null = null;
    if (!hasContent(r, format)) {
      r = templateFallback(input, format);
      usedFallback = true;
      fallbackReason = reasonText(source, reason);
    }

    // Safety net (same as generate): ban ambiguous/vulgar wording in romantic
    // or sensitive messages, rewrite once, else fall back to safe templates.
    if (!usedFallback && needsSafetyNet(input) && format === 'chat' && r && findRisky((r.variants ?? []).join(' '), langCode).length) {
      const avoid = findRisky((r.variants ?? []).join(' '), langCode);
      const retry = await regenerate(input, avoid, lLabel, format);
      if (retry && Array.isArray(retry.variants) && retry.variants.length && !findRisky((retry.variants ?? []).join(' '), langCode).length) {
        r = retry;
      } else {
        r = templateFallback(input, format);
        usedFallback = true;
        fallbackReason = 'Kept it tasteful — rewrote to safe options.';
      }
    }

    if (!r) r = templateFallback(input, format);
    const output = assemble(r, usedFallback, fallbackReason);
    emit({ type: 'done', output });
    return output;
  } catch (e) {
    const r = templateFallback(input, format);
    const output = assemble(r, true, 'Generation failed — showing smart templates so you are never stuck.');
    emit({ type: 'done', output });
    return output;
  }
}

export interface SuggestInput {
  partial: string;
  relationship?: string;
  intent?: string;
  tone?: string;
  language?: string;
}

export interface SuggestOutput {
  suggestions: string[];
  language: string;
}

function templateSuggest(partial: string): string[] {
  const p = partial.trim();
  if (!p) {
    return [
      'Hey, how’s your day going?',
      'I was just thinking about you.',
      'Can we talk for a sec?',
    ];
  }
  return [
    p + (p.endsWith('?') || p.endsWith('.') ? ' ' : ' — ') + 'what do you think?',
    p + ' I’ve been meaning to tell you.',
    p + ' hope you’re good today.',
  ];
}

export async function liveSuggest(input: SuggestInput): Promise<SuggestOutput> {
  let langCode = input.language || 'en';
  const detected = detectLanguage(input.partial);
  if (detected) langCode = detected;
  const lLabel = langLabel(langCode);

  const sys = `You are Banter, a message coach. The user is typing a message${
    input.relationship ? ` to their ${input.relationship}` : ''
  }${input.intent ? `, intent: ${input.intent}` : ''}${input.tone ? `, tone: ${input.tone}` : ''}. Reply in ${lLabel}. Output strict JSON: {"suggestions": string[]} with 3 short, natural ways to continue or rephrase the text. Each under 20 words. No explanations.`;
  const usr = `Text so far: "${input.partial}"\nGive 3 suggestion continuations.`;

  const { result, source } = await callLLM(sys, usr);
  let suggestions: string[] = [];
  if (source === 'llm' && result && Array.isArray(result.suggestions)) suggestions = result.suggestions;
  if (!suggestions.length) suggestions = templateSuggest(input.partial);
  return { suggestions, language: langCode };
}
