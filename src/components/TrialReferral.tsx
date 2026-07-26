'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Gift, Flame } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';

interface MeData {
  trialing: boolean;
  trialDaysLeft: number;
  trialEndsAt: number | null;
  referralLink: string | null;
  referredCount: number;
  referralBonusDays: number;
  trialDaysTotal: number;
  role: string;
}

export function TrialReferral() {
  const [data, setData] = useState<MeData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.user) setData(d as MeData);
      })
      .catch(() => {});
  }, []);

  // Smooth-scroll to this widget when arriving via /dashboard#refer.
  useEffect(() => {
    if (data && typeof window !== 'undefined' && window.location.hash === '#refer') {
      document.getElementById('refer')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  async function copy() {
    if (!data?.referralLink) return;
    try {
      await navigator.clipboard.writeText(data.referralLink);
    } catch {
      /* clipboard may be blocked; ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (!data) return null;
  const isPremium = data.role === 'premium' || data.role === 'admin';

  return (
    <div id="refer" className="space-y-4 scroll-mt-24">
      {data.trialing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-gold/30 bg-gradient-to-r from-gold/10 to-brand/10 p-5"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold to-yellow-300 text-ink shadow-glow">
              <Flame size={20} />
            </span>
            <div>
              <p className="font-semibold text-white">
                You earned Premium — {data.trialDaysLeft} {data.trialDaysLeft === 1 ? 'day' : 'days'} left
              </p>
              <p className="text-sm text-muted">
                Unlocked the moment you joined. Invite friends to stack free days before beta closes.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {data.referralLink && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 text-gold">
            <Gift size={18} />
            <h3 className="font-semibold text-white">Invite &amp; keep Premium free</h3>
          </div>
          <p className="mt-1 text-sm text-muted">
            Share your link. Every friend who joins adds{' '}
            <span className="font-medium text-white">+{data.referralBonusDays} free days</span> to both
            of you.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              readOnly
              value={data.referralLink}
              onFocus={(e) => e.currentTarget.select()}
              className="input flex-1"
            />
            <button onClick={copy} className="btn-gold shrink-0">
              {copied ? (
                <>
                  <Check size={16} /> Copied
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Friends joined: <span className="font-medium text-white">{data.referredCount}</span> · Beta
            slots are limited — invite now to lock in Premium.
          </p>
        </motion.div>
      )}

      {!isPremium && !data.trialing && (
        <p className="text-xs text-muted">
          {BRAND_NAME} free includes the best quality. Start your referral trial from the link above.
        </p>
      )}
    </div>
  );
}
