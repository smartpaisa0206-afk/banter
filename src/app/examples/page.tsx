import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

const examples = [
  ['Late reply', 'sorry busy', 'Sorry, I got caught up. Didn’t mean to ignore you — I should’ve replied earlier.'],
  ['Not my fault', 'how do i say this is not my fault', 'I understand why it looks that way, but I want to clarify this wasn’t from my side.'],
  ['Hinglish', 'kkrh', 'kuch khaas nahi, tu bata?'],
  ['Apology', 'sorry if you felt bad', 'I’m sorry I said it that way. That wasn’t fair, and I’ll be more careful with my tone.'],
  ['Work mail', 'tell x we did not book these parts error came', 'Hi, I’d like to clarify that these parts were not booked from our side. We are checking the error and will update you shortly.'],
  ['Dry reply', 'she replied just ok', 'That “ok” feels a little mysterious. What happened?'],
];

export default function ExamplesPage() {
  return (
    <InfoPageShell
      eyebrow="Examples"
      title="See the exact moment Banter helps."
      description="No abstract feature list. Just rough words becoming replies people can actually send."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {examples.map(([label, bad, better]) => (
          <section key={label} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9fd0ff]">{label}</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4"><p className="text-xs uppercase tracking-[0.18em] text-red-200">Rough</p><p className="mt-2 text-white/85">{bad}</p></div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4"><p className="text-xs uppercase tracking-[0.18em] text-emerald-200">After 🪄</p><p className="mt-2 text-white/85">{better}</p></div>
            </div>
          </section>
        ))}
      </div>
      <div className="rounded-[2rem] border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-7 text-center">
        <h2 className="text-3xl font-black tracking-[-0.03em] text-white">Have one message you’re avoiding?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted">Open Banter, paste the rough version, and let it give you a sendable first draft.</p>
        <Link href="/dashboard" className="btn-plus mt-5 rounded-full">Open Banter</Link>
      </div>
    </InfoPageShell>
  );
}
