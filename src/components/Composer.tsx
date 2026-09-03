import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WandSparkles, Copy, Check, RotateCcw, Heart, Briefcase,
  Sparkles, ArrowRight, Zap, Save,
} from 'lucide-react';

const relationships = [
  { id: 'partner', label: '💑 Partner', group: 'Personal' },
  { id: 'crush', label: '💜 Crush', group: 'Personal' },
  { id: 'friend', label: '👯 Best friend', group: 'Personal' },
  { id: 'family', label: '👨‍👩‍👧 Family', group: 'Personal' },
  { id: 'acquaintance', label: '🤝 Acquaintance', group: 'Personal' },
  { id: 'boss', label: '💼 Boss', group: 'Professional' },
  { id: 'colleague', label: '🏢 Colleague', group: 'Professional' },
  { id: 'client', label: '📊 Client', group: 'Professional' },
  { id: 'mentor', label: '🎓 Mentor', group: 'Professional' },
];

const tones = [
  { id: 'warm', label: '☀️ Warm' },
  { id: 'casual', label: '😎 Casual' },
  { id: 'formal', label: '🎩 Formal' },
  { id: 'flirty', label: '💫 Flirty' },
  { id: 'apologetic', label: '🙏 Apologetic' },
  { id: 'confident', label: '💪 Confident' },
  { id: 'playful', label: '🎉 Playful' },
];

const lengths = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
];

const quickStarts = [
  ['Late reply apology', "Hey, sorry I took so long to reply, I was busy"],
  ['Check in on a friend', "Just wanted to see how you're doing lately"],
  ['Crush text', "hey wanna hang out sometime"],
  ['Work email', "tell client that project is delayed due to issues"],
  ['Apology text', "sorry for what I said it came out wrong"],
];

// Simulated results
const demoResults: Record<string, string[]> = {
  default: [
    "Hey! I've been meaning to reach out — hope everything is going well on your end. Let me know if you'd like to catch up.",
    "Just wanted to drop a quick note to check in. It's been a while and I'd love to hear how things are going with you.",
    "Hope this message finds you at a good moment. I was thinking about our last conversation and wanted to reconnect.",
  ],
};

function ChipGroup({ label, options, value, onChange }: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <motion.button
            key={o.id}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange(o.id)}
            className={`chip transition-all ${value === o.id ? 'chip-active border-[#7c5cff] bg-[#7c5cff]/25 text-white shadow-[0_0_12px_-4px_rgba(124,92,255,0.7)]' : ''}`}
          >
            {o.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function Composer() {
  const [mode, setMode] = useState<'personal' | 'professional'>('personal');
  const [input, setInput] = useState('');
  const [relationship, setRelationship] = useState('friend');
  const [tone, setTone] = useState('warm');
  const [length, setLength] = useState('medium');
  const [hurry, setHurry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedResult, setSelectedResult] = useState(0);

  async function generate() {
    if (!input.trim()) return;
    setLoading(true);
    setResults([]);
    // Simulate AI generation delay
    await new Promise((r) => setTimeout(r, 1800));
    setResults(demoResults.default);
    setLoading(false);
    setSelectedResult(0);
  }

  async function copy(text: string, idx: number) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(idx);
    setTimeout(() => setCopied(null), 1600);
  }

  const filteredRelationships = relationships.filter(
    (r) => (mode === 'personal' ? r.group === 'Personal' : r.group === 'Professional')
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Compose</h1>
          <p className="text-sm text-muted mt-0.5">Turn your rough thought into something worth sending.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setMode('personal')}
            className={`mode-pill py-2 px-4 text-sm ${mode === 'personal' ? 'mode-pill-active' : ''}`}
          >
            <Heart size={14} />
            Personal
          </button>
          <button
            onClick={() => setMode('professional')}
            className={`mode-pill py-2 px-4 text-sm ${mode === 'professional' ? 'mode-pill-active' : ''}`}
          >
            <Briefcase size={14} />
            Works
          </button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left column — form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="space-y-5"
        >
          {/* Quick starts */}
          <div className="premium-card p-5">
            <p className="label mb-3">Quick start</p>
            <div className="flex flex-wrap gap-2">
              {quickStarts.map(([label, val]) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInput(val)}
                  className="chip hover:border-[#7c5cff]/50 hover:text-white transition-all"
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main input */}
          <div className="premium-card p-5 space-y-4">
            <div>
              <label className="label">What do you want to say? *</label>
              <motion.textarea
                whileFocus={{ boxShadow: '0 0 0 3px rgba(124,92,255,0.2)' }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Just type it rough… 'hey sry was busy' or 'need to tell boss deadline moved'"
                rows={4}
                className="input resize-none leading-relaxed"
              />
            </div>

            {/* Relationship chips */}
            <ChipGroup
              label="Relationship"
              options={filteredRelationships}
              value={relationship}
              onChange={setRelationship}
            />

            {/* Tone chips */}
            <ChipGroup
              label="Tone"
              options={tones}
              value={tone}
              onChange={setTone}
            />

            {/* Length + hurry */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[180px]">
                <p className="label">Length</p>
                <div className="flex gap-2">
                  {lengths.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLength(l.id)}
                      className={`chip flex-1 justify-center ${length === l.id ? 'chip-active' : ''}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={hurry}
                  onChange={(e) => setHurry(e.target.checked)}
                  className="h-4 w-4 accent-[#7c5cff]"
                />
                <span className="text-sm text-white/75">⚡ In a hurry</span>
              </label>
            </div>

            {/* Generate button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={generate}
              disabled={loading || !input.trim()}
              className="btn btn-premium w-full rounded-xl py-3.5 text-base shadow-[0_12px_40px_-12px_rgba(124,92,255,0.8)]"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap size={18} />
                  </motion.span>
                  Generating your message…
                </>
              ) : (
                <>
                  <WandSparkles size={18} />
                  Generate with Banter
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Right column — results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="premium-card p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff]"
                  >
                    <WandSparkles size={18} className="text-white" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-white">Banter is thinking…</p>
                    <p className="text-xs text-muted">Reading context · Picking the right words</p>
                  </div>
                </div>
                {[100, 80, 60].map((w, i) => (
                  <div key={i} className="animate-shimmer h-4 rounded-full" style={{ width: `${w}%` }} />
                ))}
              </motion.div>
            )}

            {!loading && results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">{results.length} options ready</p>
                  <button
                    onClick={generate}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <RotateCcw size={11} /> Regenerate
                  </button>
                </div>
                {results.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedResult(i)}
                    className={`premium-card cursor-pointer p-4 transition-all duration-200 ${
                      selectedResult === i
                        ? 'border-[#7c5cff]/50 shadow-[0_0_25px_-8px_rgba(124,92,255,0.6)]'
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Option {i + 1}</span>
                      {selectedResult === i && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#7c5cff]/25 px-2 py-0.5 text-[10px] font-bold text-[#c4b5fd]">
                          ✦ Selected
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-white/88">{r}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => { e.stopPropagation(); copy(r, i); }}
                        className="btn btn-ghost flex-1 rounded-lg py-1.5 text-xs"
                      >
                        {copied === i ? (
                          <><Check size={13} className="text-emerald-400" /> Copied!</>
                        ) : (
                          <><Copy size={13} /> Copy</>
                        )}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => { e.stopPropagation(); setSaved((prev) => [...prev, i]); }}
                        className={`btn rounded-lg py-1.5 text-xs ${saved.includes(i) ? 'border border-[#e9c46a]/50 bg-[#e9c46a]/15 text-[#e9c46a]' : 'btn-ghost'}`}
                      >
                        {saved.includes(i) ? (
                          <><Save size={13} className="fill-current" /> Saved</>
                        ) : (
                          <><Save size={13} /> Save</>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && results.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="premium-card flex min-h-[280px] flex-col items-center justify-center gap-4 p-8 text-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#7c5cff]/25 to-[#4aa8ff]/20 text-[#a78bfa]"
                >
                  <WandSparkles size={28} />
                </motion.div>
                <div>
                  <p className="font-semibold text-white">Your message appears here</p>
                  <p className="mt-1 text-sm text-muted">Type anything rough and hit generate.</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-muted">
                  <Sparkles size={12} className="text-[#a78bfa]" />
                  3 polished options, every time
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
