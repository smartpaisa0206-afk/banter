'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  Play,
} from 'lucide-react';

const examples = [
  { who: 'Late reply', rough: 'sorry busy', better: "Sorry, I got caught up. Didn't mean to ignore you — I should've replied earlier." },
  { who: 'Not my fault', rough: 'how do i say this is not my fault', better: "I understand why it looks that way, but I want to clarify this wasn't from my side." },
  { who: 'Hinglish', rough: 'kkrh', better: 'kuch khaas nahi, tu bata?' },
  { who: 'Work mail', rough: 'tell x we did not book these parts error came', better: 'Hi, I’d like to clarify these parts were not booked from our side. We are checking the error and will update you shortly.' },
];

const tags = ['Apologies', 'Late replies', 'Work mail', 'Hinglish', 'Crush texts', 'Follow-ups', 'DMs', 'Clarifications'];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } } };

function PhoneDemo() {
  const [idx, setIdx] = useState(0);
  const ex = examples[idx];

  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % examples.length), 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="absolute -left-8 bottom-8 hidden rotate-[-10deg] rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-5 py-4 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#c4b5fd] backdrop-blur md:block">
        private<br />beta<br />2026
      </div>
      <div className="rounded-[2.4rem] border border-white/10 bg-[#0e0e15] p-4 shadow-[0_45px_120px_-45px_rgba(124,92,255,0.95)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-1">
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/15" />
        <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff]">
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0e0e15] bg-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{ex.who}</div>
            <div className="text-xs text-muted">rewriting…</div>
          </div>
        </div>

        <motion.div key={`rough-${idx}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="ml-auto max-w-[86%] rounded-2xl rounded-br-md border border-white/10 bg-white/[0.06] p-3 text-sm text-white/80">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted">Rough</p>
          <span className="line-through decoration-[#a78bfa] decoration-2">{ex.rough}</span>
        </motion.div>

        <div className="my-4 flex items-center justify-between rounded-2xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-4 py-3">
          <span className="text-xs font-semibold text-[#c4b5fd]">Tap to rewrite</span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#4aa8ff] text-lg shadow-[0_0_35px_-10px_rgba(124,92,255,1)]">🪄</span>
        </div>

        <motion.div key={`better-${idx}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-[92%] rounded-2xl rounded-bl-md border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-3 text-sm leading-relaxed text-white/90">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#9fd0ff]">After</p>
          {ex.better}
        </motion.div>

        <div className="mt-5 grid grid-cols-10 gap-1.5">
          {'qwertyuiopasdfghjklzxcvbnm'.slice(0, 30).split('').map((k, i) => (
            <span key={`${k}-${i}`} className="h-6 rounded-md bg-white/[0.06]" />
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          <span className="grid h-9 w-14 place-items-center rounded-lg bg-white/[0.07] text-[10px]">123</span>
          <span className="grid h-9 flex-1 place-items-center rounded-lg bg-white/[0.07] text-[10px] tracking-[0.25em] text-white/35">SPACE</span>
          <span className="grid h-9 w-14 place-items-center rounded-lg bg-white/[0.07] text-sm">↵</span>
        </div>
        <div className="mt-4 flex justify-center gap-1.5">
          {examples.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all ${i === idx ? 'w-7 bg-[#a78bfa]' : 'w-4 bg-white/20'}`} />)}
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
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 sm:inline-flex"><Grid3X3 size={15} /> Open Banter</Link>
            <Link href="/keyboard" className="btn-plus rounded-full">Try beta</Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        <motion.section variants={container} initial="hidden" animate="show" className="relative mx-auto grid min-h-[780px] max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[0.98fr_1.02fr] lg:py-24">
          <div className="absolute left-1/2 top-10 -z-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#7c5cff]/20 blur-[130px]" />
          <div className="absolute right-0 top-28 -z-10 h-[380px] w-[380px] rounded-full bg-[#4aa8ff]/20 blur-[110px]" />

          <div>
            <motion.div variants={item} className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.9)]" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#c4b5fd]">Android beta • limited testers</span>
            </motion.div>
            <motion.h1 variants={item} className="headline-balance max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.065em] text-white sm:text-7xl lg:text-8xl">
              For the message
              <span className="block bg-gradient-to-r from-[#c4b5fd] via-[#a78bfa] to-[#4aa8ff] bg-clip-text text-transparent">you almost didn’t send.</span>
            </motion.h1>
            <motion.p variants={item} className="mt-8 max-w-xl text-lg leading-relaxed text-white/72 sm:text-xl">
              Type rough. Tap 🪄. Banter rewrites awkward texts, apologies, DMs and work mail into something you’ll actually hit send on.
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

          <motion.div variants={item} className="relative"><PhoneDemo /></motion.div>
        </motion.section>

        <div className="border-y border-white/10 bg-white/[0.015] py-4">
          <div className="flex animate-[marquee_24s_linear_infinite] gap-12 whitespace-nowrap text-sm text-muted">
            {[...tags, ...tags].map((t, i) => <span key={`${t}-${i}`} className="inline-flex items-center gap-2"><Sparkles size={12} className="text-[#a78bfa]" />{t}</span>)}
          </div>
        </div>

        <section id="examples" className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 max-w-2xl">
            <p className="kicker">See the shift</p>
            <h2 className="mt-3 text-5xl font-black tracking-[-0.05em] text-white">Rough becomes sendable.</h2>
            <p className="mt-3 text-muted">People don’t need more typing. They need the right first draft at the right moment.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {examples.map((ex) => (
              <motion.div key={ex.who} whileHover={{ y: -4 }} className="premium-card rounded-[2rem] p-5">
                <p className="kicker">{ex.who}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-red-300/20 bg-red-400/5 p-4"><p className="text-xs uppercase tracking-[0.18em] text-red-200">Before</p><p className="mt-2 text-sm text-white/85">{ex.rough}</p></div>
                  <div className="rounded-2xl border border-[#4aa8ff]/25 bg-[#4aa8ff]/10 p-4"><p className="text-xs uppercase tracking-[0.18em] text-[#9fd0ff]">After 🪄</p><p className="mt-2 text-sm leading-relaxed text-white/85">{ex.better}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div whileHover={{ y: -4 }} className="premium-card rounded-[2rem] p-8">
              <MessageCircle className="mb-8 text-[#c4b5fd]" size={36} />
              <h3 className="text-4xl font-black tracking-[-0.04em] text-white">Built for how you actually talk.</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">Late replies, dry texts, apologies, Hinglish and work mail — different moments need different registers.</p>
            </motion.div>
            <div className="grid gap-5">
              {[
                [<Briefcase key="b" />, 'Professional mail', 'Turn rushed notes into clear updates and polite clarifications — no emoji by default.'],
                [<Lock key="l" />, 'Built for trust', 'Text is sent only when you tap 🪄. Private fields are protected. Devices can be revoked.'],
              ].map(([icon, title, body]) => (
                <motion.div key={String(title)} whileHover={{ y: -4 }} className="premium-card rounded-[2rem] p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b5cf6]/10 text-[#c4b5fd]">{icon}</div>
                  <h3 className="text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="premium-card relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#7c5cff]/20 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="kicker">Private beta</p>
                <h2 className="mt-3 text-5xl font-black tracking-[-0.05em] text-white">Testing with real Android users.</h2>
                <p className="mt-4 max-w-xl text-muted">Beta access is limited while we collect bugs, language examples, and keyboard feedback.</p>
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

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-8 max-w-3xl">
            <p className="kicker">Pricing</p>
            <h2 className="mt-3 text-5xl font-black tracking-[-0.05em] text-white">Start free. Upgrade when it becomes a habit.</h2>
            <p className="mt-3 text-muted">Prices shown for <span className="text-white/90">{country}</span> in {currency}. Simple plans while Banter is still early.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((t) => (
              <motion.div key={t.key} whileHover={{ y: -5 }} className={`rounded-[2rem] border p-6 ${t.key === 'plus' ? 'border-[#4aa8ff]/60 bg-gradient-to-b from-[#173456] to-[#111827] shadow-[0_30px_80px_-35px_rgba(74,168,255,0.9)]' : 'border-white/10 bg-white/[0.045]'}`}>
                <div className="flex items-center justify-between"><h3 className="text-2xl font-bold text-white">{t.name}</h3>{t.key === 'plus' && <span className="badge-plus">Most popular</span>}{t.key === 'pro' && <span className="badge-plus">Power</span>}</div>
                <p className="mt-7 text-4xl font-black tracking-tight text-white">{t.price}</p>
                <ul className="mt-6 space-y-3 text-sm text-white/78">{t.feats.map((f) => <li key={f} className="flex gap-2"><Check size={15} className="mt-0.5 text-emerald-300" />{f}</li>)}</ul>
                <Link href="/dashboard/upgrade" className={`${t.key === 'plus' ? 'btn-plus' : 'btn-ghost'} mt-8 w-full rounded-full`}>{t.key === 'free' ? 'Start free' : `Upgrade to ${t.name}`}</Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 pt-12">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#25145a] to-white/[0.04] p-10 text-center shadow-[0_40px_120px_-60px_rgba(124,92,255,0.9)]">
            <WandSparkles className="mx-auto mb-5 text-[#c4b5fd]" size={34} />
            <h2 className="text-5xl font-black tracking-[-0.05em] text-white">Stop letting the reply sit there.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">Open the beta page, install the keyboard, and test it on one message you almost didn’t send.</p>
            <Link href="/keyboard" className="btn-plus mt-8 rounded-full px-7 py-3 text-base">Try keyboard beta <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
