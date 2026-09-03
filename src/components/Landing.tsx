'use client';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { Footer } from './Footer';
import { CursorEffects } from './CursorEffects';
import {
  ArrowRight, ShieldCheck, Zap, Check, Keyboard, WandSparkles,
  Lock, MessageCircle, Briefcase, Sparkles, Star, Users, Globe,
  ChevronDown, MessageSquare, Heart, Send, Wand2, Layers,
} from 'lucide-react';

const examples = [
  { who: 'Late reply', emoji: '⏰', rough: 'sorry busy', better: "Sorry, I got caught up. Didn't mean to ignore you — I should've replied earlier." },
  { who: 'Crush text', emoji: '💜', rough: 'hey wanna hang', better: "Hey! I was thinking about you — would love to grab coffee this week if you're free?" },
  { who: 'Hinglish', emoji: '🇮🇳', rough: 'kkrh', better: 'kuch khaas nahi, tu bata?' },
  { who: 'Work mail', emoji: '💼', rough: 'tell x we did not book error came', better: "Hi, I'd like to clarify these parts were not booked from our side. We're checking the error and will update you shortly." },
];

const features = [
  { icon: <MessageCircle size={22} />, title: 'Relationship-aware', desc: 'Knows the difference between texting your crush vs emailing your boss.', color: '#7c5cff' },
  { icon: <WandSparkles size={22} />, title: 'AI-powered rewrites', desc: 'Powered by Groq / OpenAI / Anthropic with smart template fallback.', color: '#4aa8ff' },
  { icon: <Globe size={22} />, title: 'Multi-language', desc: 'English, Hinglish, and growing. Write in the language you actually use.', color: '#e9c46a' },
  { icon: <Keyboard size={22} />, title: 'Native keyboard', desc: 'Android keyboard that rewrites without leaving your app.', color: '#a78bfa' },
  { icon: <ShieldCheck size={22} />, title: 'Private by default', desc: 'Encrypted at rest, rate-limited, secure sessions. Your words stay yours.', color: '#34d399' },
  { icon: <Zap size={22} />, title: 'Instant results', desc: 'Ready-to-send in under 3 seconds. No overthinking required.', color: '#f87171' },
];

const tags = ['Apologies', 'Late replies', 'Work mail', 'Hinglish', 'Crush texts', 'Follow-ups', 'DMs', 'Clarifications', 'Pitches', 'Break-ups', 'Thank-yous', 'Check-ins'];

const stats = [
  { value: '50K+', label: 'Messages rewritten', icon: <MessageSquare size={18} /> },
  { value: '4.9★', label: 'User satisfaction', icon: <Star size={18} /> },
  { value: '12+', label: 'Languages supported', icon: <Globe size={18} /> },
  { value: '98%', label: 'Said it saved time', icon: <Zap size={18} /> },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariant = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 22 } },
};

function PhoneDemo() {
  const [idx, setIdx] = useState(0);
  const ex = examples[idx];

  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % examples.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto max-w-xs">
      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-10 bottom-12 hidden rotate-[-8deg] rounded-2xl border border-[#8b5cf6]/40 bg-[#8b5cf6]/15 px-4 py-3 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-[#c4b5fd] backdrop-blur-xl md:block shadow-[0_8px_32px_-8px_rgba(124,92,255,0.4)]"
      >
        private<br />beta<br />2026
      </motion.div>

      {/* Floating success badge */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -right-8 top-8 hidden rotate-[6deg] rounded-2xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 text-[10px] font-bold text-emerald-400 backdrop-blur-xl md:block shadow-[0_8px_24px_-8px_rgba(52,211,153,0.4)]"
      >
        ✓ Ready to send
      </motion.div>

      {/* Phone shell */}
      <div className="rounded-[2.5rem] border border-white/12 bg-[#0a0a14] p-4 shadow-[0_50px_130px_-40px_rgba(124,92,255,1)]">
        {/* Notch */}
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/15" />

        {/* Chat header */}
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3">
          <div className="relative h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff] shadow-glow">
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a14] bg-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-bold text-white">{ex.who}</div>
            <div className="text-[10px] text-muted">banter is rewriting…</div>
          </div>
          <span className="text-lg">{ex.emoji}</span>
        </div>

        {/* Rough message (outgoing) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`rough-${idx}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="ml-auto max-w-[88%] rounded-2xl rounded-br-md border border-white/10 bg-white/[0.06] p-3 text-sm text-white/75"
          >
            <p className="mb-1.5 text-[9px] uppercase tracking-[0.18em] text-muted">Rough draft</p>
            <span className="line-through decoration-[#a78bfa] decoration-2">{ex.rough}</span>
          </motion.div>
        </AnimatePresence>

        {/* Magic wand button */}
        <div className="my-3.5 flex items-center justify-between rounded-2xl border border-[#8b5cf6]/35 bg-[#8b5cf6]/12 px-3.5 py-2.5">
          <span className="text-xs font-semibold text-[#c4b5fd]">Tap to rewrite ✦</span>
          <motion.span
            animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#4aa8ff] text-base shadow-[0_0_30px_-8px_rgba(124,92,255,1)]"
          >
            🪄
          </motion.span>
        </div>

        {/* Rewritten message (incoming) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`better-${idx}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="max-w-[92%] rounded-2xl rounded-bl-md border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-3 text-sm leading-relaxed text-white/92"
          >
            <p className="mb-1.5 text-[9px] uppercase tracking-[0.18em] text-[#9fd0ff]">Banter ✦</p>
            {ex.better}
          </motion.div>
        </AnimatePresence>

        {/* Mock keyboard */}
        <div className="mt-4 grid grid-cols-10 gap-1">
          {'qwertyuiopasdfghjklzxcvbnm'.slice(0, 20).split('').map((k, i) => (
            <motion.span
              key={`${k}-${i}`}
              whileHover={{ scale: 1.2, background: 'rgba(124,92,255,0.2)' }}
              className="h-5 rounded-md bg-white/[0.06] cursor-pointer transition-colors"
            />
          ))}
        </div>
        <div className="mt-1.5 flex gap-1">
          <span className="grid h-8 w-12 place-items-center rounded-lg bg-white/[0.07] text-[9px] text-white/50">123</span>
          <span className="grid h-8 flex-1 place-items-center rounded-lg bg-white/[0.07] text-[9px] tracking-[0.2em] text-white/30">SPACE</span>
          <span className="grid h-8 w-12 place-items-center rounded-lg bg-white/[0.07] text-sm text-white/70">↵</span>
        </div>

        {/* Pagination dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {examples.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-[#a78bfa]' : 'w-3 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      className="flex flex-col items-center gap-1 text-xs text-muted"
    >
      <span>Scroll to explore</span>
      <ChevronDown size={16} />
    </motion.div>
  );
}

export function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="premium-shell flex min-h-screen flex-col overflow-hidden">
      <CursorEffects />

      {/* ===== NAVBAR ===== */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-white/8 bg-[#0b0b12]/80 backdrop-blur-2xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
            {[
              { to: '/examples', label: 'Examples' },
              { to: '/methods', label: 'How it works' },
              { to: '/keyboard', label: 'Keyboard' },
              { to: '/articles', label: 'Articles' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-white transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-[#7c5cff] to-[#4aa8ff] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link to="/login" className="btn btn-ghost hidden rounded-full px-4 py-2 text-sm sm:inline-flex">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-premium rounded-full px-5 py-2.5 text-sm">
              <Sparkles size={14} />
              Try free
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden px-5 pt-16 pb-24 text-center">
        {/* Background orbs */}
        <div className="orb h-[500px] w-[500px] bg-[#7c5cff]/20 -top-20 -left-40" style={{ animationDelay: '0s' }} />
        <div className="orb h-[400px] w-[400px] bg-[#4aa8ff]/15 top-1/3 -right-32" style={{ animationDelay: '4s' }} />
        <div className="orb h-[350px] w-[350px] bg-[#e9c46a]/10 bottom-10 left-1/3" style={{ animationDelay: '8s' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7c5cff]/40 bg-[#7c5cff]/12 px-4 py-2 text-xs font-semibold text-[#c4b5fd] shadow-[0_0_30px_-10px_rgba(124,92,255,0.6)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Private Beta · 2026 · Free to start
            <ArrowRight size={12} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Say the right thing
            <br />
            <span className="gradient-text">to the right person.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-muted sm:text-xl"
          >
            Banter rewrites your rough drafts into ready-to-send messages — for flirting, apologizing, pitching, or just checking in. In seconds.
          </motion.p>

          {/* Tags marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 overflow-hidden"
          >
            <div className="flex gap-2" style={{ width: 'max-content', animation: 'marquee 28s linear infinite' }}>
              {[...tags, ...tags].map((tag, i) => (
                <span key={i} className="chip shrink-0">✦ {tag}</span>
              ))}
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link to="/signup" className="btn btn-premium rounded-full px-8 py-4 text-base shadow-[0_20px_60px_-15px_rgba(124,92,255,0.8)] animate-pulse-brand">
              <Sparkles size={18} />
              Start for free
              <ArrowRight size={16} />
            </Link>
            <Link to="/examples" className="btn btn-ghost rounded-full px-6 py-4 text-base">
              See examples
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-muted"
          >
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Free forever plan</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Works instantly</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ScrollIndicator />
        </motion.div>
      </section>

      {/* ===== PHONE DEMO ===== */}
      <section className="relative mx-auto max-w-7xl px-5 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="kicker">How it works</p>
            <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl">
              Rough thought.
              <br />
              <span className="gradient-text">Magic tap.</span>
              <br />
              Sendable reply.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Type what you actually mean — even if it's messy. Banter reads the relationship, the vibe, and the context, then gives you something you'd actually want to send.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: <Wand2 size={18} />, title: 'Paste your rough draft', desc: 'Just type what you mean, no polish needed.' },
                { icon: <Layers size={18} />, title: 'Pick the relationship & tone', desc: 'Crush, coworker, parent, stranger — it adapts.' },
                { icon: <Send size={18} />, title: 'Copy & send in seconds', desc: 'Ready-to-send, every time.' },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 hover:border-[#7c5cff]/30 hover:bg-[#7c5cff]/5 transition-all duration-300"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#7c5cff]/30 to-[#4aa8ff]/20 text-[#a78bfa]">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{step.title}</p>
                    <p className="text-sm text-muted">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right phone */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhoneDemo />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative py-20 border-y border-white/8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7c5cff]/5 to-transparent pointer-events-none" />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-5 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVariant}
              className="group premium-card flex flex-col items-center gap-2 p-6 text-center cursor-default"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#7c5cff]/20 text-[#a78bfa] group-hover:bg-[#7c5cff]/35 transition-colors duration-300">
                {s.icon}
              </div>
              <div className="text-3xl font-black gradient-text">{s.value}</div>
              <div className="text-sm text-muted">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="kicker">Everything you need</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
            Built for real <span className="gradient-text">conversations</span>
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">Not just AI completions. Banter understands context, relationships, and tone — so you always sound like the best version of yourself.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariant}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300 } }}
              className="group premium-card card-hover p-6 cursor-default"
            >
              <div
                className="mb-4 grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${f.color}22`, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="mb-2 font-bold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== MODES SECTION ===== */}
      <section className="relative overflow-hidden py-24 border-y border-white/8">
        <div className="orb h-[400px] w-[400px] bg-[#4aa8ff]/12 -top-20 right-0 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="kicker">Two modes, one app</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
                Personal or <span className="gradient-text">Professional</span>
              </h2>
              <p className="mt-4 text-lg text-muted leading-relaxed">
                Switch between Personal mode for your social life — and Works mode for emails, marketing copy, and professional writing.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-4"
            >
              {[
                { icon: <Heart size={20} />, mode: 'Personal', color: '#a78bfa', desc: 'For partners, friends, family, crushes, apologies, invites, and everyday chats.', badge: 'Free' },
                { icon: <Briefcase size={20} />, mode: 'Professional (Works)', color: '#4aa8ff', desc: 'For emails, follow-ups, notices, social posts, pitches, and marketing copy.', badge: 'Plus' },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  variants={itemVariant}
                  className="premium-card card-hover flex items-start gap-4 p-5 cursor-default"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${m.color}25`, color: m.color }}>
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{m.mode}</h3>
                      <span className={i === 0 ? 'badge-plus' : 'badge-pro'}>{m.badge}</span>
                    </div>
                    <p className="text-sm text-muted">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative overflow-hidden px-5 py-28">
        <div className="orb h-[600px] w-[600px] bg-[#7c5cff]/20 -top-32 left-1/2 -translate-x-1/2 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <div className="aurora-card p-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff] shadow-[0_0_60px_-10px_rgba(124,92,255,0.9)]"
            >
              <WandSparkles size={28} className="text-white" />
            </motion.div>
            <h2 className="text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
              Start communicating <span className="gradient-text">better</span>
            </h2>
            <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
              Free forever. No credit card. Works instantly.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/signup" className="btn btn-premium rounded-full px-10 py-4 text-base shadow-[0_20px_60px_-15px_rgba(124,92,255,0.9)] animate-pulse-brand">
                <Sparkles size={18} />
                Get started free
                <ArrowRight size={16} />
              </Link>
              <Link to="/dashboard/upgrade" className="btn btn-ghost rounded-full px-6 py-4 text-base">
                View pricing
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1"><Lock size={11} /> End-to-end secure</span>
              <span className="flex items-center gap-1"><ShieldCheck size={11} /> Privacy first</span>
              <span className="flex items-center gap-1"><Users size={11} /> 50K+ users</span>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
