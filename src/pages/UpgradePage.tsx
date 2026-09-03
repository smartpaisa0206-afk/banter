import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { Footer } from '../components/Footer';
import { PlanCards } from '../components/PlanCards';
import { CursorEffects } from '../components/CursorEffects';
import { Sparkles, Zap, Crown } from 'lucide-react';

export default function UpgradePage() {
  return (
    <div className="premium-shell flex min-h-screen flex-col">
      <CursorEffects />
      <AppHeader email="user@example.com" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          {/* Floating icons */}
          <div className="relative mb-6 inline-flex">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="grid h-20 w-20 place-items-center rounded-[2rem] bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff] shadow-[0_0_60px_-10px_rgba(124,92,255,0.9)]"
            >
              <Crown size={34} className="text-white" />
            </motion.div>
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-xl bg-[#e9c46a] shadow-glow-gold"
            >
              <Zap size={14} className="text-[#0b0b12] fill-current" />
            </motion.span>
          </div>

          <p className="kicker mb-3">Pricing & plans</p>
          <h1 className="text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
            Upgrade your{' '}
            <span className="gradient-text">communication</span>
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            Free forever. Upgrade anytime. Localized pricing — what you see is what you pay.
          </p>

          {/* Promo banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e9c46a]/35 bg-[#e9c46a]/10 px-5 py-2.5 text-sm font-semibold text-[#e9c46a]"
          >
            <Sparkles size={15} />
            Private beta pricing — 60% off for early users
          </motion.div>
        </motion.div>

        <PlanCards />
      </main>
      <Footer />
    </div>
  );
}
