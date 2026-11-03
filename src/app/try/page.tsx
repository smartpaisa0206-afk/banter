'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, ArrowRight, RotateCcw, Check } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { CopyButton } from '@/components/CopyButton';
import { Logo } from '@/components/Logo';

const RELATIONSHIPS = [
  { id: 'crush', label: 'Crush 💘' },
  { id: 'partner', label: 'Partner ❤️' },
  { id: 'friend', label: 'Friend 🤝' },
  { id: 'boss', label: 'Boss 💼' },
];

const TONES = [
  { id: 'confident', label: 'Confident' },
  { id: 'warm', label: 'Warm' },
  { id: 'playful', label: 'Playful' },
  { id: 'casual', label: 'Casual' },
  { id: 'empathetic', label: 'Empathetic' },
  { id: 'formal', label: 'Formal' },
];

const TRIAL_LIMIT = 3;

export default function TryPage() {
  const [draft, setDraft] = useState('');
  const [relationship, setRelationship] = useState('crush');
  const [tone, setTone] = useState('confident');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(TRIAL_LIMIT);

  useEffect(() => {
    fetch('/api/trial/generate')
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.remaining === 'number') setRemaining(d.remaining);
      })
      .catch(() => {});
  }, []);

  async function run() {
    if (!draft.trim() || loading || remaining <= 0) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const r = await fetch('/api/trial/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationship, tone, context: draft.trim(), language: 'en' }),
      });
      const d = await r.json();
      if (typeof d.remaining === 'number') setRemaining(d.remaining);
      if (!r.ok) {
        setError(d.error || 'Something went wrong — try again.');
        return;
      }
      setResult(d.text || '');
    } catch {
      setError('Network hiccup — try again.');
    } finally {
      setLoading(false);
    }
  }

  const exhausted = remaining <= 0;

  return (
    <div className="premium-shell relative min-h-screen overflow-hidden">
      <div className="orb animate-float-slow h-[420px] w-[420px] bg-[#4c6fff]/20 -top-24 -left-32" />
      <div className="orb animate-float-slow h-[360px] w-[360px] bg-[#4aa8ff]/12 top-1/3 -right-28" style={{ animationDelay: '4s' }} />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Link href="/"><Logo /></Link>
        <Link href="/signup" className="btn btn-ghost rounded-full px-4 py-2 text-sm">
          Sign up free <ArrowRight size={14} />
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-5 pb-24 pt-8">
        <Reveal className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4c6fff]/40 bg-[#2c3480]/30 px-4 py-1.5 text-xs font-semibold text-[#aab8f5]">
            <Sparkles size={13} /> No login needed · {remaining} free {remaining === 1 ? 'try' : 'tries'} left today
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Try Banter <span className="gradient-text-cobalt">right now</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Paste your rough draft, pick who it&apos;s for and the vibe — watch it become sendable.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-8">
          <div className="premium-card card-lift p-5 sm:p-7">
            <label className="label" htmlFor="trial-draft">What do you want to say?</label>
            <textarea
              id="trial-draft"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="e.g. sorry if u felt bad…"
              className="input min-h-[110px] resize-y"
            />

            <div className="mt-5">
              <p className="label">Who is it for?</p>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIPS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRelationship(r.id)}
                    className={`chip transition-all ${relationship === r.id ? 'border-[#4c6fff]/60 bg-[#2c3480]/40 text-white shadow-glow' : 'hover:border-white/25'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="label">Pick the vibe</p>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`chip transition-all ${tone === t.id ? 'border-[#4c6fff]/60 bg-[#2c3480]/40 text-white shadow-glow' : 'hover:border-white/25'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={run}
              disabled={loading || !draft.trim() || exhausted}
              className="btn btn-premium mt-6 w-full rounded-2xl py-3.5 text-base"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Rewriting…
                </span>
              ) : exhausted ? (
                'Trial used up for today'
              ) : (
                <><Wand2 size={17} /> Rewrite it</>
              )}
            </button>

            {error && (
              <p className="animate-pop-in mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5 rounded-2xl border border-[#4c6fff]/40 bg-[#2c3480]/25 p-5 shadow-glow"
                >
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b9bf0]">Banter ✦</p>
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-white">{result}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <CopyButton text={result} />
                    <button
                      onClick={() => { setResult(''); setDraft(''); }}
                      className="btn-ghost px-3 py-1.5 text-xs"
                    >
                      <RotateCcw size={14} /> Try another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-8">
          <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-[#4c6fff]/30 bg-[#2c3480]/20 p-8 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#4c6fff] to-[#2c3480] shadow-glow">
              <Check size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-white">Liked that? There&apos;s more.</h2>
            <p className="max-w-sm text-sm text-muted">
              Free accounts get <span className="font-bold text-white">5 rewrites a day</span>, 17 languages, tone learning, and history.
            </p>
            <Link href="/signup" className="btn btn-premium rounded-full px-7 py-3">
              Create free account <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
