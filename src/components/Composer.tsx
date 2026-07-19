'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, useT } from './LanguageContext';
import { CopyButton } from './CopyButton';
import { ChipSelect } from './ChipSelect';
import { RELATIONSHIPS, relAccessible } from '@/lib/engine/relationships';
import { TONES, toneAccessible } from '@/lib/engine/tones';
import { RELATIONSHIP_INTENTS, WORKS_INTENTS, WORKS_GROUPS, outputFormat, intentById } from '@/lib/engine/intents';
import { canUseWorks } from '@/lib/plans';
import type { GenerateOutput } from '@/lib/engine';
import { Sparkles, Zap, Crown, AlertTriangle, Save, RefreshCw, Wifi, WifiOff } from 'lucide-react';

function SaveButton({ text }: { text: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={async () => {
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text }),
        });
        if (res.ok) {
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }
      }}
      className="btn-ghost px-3 py-1.5 text-xs"
    >
      <Save size={14} /> {saved ? 'Saved' : 'Save'}
    </button>
  );
}

const listV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemV = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export function Composer() {
  const t = useT();
  const { outputLang } = useLang();
  const [role, setRole] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [relationship, setRelationship] = useState('partner');
  const [intent, setIntent] = useState('flirt');
  const [tone, setTone] = useState('warm');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [hurry, setHurry] = useState(false);
  const [context, setContext] = useState('');
  const [live, setLive] = useState<GenerateOutput | null>(null);
  const [meta, setMeta] = useState<{ relationshipLabel: string; intentLabel: string; toneLabel: string; language: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [suggest, setSuggest] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState('');
  const [limitHit, setLimitHit] = useState(false);
  const [acked, setAcked] = useState(false);
  const [ackCheck, setAckCheck] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const suggestAbort = useRef<AbortController | null>(null);
  const suggestCache = useRef<Map<string, string[]>>(new Map());

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setRole(d.user.role);
          setRemaining(d.remaining);
        }
      })
      .catch(() => {});
  }, []);

  // Pick up text shared into Banter from another app (Android share sheet).
  useEffect(() => {
    try {
      const shared = localStorage.getItem('banter_share');
      if (shared) {
        setContext(shared);
        localStorage.removeItem('banter_share');
      }
    } catch {
      /* ignore */
    }
  }, []);

  // One-time "you're in control" disclaimer — shown before the first reply,
  // not on the marketing homepage.
  useEffect(() => {
    try {
      if (localStorage.getItem('banter_ack') === '1') setAcked(true);
    } catch {
      /* ignore */
    }
  }, []);

  const rels = useMemo(() => RELATIONSHIPS.filter((r) => relAccessible(r.id, role || 'free')), [role]);
  const tones = useMemo(() => TONES.filter((tn) => toneAccessible(tn.id, role || 'free')), [role]);
  const works = useMemo(() => (canUseWorks(role || 'free') ? WORKS_INTENTS : []), [role]);
  const intentGroups = useMemo(() => {
    const groups = [{ label: 'Relationship', options: RELATIONSHIP_INTENTS.map((i) => ({ id: i.id, label: i.label })) }];
    if (works.length) {
      for (const g of WORKS_GROUPS) {
        const opts = works.filter((w) => w.group === g).map((w) => ({ id: w.id, label: w.label }));
        if (opts.length) groups.push({ label: g, options: opts });
      }
    }
    return groups;
  }, [works]);

  // The selected intent decides how the result is laid out (chat / email /
  // social / notice / document) — this is what makes "pick mail → different
  // format" actually visible in the UI.
  const fmt = useMemo(() => outputFormat(intentById(intent)), [intent]);
  const contextPh = useMemo(() => {
    switch (fmt) {
      case 'email':
        return 'What is this email about? (who, what, any details)';
      case 'notice':
        return 'What should the notice say? (decision, date, audience)';
      case 'social':
        return 'What is the post about?';
      case 'document':
        return 'What do you need written?';
      default:
        return t('context_ph');
    }
  }, [fmt, t]);

  useEffect(() => {
    if (!rels.find((r) => r.id === relationship)) setRelationship(rels[0]?.id || 'partner');
  }, [rels, relationship]);
  useEffect(() => {
    if (!tones.find((tn) => tn.id === tone)) setTone(tones[0]?.id || 'warm');
  }, [tones, tone]);
  useEffect(() => {
    const all = [...RELATIONSHIP_INTENTS, ...works];
    if (!all.find((i) => i.id === intent)) setIntent(RELATIONSHIP_INTENTS[0].id);
  }, [works, intent]);

  // Live as-you-type suggestions: abortable + cached so we never pile up
  // competing LLM calls behind the user's keystrokes.
  useEffect(() => {
    const text = context.trim();
    if (text.length < 4) {
      setSuggest([]);
      return;
    }
    const key = `${relationship}|${intent}|${tone}|${outputLang}|${text}`;
    if (suggestCache.current.has(key)) {
      setSuggest(suggestCache.current.get(key)!);
      return;
    }
    const handle = setTimeout(async () => {
      suggestAbort.current?.abort();
      const ac = new AbortController();
      suggestAbort.current = ac;
      setSuggesting(true);
      try {
        const res = await fetch('/api/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partial: text, relationship, intent, tone, language: outputLang }),
          signal: ac.signal,
        });
        const d = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(d.suggestions)) {
          suggestCache.current.set(key, d.suggestions);
          setSuggest(d.suggestions);
        } else {
          setSuggest([]);
        }
      } catch {
        /* aborted or failed — keep last suggestions */
      } finally {
        setSuggesting(false);
      }
    }, 800);
    return () => clearTimeout(handle);
  }, [context, relationship, intent, tone, outputLang]);

  function applySuggestion(s: string) {
    setContext((prev) => (prev.trim() ? prev + ' ' + s : s));
  }

  async function generateStream() {
    setError('');
    setLimitHit(false);
    setLive(null);
    setMeta(null);
    setStreaming(true);
    setPulse(false);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relationship, intent, tone, language: outputLang, context, length, hurry, stream: true }),
    });

    if (res.status === 429) {
      const d = await res.json().catch(() => ({}));
      setLimitHit(true);
      setRemaining(d.remaining ?? 0);
      setStreaming(false);
      return;
    }
    if (res.status === 403) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Upgrade required.');
      setStreaming(false);
      return;
    }
    if (!res.ok || !res.body) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Generation failed.');
      setStreaming(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    const process = (event: string, data: any) => {
      if (event === 'meta') setMeta(data);
      else if (event === 'delta') {
        setPulse(true);
        setTimeout(() => setPulse(false), 220);
      } else if (event === 'done') {
        setLive(data);
        setMeta(null);
        if (typeof data.remaining === 'number') setRemaining(data.remaining);
      } else if (event === 'remaining') {
        setRemaining(data.remaining);
      } else if (event === 'error') {
        setError(data.message || 'Generation failed.');
      }
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop() || '';
        for (const part of parts) {
          let event = '';
          let data = '';
          for (const line of part.split('\n')) {
            if (line.startsWith('event:')) event = line.slice(6).trim();
            else if (line.startsWith('data:')) data += line.slice(5).trim();
          }
          if (!event || !data) continue;
          try {
            process(event, JSON.parse(data));
          } catch {
            /* ignore malformed chunk */
          }
        }
      }
    } catch {
      if (!live) setError('Connection lost. Please retry.');
    } finally {
      setStreaming(false);
    }
  }

  const showOffline = live?.usedFallback;

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-semibold">{t('composer_title')}</h1>
          <p className="mt-0.5 text-sm text-muted">
            Pick who, what &amp; how — get words that sound like you.
          </p>
        </div>
        <AnimatePresence mode="popLayout">
          {remaining !== null && (
            <motion.span
              key={remaining}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="chip"
            >
              {remaining === null ? '∞' : remaining} {t('remaining')}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="card space-y-4 p-5"
      >
        <div>
          <ChipSelect
            groups={[{ label: t('label_relationship'), options: rels.map((r) => ({ id: r.id, label: r.label })) }]}
            value={relationship}
            onChange={setRelationship}
          />
        </div>

        <div>
          <ChipSelect groups={intentGroups} value={intent} onChange={setIntent} />
        </div>

        <div>
          <ChipSelect
            groups={[{ label: t('label_tone'), options: tones.map((tn) => ({ id: tn.id, label: tn.label })) }]}
            value={tone}
            onChange={setTone}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="label">{t('label_length')}</label>
            <select
              className="input w-auto"
              value={length}
              onChange={(e) => setLength(e.target.value as 'short' | 'medium' | 'long')}
            >
              <option value="short">{t('len_short')}</option>
              <option value="medium">{t('len_medium')}</option>
              <option value="long">{t('len_long')}</option>
            </select>
          </div>
          <label className="mt-5 inline-flex cursor-pointer items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={hurry}
              onChange={(e) => setHurry(e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            <Zap size={14} className="text-gold" /> {t('hurry')}
          </label>
        </div>

        <div>
          <label className="label">{t('label_context')}</label>
          <textarea
            className="input min-h-[90px] resize-y"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={contextPh}
          />
          <AnimatePresence>
            {suggest.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex flex-wrap gap-2 overflow-hidden"
              >
                {suggest.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => applySuggestion(s)}
                    className="chip hover:border-brand/60 hover:text-white"
                    title="Tap to add"
                  >
                    {suggesting ? '…' : s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={generateStream}
          disabled={streaming}
          className={`btn-premium w-full py-3 ${pulse ? 'animate-pulse-brand' : ''}`}
        >
          {streaming ? (
            <>
              <RefreshCw size={16} className="animate-spin" /> {t('generating')}
            </>
          ) : (
            <>
              <Sparkles size={16} /> {t('generate')}
            </>
          )}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle size={16} /> {error}
              </span>
              <button onClick={generateStream} className="btn-gold px-3 py-1.5 text-xs">
                {t('retry')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {limitHit && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle size={16} /> {t('limit_hit')}
              </span>
              <Link href="/dashboard/upgrade" className="btn-gold px-3 py-1.5 text-xs">
                {t('go_premium')}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Composing indicator (streaming) */}
      <AnimatePresence>
        {streaming && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="card space-y-4 p-5"
          >
            <div className="flex items-center gap-2 text-sm text-white/70">
              <RefreshCw size={15} className="animate-spin text-brand-soft" />
              {t('composing')}
            </div>
            {meta && (
              <div className="flex flex-wrap gap-2">
                <span className="chip">{meta.relationshipLabel}</span>
                <span className="chip">{meta.intentLabel}</span>
                <span className="chip">{meta.toneLabel}</span>
                <span className="chip uppercase">{meta.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-brand-soft"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {live && !streaming && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="card space-y-4 p-5"
          >
            <AnimatePresence>
              {showOffline && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-2.5 text-xs text-gold/90"
                >
                  <WifiOff size={15} className="mt-0.5 shrink-0" />
                  <span>{live.fallbackReason}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{t('result')}</h2>
              <button onClick={generateStream} disabled={streaming} className="btn-ghost px-3 py-1.5 text-xs">
                <RefreshCw size={13} className={streaming ? 'animate-spin' : ''} /> {t('regenerate')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="chip">{live.relationshipLabel}</span>
              <span className="chip">{live.intentLabel}</span>
              <span className="chip">{live.toneLabel}</span>
              <span className="chip uppercase">{live.language}</span>
              {live.format && live.format !== 'chat' && (
                <span className="chip border-gold/40 capitalize text-gold/90">{live.format}</span>
              )}
            </div>
            {/* Format-specific layout — this is what changes when the user
                picks mail / notice / social / document. */}
            {fmt === 'email' && live.subject ? (
              <div className="space-y-3">
                <div>
                  <label className="label">Subject</label>
                  <div className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-sm">{live.subject}</p>
                    <CopyButton text={live.subject} />
                  </div>
                </div>
                <div>
                  <label className="label">Body</label>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="whitespace-pre-wrap text-sm">{live.body}</p>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <CopyButton text={`Subject: ${live.subject}\n\n${live.body}`} />
                    <SaveButton text={`Subject: ${live.subject}\n\n${live.body}`} />
                  </div>
                </div>
              </div>
            ) : fmt === 'notice' && live.statement ? (
              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gold/80">
                  Formal notice
                </div>
                <p className="whitespace-pre-wrap text-sm">{live.statement}</p>
                <div className="mt-3 flex gap-2">
                  <CopyButton text={live.statement} />
                  <SaveButton text={live.statement} />
                </div>
              </div>
            ) : (
              <motion.div variants={listV} initial="hidden" animate="show" className="space-y-3">
                {live.variants.map((v, i) => (
                  <motion.div
                    key={i}
                    variants={itemV}
                    className={`rounded-xl border border-white/10 bg-black/20 p-3 ${
                      fmt === 'social'
                        ? 'border-l-2 border-l-pink-400/60'
                        : fmt === 'document'
                          ? 'border-l-2 border-l-sky-400/60'
                          : 'border-l-2 border-l-brand/60'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{v}</p>
                    <div className="mt-2 flex gap-2">
                      <CopyButton text={v} />
                      <SaveButton text={v} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {live.tip && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm"
              >
                <span className="font-medium text-brand-soft">{t('tip')}: </span>
                {live.tip}
              </motion.div>
            )}
            {live.coachNote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-gold/90"
              >
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>
                  <span className="font-medium">Coach note: </span>
                  {live.coachNote}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle live-AI hint when connected but idle */}
      <div className="flex items-center gap-2 px-1 text-xs text-muted">
        {showOffline ? (
          <span className="inline-flex items-center gap-1">
            <WifiOff size={13} /> {t('ai_offline')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <Wifi size={13} className="text-emerald-400" /> {t('ai_live')}
          </span>
        )}
      </div>

      <AnimatePresence>
        {!acked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 !mt-0 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="card max-w-md space-y-4 p-6 text-center"
            >
              <h2 className="text-xl font-semibold">You&apos;re in control</h2>
              <p className="text-sm text-white/80">
                Banter is still in active development. AI suggestions can be imperfect, occasionally off,
                or not right for your situation. You&apos;re always responsible for what you actually send —
                if something feels wrong, don&apos;t send it.
              </p>
              <label className="flex items-center justify-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={ackCheck}
                  onChange={(e) => setAckCheck(e.target.checked)}
                  className="h-4 w-4 accent-brand"
                />
                I understand — I&apos;ll review before sending
              </label>
              <button
                disabled={!ackCheck}
                onClick={() => {
                  try {
                    localStorage.setItem('banter_ack', '1');
                  } catch {
                    /* ignore */
                  }
                  setAcked(true);
                }}
                className="btn-premium w-full py-2.5 disabled:opacity-50"
              >
                Start using Banter
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
