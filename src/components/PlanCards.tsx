'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Zap, Crown, ArrowRight, Star } from 'lucide-react';
import type { Plan } from '@/lib/pricing';

export function PlanCards({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [annual, setAnnual] = useState(false);

  async function upgrade() {
    setBusy(true);
    const res = await fetch('/api/billing/demo', { method: 'POST' });
    setBusy(false);
    if (res.ok) {
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 3000);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
          <button onClick={() => setAnnual(false)} className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${!annual ? 'bg-[#7c5cff] text-white shadow-glow' : 'text-white/55 hover:text-white'}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${annual ? 'bg-[#7c5cff] text-white shadow-glow' : 'text-white/55 hover:text-white'}`}>Annual <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">soon</span></button>
        </div>
        <p className="text-xs text-muted">Simple beta pricing. Upgrade only when Banter becomes a habit.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((tier, i) => {
          const featured = tier.key === 'plus';
          const pro = tier.key === 'pro';
          return (
            <div key={tier.key} className={`relative flex min-h-[410px] flex-col overflow-hidden rounded-[2rem] border p-6 transition-all duration-300 hover:-translate-y-2 ${featured ? 'border-[#4aa8ff]/55 bg-gradient-to-b from-[#4aa8ff]/12 to-white/[0.025] shadow-[0_30px_80px_-25px_rgba(74,168,255,0.65)]' : pro ? 'border-[#7c5cff]/45 bg-gradient-to-b from-[#7c5cff]/10 to-white/[0.025] shadow-[0_24px_70px_-28px_rgba(124,92,255,0.55)]' : 'border-white/10 bg-white/[0.035]'}`}>
              {(featured || pro) && <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${featured ? 'via-[#4aa8ff]' : 'via-[#7c5cff]'} to-transparent`} />}

              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {featured ? <Zap size={17} className="text-[#4aa8ff]" /> : pro ? <Crown size={17} className="text-[#a78bfa]" /> : <Sparkles size={17} className="text-white/55" />}
                  <h3 className="text-2xl font-black tracking-tight text-white">{tier.name}</h3>
                </div>
                {featured && <span className="badge-plus">Most popular</span>}
                {pro && <span className="badge-pro">Power</span>}
              </div>

              <div>
                <p className={`text-4xl font-black tracking-tight ${featured ? 'text-[#4aa8ff]' : pro ? 'gradient-text' : 'text-white'}`}>{tier.price}</p>
                <p className="mt-3 text-sm font-semibold text-white/88">{tier.key === 'free' ? 'Start without pressure' : featured ? 'Best for daily chat + work' : 'For creators and power users'}</p>
              </div>

              <div className="mt-6">
                {tier.cta === 'Current' ? (
                  <button disabled className="btn-ghost w-full rounded-xl opacity-70">Your current plan</button>
                ) : tier.cta ? (
                  <button disabled={busy} onClick={upgrade} className={`${featured ? 'btn-plus' : pro ? 'btn-premium' : 'btn-ghost'} w-full rounded-xl py-3`}>
                    {busy ? 'Updating…' : <>{tier.cta} <ArrowRight size={14} /></>}
                  </button>
                ) : (
                  <button disabled className="btn-ghost w-full rounded-xl opacity-50">Included</button>
                )}
              </div>

              <ul className="mt-7 flex-1 space-y-3 text-sm text-white/82">
                {tier.feats.map((f, j) => (
                  <li key={j} className="flex gap-3"><Check size={16} className={`mt-0.5 shrink-0 ${featured ? 'text-[#4aa8ff]' : pro ? 'text-[#a78bfa]' : 'text-emerald-400'}`} /><span>{f}</span></li>
                ))}
              </ul>

              {(featured || pro) && <p className="mt-6 border-t border-white/8 pt-4 text-xs text-muted">✦ Built to remove hesitation and help you send faster.</p>}
            </div>
          );
        })}
      </div>

      {done && <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-sm text-emerald-300">✓ Demo upgrade applied. Connect real billing later for production payments.</p>}

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> No card for free plan</span>
        <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Cancel anytime later</span>
        <span className="flex items-center gap-1.5"><Star size={12} className="text-[#e9c46a]" /> Beta pricing while testing</span>
      </div>
    </div>
  );
}
