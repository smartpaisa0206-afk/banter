import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function ArticlePage() {
  return (
    <InfoPageShell
      eyebrow="Article · Relationships"
      title="Texting Someone You Like Without Being Weird"
      description="The anxiety of “does this sound desperate?” — and how to escape it."
    >
      <article className="space-y-6 text-base leading-relaxed text-white/78">
        <p>
          You type a text. Then you read it seven times. Then you delete it. Then you send something three times drier than what you actually feel. Sound familiar? The fear isn’t really about the words — it’s about being seen as too much.
        </p>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">The “desperate” myth</h2>
          <p className="mt-3 text-muted">
            Here’s the secret: warmth is not desperation. Desperation is triple-texting at 1 AM because you’re anxious. Warmth is sending one genuine message and being okay waiting. The difference isn’t how much you care — it’s how much you can sit with not knowing the outcome.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Three rules that actually work</h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li><span className="font-semibold text-white">1. Match energy, don’t chase it.</span> If they send short replies, you send short replies. If they’re chatty, be chatty. Mirroring keeps you from over-investing in silence.</li>
            <li><span className="font-semibold text-white">2. Be specific, not generic.</span> “Had fun last night” is forgettable. “That story about your dog had me laughing on the cab ride home” is memorable. Details show you were actually present.</li>
            <li><span className="font-semibold text-white">3. Ask real questions.</span> “How are you?” dies on arrival. “Did you end up finishing that presentation?” shows you remember them. People light up when they feel remembered.</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Bad vs better examples</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-white">Starting a conversation</p>
              <p className="text-red-200">Bad: “hey” / “what’s up”</p>
              <p className="text-emerald-200">Better: “Hey! Just passed that coffee place you mentioned — are you still addicted to their cold brew or have you moved on?”</p>
            </div>
            <div>
              <p className="font-semibold text-white">Showing interest</p>
              <p className="text-red-200">Bad: “you’re so pretty omg 😍😍😍”</p>
              <p className="text-emerald-200">Better: “Okay I have to say it — that dress was such a good choice yesterday. You have great taste.”</p>
            </div>
            <div>
              <p className="font-semibold text-white">Asking them out</p>
              <p className="text-red-200">Bad: “so like do you wanna maybe hang out sometime??”</p>
              <p className="text-emerald-200">Better: “I really enjoyed talking to you. Would you want to grab coffee this weekend? No pressure either way.”</p>
            </div>
          </div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">The double-text question</h2>
          <p className="mt-3 text-muted">
            Can you text twice without a reply? Yes — if it’s once, it’s new information, and it’s been a while. “Oh also, the movie I mentioned is on Netflix now” is fine. A follow-up asking why they didn’t reply is not. Silence is information too; respect it and move on gracefully.
          </p>
        </section>
        <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
          <h2 className="text-2xl font-bold text-white">Staring at your phone overthinking?</h2>
          <p className="mt-2 text-muted">Tell Banter what you want to say and who it’s for — it’ll rewrite it into something confident and natural.</p>
          <Link href="/dashboard" className="btn btn-plus mt-5 rounded-full">Open Banter</Link>
        </section>
      </article>
    </InfoPageShell>
  );
}
