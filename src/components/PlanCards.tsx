'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles } from 'lucide-react';
import type { Plan } from '@/lib/pricing';

export function PlanCards({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function upgrade() {
    setBusy(true);
    const res = await fetch('/api/billing/demo', { method: 'POST' });
    setBusy(false);
    if (res.ok) {
      setDone(true);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((tier) => {
          const featured = tier.key === 'plus';
          const pro = tier.key === 'pro';
          return (
            <div
              key={tier.key}
              className={`relative flex min-h-[390px] flex-col overflow-hidden rounded-[2rem] border p-6 shadow-card transition hover:-translate-y-1 ${
                featured
                  ? 'border-[#4aa8ff]/70 bg-gradient-to-b from-[#173456] to-[#101827] shadow-[0_30px_80px_-35px_rgba(74,168,255,0.9)]'
                  : pro
                    ? 'border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl'
                    : 'border-white/12 bg-white/[0.045] backdrop-blur-xl' 
              }`}
            >
              {featured && <div className="absolute inset-x-0 top-0 h-1 bg-[#4aa8ff]" />}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-bold tracking-tight">{tier.name}</h3>
                {featured && <span className="badge-plus">Most popular</span>}
                {pro && <span className="badge-plus">Power</span>}
              </div>

              <div className="mt-7">
                <p className="text-4xl font-black tracking-tight">{tier.price}</p>
                <p className="mt-4 text-sm font-semibold text-white/90">
                  {tier.key === 'free'
                    ? 'Start without pressure'
                    : tier.key === 'plus'
                      ? 'Best for everyday personal + professional writing'
                      : 'For creators, freelancers, and power users'}
                </p>
              </div>

              <div className="mt-6">
                {tier.cta === 'Current' ? (
                  <button disabled className="btn-ghost w-full rounded-full opacity-70">
                    Your current plan
                  </button>
                ) : tier.cta ? (
                  <button disabled={busy} onClick={upgrade} className={`${featured ? 'btn-plus' : 'btn-ghost bg-white text-ink hover:bg-white/90'} w-full rounded-full`}>
                    {busy ? 'Updating…' : tier.cta}
                  </button>
                ) : (
                  <button disabled className="btn-ghost w-full rounded-full opacity-50">
                    Included
                  </button>
                )}
              </div>

              <ul className="mt-7 flex-1 space-y-3 text-sm text-white/85">
                {tier.feats.map((f, j) => (
                  <li key={j} className="flex gap-3">
                    <Check size={16} className={`mt-0.5 shrink-0 ${featured ? 'text-[#9fd0ff]' : 'text-emerald-400'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {(featured || pro) && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-white/80">
                  <Sparkles size={14} className="mr-1 inline text-[#9fd0ff]" /> Built to remove hesitation and help you send faster.
                </div>
              )}
            </div>
          );
        })}
      </div>
      {done && (
        <p className="rounded-2xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 px-4 py-3 text-sm text-[#9fd0ff]">
          Demo upgrade applied. Connect real billing later for production payments.
        </p>
      )}
    </div>
  );
}
