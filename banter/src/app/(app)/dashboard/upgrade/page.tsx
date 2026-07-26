import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { PlanCards } from '@/components/PlanCards';
import { resolvePricing, detectCountry, detectDevice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export default async function Upgrade() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const h = headers();
  const country = detectCountry(h);
  const device = detectDevice(h.get('user-agent'));
  const { plans, country: cc, currency } = resolvePricing({
    country,
    device,
    currentRole: user.role,
  });

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#4aa8ff]/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="chip mb-4">Plans</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Choose your Banter plan.</h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Personal mode is free. Upgrade to unlock Office mode, deeper history, saved messages,
            premium tones, and keyboard access when Phase 2 launches.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-muted">
            Showing prices for <span className="font-medium text-white/90">{cc}</span> in{' '}
            <span className="font-medium text-white/90">{currency}</span>
            {device === 'mobile' ? ' — mobile pricing preview' : ''}
          </p>
        </div>
      </section>

      <PlanCards plans={plans} />
    </div>
  );
}
