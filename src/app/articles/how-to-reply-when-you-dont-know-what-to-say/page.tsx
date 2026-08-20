import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function ArticlePage() {
  return (
    <InfoPageShell
      eyebrow="Article"
      title="How to Reply When You Don’t Know What to Say"
      description="A simple guide for the moment when you type, delete, type again, and still feel stuck."
    >
      <article className="space-y-6 text-base leading-relaxed text-white/78">
        <p>
          We’ve all stared at a message longer than we want to admit. Not because we don’t care, but because the wrong words can make us sound cold, needy, rude, fake, or awkward.
        </p>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Why replying feels difficult</h2>
          <p className="mt-3 text-muted">
            The hard part is not typing. The hard part is choosing words that feel safe and natural. When a message matters, your brain starts checking every possible meaning.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">The simple rule</h2>
          <p className="mt-3 text-muted">Don’t try to sound perfect. Try to sound clear, honest, and human.</p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Bad vs better examples</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-white">When you need time</p>
              <p className="text-red-200">Bad: “idk”</p>
              <p className="text-emerald-200">Better: “Give me a little time to think about this. I want to reply properly.”</p>
            </div>
            <div>
              <p className="font-semibold text-white">When someone is upset</p>
              <p className="text-red-200">Bad: “chill, I was busy”</p>
              <p className="text-emerald-200">Better: “You’re right, I should’ve replied sooner. I didn’t mean to make you feel ignored.”</p>
            </div>
            <div>
              <p className="font-semibold text-white">When the conversation is dry</p>
              <p className="text-red-200">Bad: “ok”</p>
              <p className="text-emerald-200">Better: “Fair enough. What’s been the best part of your day so far?”</p>
            </div>
          </div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Templates you can use</h2>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• “I get what you mean. Let me think and reply properly.”</li>
            <li>• “I didn’t mean for it to come across that way. What I meant was…”</li>
            <li>• “That makes sense. I appreciate you telling me honestly.”</li>
            <li>• “I’m not ignoring you — I just want to answer this properly.”</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
          <h2 className="text-2xl font-bold text-white">Still stuck?</h2>
          <p className="mt-2 text-muted">Banter can turn your situation into a message you can actually send.</p>
          <Link href="/dashboard" className="btn-plus mt-5 rounded-full">Open Banter</Link>
        </section>
      </article>
    </InfoPageShell>
  );
}
