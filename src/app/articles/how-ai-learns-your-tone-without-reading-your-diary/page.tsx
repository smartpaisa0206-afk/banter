import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function ArticlePage() {
  return (
    <InfoPageShell
      eyebrow="Article · AI & Writing"
      title="How AI Learns Your Tone Without Reading Your Diary"
      description="The difference between AI that mimics you and AI that amplifies you."
    >
      <article className="space-y-6 text-base leading-relaxed text-white/78">
        <p>
          People worry that a writing AI needs to know them deeply — their secrets, their history, their voice. But good tone matching doesn’t require your diary. It requires something much simpler: a few good examples and the patterns inside them.
        </p>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Mimic vs amplify</h2>
          <p className="mt-3 text-muted">
            An AI that mimics you copies your words — including your bad habits, your filler, your half-finished thoughts. An AI that amplifies you captures the patterns underneath: how direct you are, how warm, how formal — and then applies them to thoughts you haven’t even finished. The goal isn’t a clone of your drafts. It’s the version of you that had five more minutes to think.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">What “tone” actually is</h2>
          <p className="mt-3 text-muted">
            Tone isn’t a mystery. It’s a bundle of small, measurable choices — and just a handful of examples reveals most of them:
          </p>
          <ul className="mt-4 space-y-3 text-muted">
            <li><span className="font-semibold text-white">Sentence length.</span> Short and punchy (“Got it. Will do.”) vs flowing (“Thanks so much for sending this over, I really appreciate it.”)</li>
            <li><span className="font-semibold text-white">Warmth markers.</span> Some people open with “Hey!” and close with “Thanks!”. Others don’t. Both are fine — the AI just needs to notice.</li>
            <li><span className="font-semibold text-white">Directness.</span> “Send me the file” vs “Whenever you get a chance, could you send the file?” — same ask, different person.</li>
            <li><span className="font-semibold text-white">Vocabulary.</span> Your slang, your Hinglish, your emojis (or lack of them) — these are the fingerprints of your voice.</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Examples, not surveillance</h2>
          <p className="mt-3 text-muted">
            Here’s the part that surprises people: tone matching works from the messages you paste in, in the moment. There’s no need to upload your chat history or train a model on your life. Three or four recent messages in a similar style give the AI more than enough signal. You bring the context; it brings the polish. Nothing needs to be remembered afterward.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Bad vs better: same message, different people</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-white">A casual person declining plans</p>
              <p className="text-emerald-200">“Hey, can’t make it tonight unfortunately — rain check? Have the best time though!”</p>
            </div>
            <div>
              <p className="font-semibold text-white">A formal person declining plans</p>
              <p className="text-emerald-200">“Hi, thanks so much for the invitation. I won’t be able to make it this evening, but I hope it goes wonderfully.”</p>
            </div>
            <div>
              <p className="font-semibold text-white">A warm Hinglish speaker declining plans</p>
              <p className="text-emerald-200">“Aaj nahi ho payega yaar, but kal pakka milte hain. Enjoy karo!”</p>
            </div>
            <p className="text-muted">Same situation, three real voices. The AI’s job is to sound like you — whichever you you are.</p>
          </div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">What it needs from you</h2>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• Pick the relationship — crush, boss, parent, friend. It changes everything.</li>
            <li>• Pick the tone — warm, direct, playful, professional.</li>
            <li>• Give one honest draft — even “sorry busy” is enough to work with.</li>
          </ul>
          <p className="mt-3 text-muted">That’s it. No diary required.</p>
        </section>
        <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
          <h2 className="text-2xl font-bold text-white">Hear your own voice, upgraded</h2>
          <p className="mt-2 text-muted">Paste a rough draft, pick a tone, and watch Banter rewrite it so it still sounds like you — just sharper.</p>
          <Link href="/dashboard" className="btn btn-plus mt-5 rounded-full">Open Banter</Link>
        </section>
      </article>
    </InfoPageShell>
  );
}
