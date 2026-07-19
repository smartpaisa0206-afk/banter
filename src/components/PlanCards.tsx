'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Check } from 'lucide-react';
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
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((tier) => (
        <div
          key={tier.key}
          className={`card flex flex-col p-5 ${tier.key === 'premium' ? 'border-gold/40 shadow-glow' : ''}`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            {tier.key === 'premium' && (
              <span className="badge-special">
                <Crown size={12} /> SPECIAL
              </span>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold">{tier.price}</p>
          <ul className="mt-3 flex-1 space-y-2 text-sm text-white/80">
            {tier.feats.map((f, j) => (
              <li key={j} className="flex gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            {tier.cta === 'Current' ? (
              <button disabled className="btn-ghost w-full">
                Current
              </button>
            ) : (
              <button
                disabled={busy}
                onClick={upgrade}
                className={tier.key === 'premium' ? 'btn-gold w-full' : 'btn-premium w-full'}
              >
                {busy ? '…' : tier.cta}
              </button>
            )}
          </div>
        </div>
      ))}
      {done && (
        <p className="text-sm text-gold md:col-span-3">
          Demo upgrade applied (Premium). Wire Stripe later for real billing.
        </p>
      )}
    </div>
  );
}
