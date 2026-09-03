'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Gift, Flame, Users, Sparkles } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';

interface MeData { trialing: boolean; trialDaysLeft: number; trialEndsAt: number | null; referralLink: string | null; referredCount: number; referralBonusDays: number; trialDaysTotal: number; role: string; }

export function TrialReferral() {
  const [data, setData] = useState<MeData | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => { fetch('/api/me').then((r) => r.json()).then((d) => { if (d && d.user) setData(d as MeData); }).catch(() => {}); }, []);
  useEffect(() => { if (data && typeof window !== 'undefined' && window.location.hash === '#refer') { document.getElementById('refer')?.scrollIntoView({ behavior: 'smooth' }); } }, [data]);
  async function copy() {
    if (!data?.referralLink) return;
    try { await navigator.clipboard.writeText(data.referralLink); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }
  if (!data) return null;
  const isPremium = data.role === 'premium' || data.role === 'admin';
  return (
    <div id="refer" className="space-y-4 scroll-mt-24">
      <AnimatePresence>
        {data.trialing && (
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/12 via-gold/6 to-brand/8 p-5"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/20 blur-2xl" />
            <div className="flex items-center gap-3">
              <motion.span animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold to-yellow-300 text-ink shadow-[0_8px_30px_-8px_rgba(233,196,106,0.7)]"
              ><Flame size={20} /></motion.span>
              <div>
                <p className="font-bold text-white">Premium active — {data.trialDaysLeft} {data.trialDaysLeft === 1 ? 'day' : 'days'} left 🔥</p>
                <p className="mt-0.5 text-sm text-muted">Invite friends to stack free days before beta closes.</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((data.trialDaysLeft / data.trialDaysTotal) * 100)}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-300" />
            </div>
            <p className="mt-1.5 text-xs text-muted">{data.trialDaysLeft} / {data.trialDaysTotal} days remaining</p>
          </motion.div>
        )}
      </AnimatePresence>
      {data.referralLink && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 26 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#7c5cff]/15 blur-2xl" />
          <div className="flex items-center gap-2 mb-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#e9c46a]/15 text-[#e9c46a]"><Gift size={16} /></div>
            <h3 className="font-bold text-white">Invite & keep Premium free</h3>
          </div>
          <p className="mb-4 text-sm text-muted">Share your link. Every friend who joins adds <span className="font-semibold text-white">+{data.referralBonusDays} free days</span> to both of you.</p>
          <div className="flex gap-2">
            <input readOnly value={data.referralLink} onFocus={(e) => e.currentTarget.select()} className="input flex-1 text-xs" />
            <motion.button whileTap={{ scale: 0.94 }} whileHover={{ y: -1 }} onClick={copy} className="btn-gold shrink-0 rounded-xl px-4">
              <AnimatePresence mode="wait">
                {copied
                  ? <motion.span key="c" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1.5 text-emerald-700"><Check size={14} /> Copied!</motion.span>
                  : <motion.span key="u" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1.5"><Copy size={14} /> Copy</motion.span>}
              </AnimatePresence>
            </motion.button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5"><Users size={12} />Friends joined: <span className="ml-1 font-semibold text-white">{data.referredCount}</span></span>
            <span className="flex items-center gap-1.5 text-[#a78bfa]"><Sparkles size={12} />Beta slots limited</span>
          </div>
        </motion.div>
      )}
      {!isPremium && !data.trialing && <p className="text-xs text-muted">{BRAND_NAME} free includes the best quality. Start your referral trial from the link above.</p>}
    </div>
  );
}
