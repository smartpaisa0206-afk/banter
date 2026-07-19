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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Upgrade</h1>
        <p className="mt-1 text-sm text-muted">
          Start free with best quality. Upgrade for more, Works, and to feel special.
        </p>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-muted">
          Showing prices for <span className="font-medium text-white/90">{cc}</span> in{' '}
          <span className="font-medium text-white/90">{currency}</span> — localized by your region
          {device === 'mobile' ? ' & phone' : ''} at checkout.
        </p>
      </div>
      <PlanCards plans={plans} />
    </div>
  );
}
