'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Footer } from '@/components/Footer';
import type { Plan } from '@/lib/pricing';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Grid3X3,
  Keyboard,
  WandSparkles,
  Lock,
  MessageCircle,
  Briefcase,
  Sparkles,
} from 'lucide-react';

const beforeAfter = [
  ['Late reply', 'sorry busy', 'Sorry, I got caught up. Didn’t mean to ignore you — I should’ve replied earlier.'],
  ['Not my fault', 'how do i say this is not my fault', 'I understand why it looks that way, but I want to clarify this wasn’t from my side.'],
  ['Hinglish', 'kkrh', 'kuch khaas nahi, tu bata?'],
  ['Work mail', 'tell x we did not book these parts error came', 'Hi, I’d like to clarify that these parts were not booked from our side. We are checking the error and will update you shortly.'],
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } },
};

function KeyboardMockup() {
  const keys = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  return (
    <div className="rounded-[2.3rem] border border-white/10 bg-[#0f0f16] p-4 shadow-[0_35px_120px_-45px_rgba(74,168,255,0.75)]">
      <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Rough</p>
        <p className="mt-1 text-lg font-semibold text-white">sorry busy</p>
      </div>
      <div className="mb-3 flex items-center justify-between rounded-2xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 px-4 py-3">
        <span className="text-sm text-white/80">Tap magic to rewrite</span>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 text-xl">🪄</span>
      </div>
      <div className="mb-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/5 p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Better</p>
        <p className="mt-1 text-sm leading-relaxed text-white/85">Sorry, I got caught up. Didn’t mean to ignore you.</p>
      </div>
      <div className="space-y-2">
        {keys.map((row, idx) => (
          <div key={row} className={`flex justify-center gap-1.5 ${idx === 1 ? 'px-5' : idx === 2 ? 'px-10' : ''}`}>
            {row.split('').map((k) => (
              <span key={k} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-white/85">{k}</span>
            ))}
          </div>
        ))}
        <div className="flex gap-1.5 pt-1">
          <span className="grid h-10 w-14 place-items-center rounded-xl bg-white/[0.08] text-xs">123</span>
          <span className="grid h-10 flex-1 place-items-center rounded-xl bg-white/[0.08] text-xs tracking-[0.25em] text-white/45">SPACE</span>
          <span className="grid h-10 w-14 place-items-center rounded-xl bg-white/[0.08] text-lg">↵</span>
        </div>
      </div>
    </div>
  );
}

export function Landing({ plans, country, currency }: { plans: Plan[]; country: string; currency: string }) {
  return (
    <div className="premium-shell flex min-h-screen flex-col overflow-hidden">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-30 border-b border-white/5 bg-ink/70 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
            <Link href="/keyboard" className="hover:text-white">Keyboard</Link>
            <Link href="/examples" className="hover:text-white">Examples</Link>
            <Link href="/dashboard/upgrade" className="hover:text-white">Pricing</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguagePicker />
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 sm:inline-flex">
              <Grid3X3 size={15} /> Open Banter
            </Link>
            <Link href="/keyboard" className="btn-plus rounded-full">
              Try beta
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        <motion.section variants={container} initial="hidden" animate="show" className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
          <div className="absolute left-1/2 top-16 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
          <div className="absolute right-0 top-28 -z-10 h-[360px] w-[360px] rounded-full bg-[#4aa8ff]/20 blur-[100px]" />

          <div>
            <motion.div variants={item} className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#4aa8ff]/25 bg-[#4aa8ff]/10 px-4 py-2">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#9fd0ff]">Android beta • limited testers</span>
            </motion.div>
            <motion.h1 variants={item} className="headline-balance max-w-4xl text-6xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              For the message
              <span className="block gradient-text">you almost didn’t send.</span>
            </motion.h1>
            <motion.p variants={item} className="mt-8 max-w-xl text-lg leading-relaxed text-white/72 sm:text-xl">
              Type rough. Tap 🪄. Banter turns awkward texts, apologies, DMs, and work messages into replies you can actually send.
            </motion.p>
            <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
              <Link href="/keyboard" className="btn-plus rounded-full px-6 py-3 text-base">Try keyboard beta <ArrowRight size={17} /></Link>
              <Link href="/examples" className="btn-ghost rounded-full px-6 py-3 text-base">See examples</Link>
            </motion.div>
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3 text-xs text-muted">
              <span className="chip"><ShieldCheck size={13} /> Sends only when you tap 🪄</span>
              <span className="chip"><Zap size={13} /> Works inside WhatsApp</span>
              <span className="chip"><Keyboard size={13} /> Beta spots limited</span>
            </motion.div>
          </div>

          <motion.div variants={item} className="relative">
            <KeyboardMockup />
          </motion.div>
        </motion.section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="mb-8 max-w-2xl">
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">See the shift</p>
            <h2 className="mt-3 text-5xl font-black tracking-[-0.05em]">Rough becomes sendable.</h2>
            <p className="mt-3 text-muted">People don’t need more typing. They need the right first draft at the right moment.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {beforeAfter.map(([label, rough, better]) => (
              <div key={label} className="premium-card rounded-[2rem] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9fd0ff]">{label}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-red-300/20 bg-red-400/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-red-200">Before</p>
                    <p className="mt-2 text-sm text-white/85">{rough}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">After 🪄</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">{better}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              [<MessageCircle key="i" />, 'Personal chats', 'Late replies, dry texts, apologies, crush replies, Hinglish, and everyday conversations.'],
              [<Briefcase key="i" />, 'Professional messages', 'Turn rough work notes into clear mails, updates, follow-ups, and polite clarifications.'],
              [<Lock key="i" />, 'Built for trust', 'Keyboard text is sent only when you tap 🪄. Private fields are protected. Devices can be revoked.'],
            ].map(([icon, title, body]) => (
              <div key={String(title)} className="premium-card rounded-[2rem] p-7">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4aa8ff]/10 text-[#9fd0ff]">{icon}</div>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#4aa8ff]/25 bg-[#4aa8ff]/10 p-8 backdrop-blur-xl sm:p-12">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">Private beta</p>
                <h2 className="mt-3 text-5xl font-black tracking-[-0.05em]">Testing with real Android users.</h2>
                <p className="mt-4 max-w-xl text-muted">Beta access is limited while we collect bugs, language examples, and keyboard feedback. If it helps you once, tell us where it failed next.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex gap-2"><Check className="mt-0.5 text-emerald-300" size={16} /> Download after login</li>
                  <li className="flex gap-2"><Check className="mt-0.5 text-emerald-300" size={16} /> Android APK beta</li>
                  <li className="flex gap-2"><Check className="mt-0.5 text-emerald-300" size={16} /> Feedback needed from testers</li>
                </ul>
                <Link href="/keyboard" className="btn-plus mt-6 w-full rounded-full">Get beta instructions</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">Pricing</p>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.05em]">Start free. Upgrade when it becomes a habit.</h2>
            </div>
            <p className="max-w-md text-sm text-muted">Prices shown for <span className="text-white/90">{country}</span> in {currency}. Simple plans while Banter is still early.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
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
                <Link href="/dashboard/upgrade" className={`${t.key === 'plus' ? 'btn-plus' : 'btn-ghost'} mt-8 w-full rounded-full`}>{t.key === 'free' ? 'Start free' : `Upgrade to ${t.name}`}</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 pt-12">
          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#173456] to-white/[0.04] p-10 text-center shadow-[0_40px_120px_-60px_rgba(74,168,255,0.9)]">
            <WandSparkles className="mx-auto mb-5 text-[#9fd0ff]" size={34} />
            <h2 className="text-5xl font-black tracking-[-0.05em]">Stop letting the reply sit there.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">Open the beta page, install the keyboard, and test it on one message you almost didn’t send.</p>
            <Link href="/keyboard" className="btn-plus mt-8 rounded-full px-7 py-3 text-base">Try keyboard beta <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
