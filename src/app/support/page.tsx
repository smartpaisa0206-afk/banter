import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function SupportPage() {
  return (
    <InfoPageShell
      eyebrow="Support"
      title="Need help with Banter?"
      description="If something is confusing, broken, or not giving the result you expected, use these support options."
    >
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold">Fast support checklist</h2>
        <ul className="mt-4 space-y-3 text-muted">
          <li>• Try refreshing the page.</li>
          <li>• Check if you are logged in.</li>
          <li>• Add more context before generating.</li>
          <li>• If Professional mode is locked, check your plan.</li>
          <li>• If AI is unavailable, Banter may use template mode.</li>
        </ul>
      </section>
      <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
        <h2 className="text-2xl font-bold">Send feedback</h2>
        <p className="mt-2 text-muted">Logged-in users can send feedback from the dashboard. Tell us what happened and what you expected.</p>
        <Link href="/dashboard/feedback" className="btn-plus mt-5 rounded-full">Open feedback</Link>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold">HNY Labs</h2>
        <p className="mt-2 text-muted">Banter is built by HNY Labs. More tools are planned under the same parent brand.</p>
      </section>
    </InfoPageShell>
  );
}
