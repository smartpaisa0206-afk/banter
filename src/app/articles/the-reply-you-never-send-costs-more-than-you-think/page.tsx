import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function ArticlePage() {
  return (
    <InfoPageShell
      eyebrow="Article · Productivity"
      title="The Reply You Never Send Costs More Than You Think"
      description="Leaving messages on read — intentionally or not — damages relationships slowly. Here’s a fix."
    >
      <article className="space-y-6 text-base leading-relaxed text-white/78">
        <p>
          There’s a message sitting in your inbox right now that you’ve opened three times. Each time you meant to reply. Each time you didn’t. And every day it sits there, it gets slightly harder to answer — not because the reply is hard, but because the guilt is.
        </p>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">The slow damage</h2>
          <p className="mt-3 text-muted">
            Unanswered messages don’t explode relationships — they erode them. A friend stops sharing news because “you never reply anyway.” A client quietly moves to someone more responsive. A parent wonders if you’re okay. Nobody tells you this is happening. The cost is invisible until the distance is too big to bridge.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Why we stall</h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li><span className="font-semibold text-white">The perfect-reply trap.</span> You want to write something thoughtful, so you wait for the right moment — which never comes.</li>
            <li><span className="font-semibold text-white">The guilt spiral.</span> After a few days, replying means acknowledging you took a few days. So you avoid it, which adds more days.</li>
            <li><span className="font-semibold text-white">The overwhelm.</span> One unanswered message is a task. Twenty are a mountain. Mountains don’t get climbed.</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">The fix: a reply beats a perfect reply</h2>
          <p className="mt-3 text-muted">
            Nobody remembers whether your reply was elegant. They remember that you replied. A 20-second honest message beats a brilliant one you never sent. Set a simple rule: if a message takes less than two minutes to answer, answer it now. If it takes longer, send a placeholder today and the real thing tomorrow.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Templates for delayed replies</h2>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• “I’m so sorry for the late reply — this slipped through. [Your actual answer].”</li>
            <li>• “Just seeing this properly. Give me till tomorrow and I’ll get back to you on it.”</li>
            <li>• “I owe you a real reply — quick one for now: [short answer]. More soon.”</li>
            <li>• “No excuse for the delay, but I’m here now. What did I miss?”</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
          <h2 className="text-2xl font-bold text-white">Clear the backlog tonight</h2>
          <p className="mt-2 text-muted">Open that message you’ve been avoiding, paste your rough thoughts into Banter, and send something good in under a minute.</p>
          <Link href="/dashboard" className="btn btn-plus mt-5 rounded-full">Open Banter</Link>
        </section>
      </article>
    </InfoPageShell>
  );
}
