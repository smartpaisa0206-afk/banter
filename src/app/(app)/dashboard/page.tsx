import { Composer } from '@/components/Composer';
import { TrialReferral } from '@/components/TrialReferral';
import { VerifyNotice } from '@/components/VerifyNotice';

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <TrialReferral />
      <VerifyNotice />
      <Composer />
    </div>
  );
}
