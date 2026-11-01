import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function ArticlePage() {
  return (
    <InfoPageShell
      eyebrow="Article · Language"
      title="Why Hinglish Is the Future of Messaging"
      description="Code-switching isn’t laziness — it’s a sophisticated form of expression. Banter gets it."
    >
      <article className="space-y-6 text-base leading-relaxed text-white/78">
        <p>
          “kkrh” and “kal party mein chal raha hai?” are not broken Hindi or broken English. They’re a third thing — a language born in group chats, shaped by speed, humor, and the need to say exactly the right thing to exactly the right person.
        </p>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Code-switching is a skill, not a flaw</h2>
          <p className="mt-3 text-muted">
            Linguists have known this for decades: switching between languages mid-sentence takes real cognitive work. You’re constantly reading the room — which language carries the joke, which carries the warmth, which carries authority. People who mix languages aren’t confused about either one. They’re fluent in both, plus the art of combining them.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Why it fits texting perfectly</h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li><span className="font-semibold text-white">It’s faster.</span> “aaj nahi ho payega yaar” types quicker than a full sentence in either language — and every thumb counts.</li>
            <li><span className="font-semibold text-white">It’s warmer.</span> English can sound formal with family. Pure Hindi can sound stiff with friends. Hinglish sits in the sweet spot — casual, affectionate, real.</li>
            <li><span className="font-semibold text-white">It’s funnier.</span> Some jokes only land in one language. “Bhai full bakchodi ho rahi thi” loses everything in translation. Code-switching lets humor stay native.</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">The grammar police are wrong</h2>
          <p className="mt-3 text-muted">
            Every generation’s slang gets called “ruining the language” — and then it becomes the language. What older generations wrote off as laziness in texts is now just how hundreds of millions of people actually communicate. The future of messaging isn’t one language winning. It’s all of them, mixed freely, the way real conversations work.
          </p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-bold text-white">Examples that only work in Hinglish</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-white">Declining plans warmly</p>
              <p className="text-emerald-200">“Aaj nahi ho payega yaar, but kal pakka. Tum log enjoy karo, photos bhejna!” — try saying that in “proper” English without sounding cold.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Teasing a friend</p>
              <p className="text-emerald-200">“Bhai tu toh full CEO ban gaya, ab toh reply bhi nahi aate” — half affection, half roast. No single language does both at once.</p>
            </div>
          </div>
        </section>
        <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
          <h2 className="text-2xl font-bold text-white">Banter speaks your language</h2>
          <p className="mt-2 text-muted">Type rough Hinglish — shortcuts, mixing, all of it. Banter understands it and rewrites it without killing the vibe.</p>
          <Link href="/dashboard" className="btn btn-plus mt-5 rounded-full">Open Banter</Link>
        </section>
      </article>
    </InfoPageShell>
  );
}
