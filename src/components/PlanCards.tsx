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
          const plus = tier.key === 'premium';
          const go = tier.key === 'basic';
          return (
            <div
              key={tier.key}
              className={`relative flex min-h-[360px] flex-col overflow-hidden rounded-3xl border p-6 shadow-card transition hover:-translate-y-1 ${
                plus
                  ? 'border-[#4aa8ff]/70 bg-[#173456] shadow-[0_30px_80px_-35px_rgba(74,168,255,0.9)]'
                  : 'border-white/12 bg-white/[0.055] backdrop-blur-xl'
              }`}
            >
              {plus && <div className="absolute inset-x-0 top-0 h-1 bg-[#4aa8ff]" />}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-bold tracking-tight">{tier.name}</h3>
                {plus && <span className="badge-plus">Popular</span>}
              </div>

              <div className="mt-8">
                <div className="flex items-end gap-1">
                  <span className="mb-2 text-sm text-white/55">{tier.currency === 'INR' ? '₹' : ''}</span>
                  <span className="text-4xl font-bold tracking-tight">{tier.price.replace('/mo', '').replace('₹', '')}</span>
                  <span className="mb-2 text-xs text-white/70">/ month</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-white/90">
                  {tier.key === 'free'
                    ? 'See what Banter can do'
                    : go
                      ? 'Keep writing with expanded access'
                      : 'Unlock the full Banter experience'}
                </p>
              </div>

              <div className="mt-6">
                {tier.cta === 'Current' ? (
                  <button disabled className="btn-ghost w-full rounded-full opacity-70">
                    Your current plan
                  </button>
                ) : tier.cta ? (
                  <button disabled={busy} onClick={upgrade} className={`${plus ? 'btn-plus' : 'btn-ghost bg-white text-ink hover:bg-white/90'} w-full rounded-full`}>
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
                    <Check size={16} className={`mt-0.5 shrink-0 ${plus ? 'text-[#9fd0ff]' : 'text-emerald-400'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plus && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-white/80">
                  <Sparkles size={14} className="mr-1 inline text-[#9fd0ff]" /> Best for heavy personal + office use.
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
