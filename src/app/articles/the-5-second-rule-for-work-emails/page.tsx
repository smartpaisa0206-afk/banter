import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function ArticlePage() {
  return (
    <InfoPageShell
      eyebrow="Article · Workplace"
      title="The 5-Second Rule for Work Emails"
      description="If your recipient needs more than 5 seconds to understand your ask, your email needs rewriting."
    >
      <article className="space-y-6 text-base leading-relaxed text-white/78">
        <p>
          Here’s the rule: before you hit send, imagine your recipient opens your email on their phone between two meetings. If they can’t tell what you need from them within 5 seconds, you’re making them work — and busy people don’t.
        </p>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Why it works</h2>
          <p className="mt-3 text-muted">
            Most work emails bury the request under context. “Following up on last Thursday’s discussion regarding the Q3 deliverables, I wanted to reach out about…” — by the time the ask arrives, the reader has already skimmed past it. Putting the ask first respects their time and doubles your reply rate.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">The structure</h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li><span className="font-semibold text-white">1. The ask, in one line.</span> “Can you approve the attached invoice by Friday?” — that’s your opening, not your closing.</li>
            <li><span className="font-semibold text-white">2. Context, kept short.</span> Two or three sentences max. If you need more, attach a doc instead.</li>
            <li><span className="font-semibold text-white">3. A clear next step.</span> End with exactly what happens next: “If I don’t hear back by Thursday, I’ll proceed with the vendor.”</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Bad vs better examples</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-white">Asking for approval</p>
              <p className="text-red-200">Bad: “Hi, hope you’re doing well! Just wanted to touch base regarding the invoice I sent over last week. Whenever you have a moment, no rush at all, would love your thoughts.”</p>
              <p className="text-emerald-200">Better: “Quick ask: can you approve the attached invoice by Friday? It’s for the March vendor payment, already signed off by finance. Let me know if you have any questions.”</p>
            </div>
            <div>
              <p className="font-semibold text-white">Following up</p>
              <p className="text-red-200">Bad: “Just bumping this to the top of your inbox in case you missed it.”</p>
              <p className="text-emerald-200">Better: “Following up on my note from Tuesday — do you want me to go ahead with option A? A yes/no is enough, happy to handle the rest.”</p>
            </div>
          </div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Templates you can use</h2>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• “Quick ask: [what you need] by [deadline].”</li>
            <li>• “Need a decision on [X]. My recommendation is [Y] — okay to proceed?”</li>
            <li>• “Looping you in FYI — no action needed, but the summary is below.”</li>
            <li>• “If I don’t hear back by [date], I’ll assume [default] and proceed.”</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
          <h2 className="text-2xl font-bold text-white">Too long-winded to fix yourself?</h2>
          <p className="mt-2 text-muted">Paste your draft into Banter — it’ll tighten it into a 5-second email you can actually send.</p>
          <Link href="/dashboard" className="btn btn-plus mt-5 rounded-full">Open Banter</Link>
        </section>
      </article>
    </InfoPageShell>
  );
}
