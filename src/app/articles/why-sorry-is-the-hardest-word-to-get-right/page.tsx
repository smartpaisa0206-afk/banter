import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function ArticlePage() {
  return (
    <InfoPageShell
      eyebrow="Article · Communication"
      title="Why “Sorry” Is the Hardest Word to Get Right"
      description="Most apologies fail because they focus on the sender, not the receiver. Here's how to write one that actually lands."
    >
      <article className="space-y-6 text-base leading-relaxed text-white/78">
        <p>
          A bad apology can hurt more than the original mistake. “Sorry if you felt hurt” sounds like an apology, but it quietly puts the problem on the other person. The receiver hears one thing: you don’t really get it.
        </p>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Why most apologies fail</h2>
          <p className="mt-3 text-muted">
            Most apologies are written to relieve the sender’s guilt, not to heal the receiver. They rush to explain (“I was just busy”), minimize (“it wasn’t a big deal”), or ask for quick forgiveness (“are we good?”) — all of which make the other person feel unseen.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">The three parts of an apology that lands</h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li><span className="font-semibold text-white">1. Own it plainly.</span> Name what you did without dressing it up. “I didn’t reply for three days” beats “I’ve just been so swamped, you know how it is.”</li>
            <li><span className="font-semibold text-white">2. Name the impact.</span> Show you understand how it felt for them. “That probably made you feel like you didn’t matter to me.” This is the part almost everyone skips.</li>
            <li><span className="font-semibold text-white">3. Make it right.</span> Say what changes. “From now on I’ll tell you if I need a day before replying” is a promise they can hold you to.</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Bad vs better examples</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-white">Late reply</p>
              <p className="text-red-200">Bad: “sorry i was busy lol”</p>
              <p className="text-emerald-200">Better: “I’m sorry I went quiet for a week. That must have felt pretty bad, especially after the plans we made. It won’t happen like that again — if I need time, I’ll say so.”</p>
            </div>
            <div>
              <p className="font-semibold text-white">Broken promise</p>
              <p className="text-red-200">Bad: “sorry, things came up”</p>
              <p className="text-emerald-200">Better: “I promised I’d be there and I wasn’t. I know that was disappointing, and you had every right to count on me. Can we plan it again this weekend, my treat?”</p>
            </div>
            <div>
              <p className="font-semibold text-white">Said something hurtful</p>
              <p className="text-red-200">Bad: “sorry if you’re sensitive about it”</p>
              <p className="text-emerald-200">Better: “What I said was careless and it clearly hurt you. I’m sorry. I didn’t mean it, but I understand the impact — and I’ll be more careful with my words.”</p>
            </div>
          </div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">When not to apologize</h2>
          <p className="mt-3 text-muted">
            Don’t apologize for things that aren’t wrong: having boundaries, saying no, needing rest, or simply existing. Over-apologizing teaches people your words are cheap. Save “sorry” for when you actually owe one — it keeps the word powerful.
          </p>
        </section>
        <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
          <h2 className="text-2xl font-bold text-white">Struggling with the words?</h2>
          <p className="mt-2 text-muted">Banter can turn “I messed up” into an apology that actually sounds like you — and actually lands.</p>
          <Link href="/dashboard" className="btn btn-plus mt-5 rounded-full">Open Banter</Link>
        </section>
      </article>
    </InfoPageShell>
  );
}
