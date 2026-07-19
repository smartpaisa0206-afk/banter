'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Footer } from '@/components/Footer';
import type { Plan } from '@/lib/pricing';
import { ArrowRight, Sparkles, Zap, ShieldCheck, MousePointerClick, PenLine, Send, Mail, MessageCircle, Briefcase, Check, Star } from 'lucide-react';

const features = [
  {
    icon: <Sparkles size={20} className="text-brand-soft" />,
    title: 'Right words, right person',
    body: 'Pick who, what, and how — get message variants that sound like you, not a bot.',
  },
  {
    icon: <Zap size={20} className="text-gold" />,
    title: 'Live, as you type',
    body: 'Get real-time suggestion chips while you write. Hurry mode for one-tap lines.',
  },
  {
    icon: <ShieldCheck size={20} className="text-emerald-400" />,
    title: 'Private & secure',
    body: 'Encrypted at rest, secure sessions, rate-limited. Your words stay yours.',
  },
];

const steps = [
  { icon: <MousePointerClick size={18} />, title: 'Pick', body: 'Relationship, intent, and tone in two taps.' },
  { icon: <PenLine size={18} />, title: 'Type', body: 'Add a line of context — or let live hints help.' },
  { icon: <Send size={18} />, title: 'Send', body: 'Copy a ready-to-send message and hit send.' },
];

const works = [
  { icon: <Mail size={18} />, title: 'Emails', body: 'Subject + body, ready to send.' },
  { icon: <MessageCircle size={18} />, title: 'Social & captions', body: 'Hooks that stop the scroll.' },
  { icon: <Briefcase size={18} />, title: 'Marketing', body: 'Ad copy, taglines, launches.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 22 } },
};

export function Landing({ plans, country, currency }: { plans: Plan[]; country: string; currency: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-30 border-b border-white/5 bg-ink/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguagePicker />
            <Link href="/login" className="btn-ghost hidden sm:inline-flex">
              Log in
            </Link>
            <Link href="/signup" className="btn-premium">
              Get Banter free
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
          className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-2 lg:pt-20"
        >
          <div>
            <motion.span variants={item} className="chip mb-5 inline-flex">
              <Sparkles size={12} /> Real-life words, not a game
            </motion.span>
            <motion.h1
              variants={item}
              className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Never go <span className="gradient-text">blank</span> on what to say again.
            </motion.h1>
            <motion.p variants={item} className="mt-5 max-w-md text-lg text-muted">
              Banter gives you the right words for the right person and moment — flirty, apologetic,
              bold, or warm. Best quality, free to start.
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-premium px-6 py-3 text-base">
                Create free account <ArrowRight size={16} />
              </Link>
              <Link href="/login" className="btn-ghost px-6 py-3 text-base">
                I already have one
              </Link>
            </motion.div>
            <motion.p variants={item} className="mt-4 text-xs text-muted">
              No card needed · Private by design · Works in 18+ languages
            </motion.p>
          </div>

          {/* Product mockup */}
          <motion.div variants={item} className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand/30 via-transparent to-gold/20 blur-2xl" />
            <div className="card p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="chip">Partner</span>
                <span className="chip">Flirt</span>
                <span className="chip">Warm</span>
              </div>
              <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4">
                <p className="text-sm leading-relaxed">
                  Had the best time with you tonight 😊 Can&apos;t stop thinking about that smile.
                  Want to do it again soon?
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted">Ready to send</span>
                <span className="btn-ghost px-3 py-1.5 text-xs">Copy</span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* TRUST STRIP */}
        <section className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 pb-14 text-sm text-muted">
          <span className="inline-flex items-center gap-2"><Star size={14} className="text-gold" /> 18+ languages</span>
          <span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Encrypted at rest</span>
          <span className="inline-flex items-center gap-2"><Mail size={14} className="text-brand-soft" /> Email, social &amp; marketing</span>
          <span className="inline-flex items-center gap-2"><Zap size={14} className="text-gold" /> Live suggestions</span>
        </section>

        {/* FEATURES */}
        <section className="mx-auto grid max-w-5xl gap-4 px-5 pb-16 sm:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card card-hover p-5"
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.body}</p>
            </motion.div>
          ))}
        </section>

        {/* HOW IT WORKS */}
        <section className="mx-auto max-w-3xl px-5 pb-16 text-center">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="card p-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand-soft">
                  {s.icon}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WORKS */}
        <section className="mx-auto max-w-5xl px-5 pb-16">
          <div className="card overflow-hidden p-0">
            <div className="grid gap-px bg-white/5 sm:grid-cols-3">
              {works.map((w) => (
                <div key={w.title} className="card-hover bg-ink/40 p-6">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand-soft">
                    {w.icon}
                  </div>
                  <h3 className="font-semibold">{w.title}</h3>
                  <p className="mt-1 text-sm text-muted">{w.body}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-2 bg-ink/40 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-sm text-muted">Banter writes your work too — emails, posts, and marketing that sound like you.</p>
              <Link href="/dashboard/upgrade" className="btn-gold px-5 py-2.5 text-sm">
                See Works plans
              </Link>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="mx-auto max-w-5xl px-5 pb-16">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold">Simple, fair pricing</h2>
            <p className="mt-1 text-sm text-muted">
              Prices shown for <span className="text-white/90">{country}</span> in {currency} — localized by your region &amp; device at checkout.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((t) => (
              <div
                key={t.key}
                className={`card card-hover flex flex-col p-5 ${t.key === 'premium' ? 'border-gold/40 shadow-glow' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{t.name}</h3>
                  {t.key === 'premium' && <span className="badge-special">POPULAR</span>}
                </div>
                <p className="mt-2 text-2xl font-bold gradient-text">{t.price}</p>
                <p className="mt-1 flex-1 text-sm text-muted">{t.feats[0]}</p>
                <Link
                  href="/dashboard/upgrade"
                  className={`mt-4 ${t.key === 'premium' ? 'btn-gold' : 'btn-ghost'} py-2.5 text-center text-sm`}
                >
                  {t.key === 'free' ? 'Start free' : t.key === 'premium' ? 'Go Premium' : 'Go Basic'}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-4xl px-5 pb-20">
          <div className="card relative overflow-hidden p-8 text-center">
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-brand/20 to-gold/10 blur-2xl" />
            <h2 className="text-2xl font-semibold sm:text-3xl">Say the right thing, every time.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Join free. No card, no awkward moments — just better words.
            </p>
            <Link href="/signup" className="btn-premium mt-6 px-6 py-3 text-base">
              Create free account <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
