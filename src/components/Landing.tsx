'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Footer } from '@/components/Footer';
import type { Plan } from '@/lib/pricing';
import {
  ArrowRight,
  Sparkles,
  Heart,
  Briefcase,
  Mail,
  MessageCircle,
  Keyboard,
  ShieldCheck,
  Zap,
  Check,
  Grid3X3,
} from 'lucide-react';

const personal = ['Flirt', 'Friend reply', 'Apology', 'Ask out', 'Invite', 'Check-in'];
const office = ['Mail', 'Follow-up', 'Notice', 'Agenda', 'Report', 'Marketing'];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } },
};

function FloatingCard({ className, label, text }: { className?: string; label: string; text: string }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-card backdrop-blur-2xl ${className || ''}`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9fd0ff]">{label}</p>
      <p className="text-sm leading-relaxed text-white/85">{text}</p>
    </div>
  );
}

export function Landing({ plans, country, currency }: { plans: Plan[]; country: string; currency: string }) {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 border-b border-white/5 bg-ink/65 backdrop-blur-2xl"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3">
          <Logo />
          <nav className="hidden items-center gap-5 text-sm text-white/70 lg:flex">
            <Link href="/introduction" className="hover:text-white">Introduction</Link>
            <Link href="/examples" className="hover:text-white">Examples</Link>
            <Link href="/methods" className="hover:text-white">How to use</Link>
            <Link href="/articles" className="hover:text-white">Articles</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguagePicker />
            <Link href="/support" className="btn-ghost hidden rounded-full sm:inline-flex">
              Support
            </Link>
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 sm:inline-flex">
              <Grid3X3 size={15} /> Workspace
            </Link>
            <Link href="/signup" className="btn-plus rounded-full">
              Start free
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* HERO */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24"
        >
          <div className="absolute left-1/2 top-16 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
          <div className="absolute right-0 top-28 -z-10 h-[360px] w-[360px] rounded-full bg-[#4aa8ff]/20 blur-[100px]" />

          <div>
            <motion.div variants={item} className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
              <img src="/hny-labs-logo.png" alt="HNY Labs" className="h-7 w-auto rounded bg-white px-2 py-0.5" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#9fd0ff]">Personal + Professional AI writing</span>
            </motion.div>
            <motion.h1 variants={item} className="max-w-3xl text-6xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              Say it better.
              <span className="block gradient-text">Send faster.</span>
            </motion.h1>
            <motion.p variants={item} className="mt-8 max-w-xl text-lg leading-relaxed text-white/68 sm:text-xl">
              The hardest part is not typing — it is deciding what feels right. Banter gives you a clear first draft for texts, mails, apologies, follow-ups, captions, and moments where you cannot afford to sound wrong.
            </motion.p>
            <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-plus rounded-full px-6 py-3 text-base">
                Start free <ArrowRight size={17} />
              </Link>
              <Link href="/dashboard" className="btn-ghost rounded-full px-6 py-3 text-base">
                Open workspace
              </Link>
            </motion.div>
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3 text-xs text-muted">
              <span className="chip"><ShieldCheck size={13} /> Private by design</span>
              <span className="chip"><Zap size={13} /> Live suggestions</span>
              <span className="chip"><Keyboard size={13} /> Keyboard coming soon</span>
            </motion.div>
          </div>

          <motion.div variants={item} className="relative min-h-[520px]">
            <div className="absolute left-0 top-10 hidden text-[170px] font-black leading-none text-white/[0.025] lg:block">010</div>
            <div className="absolute right-4 top-0 hidden text-[120px] font-black leading-none text-white/[0.035] lg:block">AI</div>

            <div className="absolute left-1/2 top-1/2 w-full max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_40px_120px_-50px_rgba(74,168,255,0.9)] backdrop-blur-2xl">
              <div className="rounded-[2rem] border border-white/10 bg-black/35 p-4">
                <div className="mb-4 grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-white/[0.04] p-2">
                  <span className="mode-pill mode-pill-active"><Heart size={15} /> Personal</span>
                  <span className="mode-pill"><Briefcase size={15} /> Professional</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-[#4aa8ff]/25 bg-[#4aa8ff]/10 p-4">
                    <p className="text-xs text-[#9fd0ff]">Banter suggestion</p>
                    <p className="mt-2 text-sm leading-relaxed">I had a great time talking to you today. Want to continue this over coffee?</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs text-muted">Professional version</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">Subject: Quick follow-up on our discussion...</p>
                  </div>
                </div>
              </div>
            </div>

            <FloatingCard className="absolute left-0 top-10 w-56" label="personal" text="Flirt, apologize, check in, invite, and reply with confidence." />
            <FloatingCard className="absolute bottom-12 right-0 w-60" label="professional" text="Write mails, notices, agendas, reports, and marketing copy in seconds." />
          </motion.div>
        </motion.section>

        {/* DECISION PSYCHOLOGY */}
        <section className="mx-auto max-w-7xl px-5 pb-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Stop second-guessing', 'Get a strong first draft so your brain stops looping on what to say.'],
              ['Sound like yourself', 'Choose tone and context; Banter keeps it natural, not robotic.'],
              ['Send before the moment dies', 'Fast suggestions help you reply while the conversation still feels alive.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                <p className="text-lg font-bold text-white">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INTRO / HOW IT WORKS */}
        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl lg:col-span-1">
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">Introduction</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">Built for the moment before you send.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Banter helps you move from blank screen to confident message. It gives you a starting point, not a fake personality.
              </p>
              <Link href="/introduction" className="btn-ghost mt-6 rounded-full">Read intro</Link>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">Examples</p>
              <h3 className="mt-3 text-2xl font-bold">See real samples</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">Compare weak replies with better replies for flirting, apologies, follow-ups, captions, and emails.</p>
              <Link href="/examples" className="btn-ghost mt-6 rounded-full">View examples</Link>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">Method</p>
              <h3 className="mt-3 text-2xl font-bold">Pick. Context. Copy.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">Choose Personal or Professional, add context, pick a tone, generate, then edit before you send.</p>
              <Link href="/methods" className="btn-plus mt-6 rounded-full">How to use it</Link>
            </div>
          </div>
        </section>

        {/* MODE SPLIT */}
        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">Choose your mode</p>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.05em] sm:text-6xl">One workspace. Two mindsets.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Switch context before you write. Banter reorganizes options for personal conversations or professional work.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-pink-300/15 bg-white/[0.045] p-7 backdrop-blur-xl">
              <Heart className="mb-8 text-pink-300" size={34} />
              <h3 className="text-4xl font-bold tracking-tight">Personal</h3>
              <p className="mt-3 text-muted">For friends, crushes, partners, family, and everyday replies.</p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {personal.map((x) => <span key={x} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm">{x}</span>)}
              </div>
            </div>
            <div className="rounded-[2rem] border border-[#4aa8ff]/30 bg-[#102238]/80 p-7 shadow-[0_35px_90px_-50px_rgba(74,168,255,0.9)] backdrop-blur-xl">
              <Briefcase className="mb-8 text-[#9fd0ff]" size={34} />
              <h3 className="text-4xl font-bold tracking-tight">Professional</h3>
              <p className="mt-3 text-white/68">For professional mails, business documents, captions, and growth copy.</p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {office.map((x) => <span key={x} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm">{x}</span>)}
              </div>
            </div>
          </div>
        </section>

        {/* KEYBOARD */}
        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl sm:p-12">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#4aa8ff]/20 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                  <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">Phase 2</p>
                <h2 className="mt-3 text-5xl font-black tracking-[-0.05em]">Keyboard mode is next.</h2>
                <p className="mt-5 text-muted">Use Banter inside WhatsApp, Instagram, Gmail, LinkedIn, and anywhere you type.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {['WhatsApp replies', 'Gmail drafts', 'LinkedIn posts'].map((x) => (
                  <div key={x} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <Keyboard className="mb-4 text-[#9fd0ff]" />
                    <p className="font-semibold">{x}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">Pricing</p>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.05em]">Pick the level that fits.</h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              Prices shown for <span className="text-white/90">{country}</span> in {currency}. Upgrade when you need Professional mode and unlimited writing.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((t) => (
              <div key={t.key} className={`rounded-3xl border p-6 ${t.key === 'plus' ? 'border-[#4aa8ff]/60 bg-[#173456]' : 'border-white/10 bg-white/[0.045]'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{t.name}</h3>
                  {t.key === 'plus' && <span className="badge-plus">Most popular</span>}
                  {t.key === 'pro' && <span className="badge-plus">Power</span>}
                </div>
                <p className="mt-7 text-4xl font-black tracking-tight">{t.price}</p>
                <ul className="mt-6 space-y-3 text-sm text-white/78">
                  {t.feats.map((f) => <li key={f} className="flex gap-2"><Check size={15} className="mt-0.5 text-emerald-300" />{f}</li>)}
                </ul>
                <Link href="/dashboard/upgrade" className={`${t.key === 'plus' ? 'btn-plus' : 'btn-ghost'} mt-8 w-full rounded-full`}>
                  {t.key === 'free' ? 'Start free' : `Upgrade to ${t.name}`}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-12">
          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#173456] to-white/[0.04] p-10 text-center shadow-[0_40px_120px_-60px_rgba(74,168,255,0.9)]">
            <Mail className="mx-auto mb-5 text-[#9fd0ff]" size={34} />
            <h2 className="text-5xl font-black tracking-[-0.05em]">Stop overthinking the send button.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">Open Banter, choose Personal or Professional, and get the right words in seconds.</p>
            <Link href="/signup" className="btn-plus mt-8 rounded-full px-7 py-3 text-base">
              Create free account <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
