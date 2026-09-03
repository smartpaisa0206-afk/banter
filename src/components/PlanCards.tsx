import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Star, ArrowRight, Crown } from 'lucide-react';

const plans = [
  {
    key: 'free',
    name: 'Free',
    price: '₹0',
    priceUSD: '$0',
    period: 'forever',
    cta: 'Get started',
    ctaLink: '/signup',
    badge: null,
    color: '#ffffff',
    feats: [
      '5 rewrites per day',
      'Personal mode',
      'English & Hinglish',
      '3 tones',
      'Copy to clipboard',
      'Basic templates',
    ],
    desc: 'Start without pressure',
  },
  {
    key: 'plus',
    name: 'Plus',
    price: '₹149',
    priceUSD: '$2',
    period: '/month',
    cta: 'Start Plus',
    ctaLink: '/signup',
    badge: 'Most popular',
    color: '#4aa8ff',
    feats: [
      'Unlimited rewrites',
      'Personal + Works mode',
      'All languages',
      'All 7 tones',
      'Save & history',
      'Priority generation',
      'Referral bonuses',
    ],
    desc: 'Best for everyday personal + professional writing',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '₹349',
    priceUSD: '$4',
    period: '/month',
    cta: 'Go Pro',
    ctaLink: '/signup',
    badge: 'Power',
    color: '#7c5cff',
    feats: [
      'Everything in Plus',
      'Android keyboard access',
      'Custom tone profiles',
      'Bulk generation',
      'API access (beta)',
      'Priority support',
      'Early feature access',
    ],
    desc: 'For creators, freelancers, and power users',
  },
];

export function PlanCards() {
  const [annual, setAnnual] = useState(false);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(key: string) {
    setSelected(key);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 600);
  }

  return (
    <div className="w-full">
      {/* Billing toggle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
          <button
            onClick={() => setAnnual(false)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${!annual ? 'bg-[#7c5cff] text-white shadow-glow' : 'text-white/55 hover:text-white'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${annual ? 'bg-[#7c5cff] text-white shadow-glow' : 'text-white/55 hover:text-white'}`}
          >
            Annual
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">-40%</span>
          </button>
        </div>
      </motion.div>

      {/* Plan cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((tier, i) => {
          const featured = tier.key === 'plus';
          const pro = tier.key === 'pro';
          const isSelected = selected === tier.key;

          return (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { type: 'spring' as const, stiffness: 300 } }}
              className={`relative flex flex-col overflow-hidden rounded-[2rem] border p-6 transition-all duration-300 ${
                featured
                  ? 'border-[#4aa8ff]/50 bg-gradient-to-b from-[#4aa8ff]/10 to-transparent shadow-[0_30px_80px_-20px_rgba(74,168,255,0.5)]'
                  : pro
                  ? 'border-[#7c5cff]/40 bg-gradient-to-b from-[#7c5cff]/8 to-transparent shadow-[0_20px_60px_-20px_rgba(124,92,255,0.4)]'
                  : 'border-white/10 bg-white/[0.03] shadow-card'
              }`}
            >
              {/* Shine effect for featured */}
              {featured && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4aa8ff]/80 to-transparent" />
              )}
              {pro && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c5cff]/80 to-transparent" />
              )}

              {/* Badge */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {pro && <Crown size={16} className="text-[#7c5cff]" />}
                  {featured && <Zap size={16} className="text-[#4aa8ff]" />}
                  <h3 className="text-lg font-black text-white">{tier.name}</h3>
                </div>
                {tier.badge && (
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    featured
                      ? 'bg-[#4aa8ff]/20 text-[#9fd0ff]'
                      : 'bg-[#7c5cff]/20 text-[#c4b5fd]'
                  }`}>
                    {tier.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-black tracking-tight ${
                    featured ? 'text-[#4aa8ff]' : pro ? 'gradient-text' : 'text-white'
                  }`}>
                    {annual && tier.key !== 'free'
                      ? tier.key === 'plus' ? '₹89' : '₹209'
                      : tier.price}
                  </span>
                  <span className="text-sm text-muted">{tier.period}</span>
                </div>
                {annual && tier.key !== 'free' && (
                  <p className="mt-0.5 text-xs text-emerald-400">Billed annually · Save 40%</p>
                )}
              </div>
              <p className="mb-6 text-sm text-muted">{tier.desc}</p>

              {/* CTA */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelect(tier.key)}
                className={`btn mb-6 w-full rounded-xl py-3 text-sm ${
                  featured
                    ? 'btn-plus shadow-[0_12px_40px_-12px_rgba(74,168,255,0.8)]'
                    : pro
                    ? 'btn-premium shadow-[0_12px_40px_-12px_rgba(124,92,255,0.8)]'
                    : 'btn-ghost'
                }`}
              >
                {isSelected ? (
                  <><Check size={16} className="text-emerald-400" /> Selected!</>
                ) : (
                  <>{tier.cta} <ArrowRight size={14} /></>
                )}
              </motion.button>

              {/* Features */}
              <ul className="flex-1 space-y-2.5">
                {tier.feats.map((f, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 + j * 0.04 }}
                    className="flex items-start gap-2.5 text-sm text-white/80"
                  >
                    <Check
                      size={15}
                      className={`mt-0.5 shrink-0 ${
                        featured ? 'text-[#4aa8ff]' : pro ? 'text-[#a78bfa]' : 'text-emerald-400'
                      }`}
                    />
                    {f}
                  </motion.li>
                ))}
              </ul>

              {/* Bottom note */}
              {(featured || pro) && (
                <p className="mt-5 text-xs text-muted border-t border-white/8 pt-4">
                  ✦ Built to remove hesitation and help you send faster.
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-center text-sm text-emerald-400"
          >
            ✓ Demo upgrade applied! Connect real billing in production.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted"
      >
        <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> No credit card for free tier</span>
        <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Cancel anytime</span>
        <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Localized pricing</span>
        <span className="flex items-center gap-1.5"><Star size={12} className="text-[#e9c46a]" /> 4.9/5 rating</span>
      </motion.div>
    </div>
  );
}
