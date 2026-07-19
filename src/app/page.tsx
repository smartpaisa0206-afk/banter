import { headers } from 'next/headers';
import { Landing } from '@/components/Landing';
import { resolvePricing, detectCountry, detectDevice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export default function Page() {
  const h = headers();
  const { plans, country, currency } = resolvePricing({
    country: detectCountry(h),
    device: detectDevice(h.get('user-agent')),
  });
  return <Landing plans={plans} country={country} currency={currency} />;
}
