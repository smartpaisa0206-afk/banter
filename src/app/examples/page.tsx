import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

const examples = [
  ['Dry reply', 'ok', 'I get what you mean. Give me a little time to think about it properly.'],
  ['Apology', 'Sorry if you felt bad.', 'I’m sorry I spoke harshly earlier. That wasn’t fair to you, and I’ll be more careful with my tone.'],
  ['Flirty text', 'hey', 'I liked talking to you today. You have a way of making simple conversations feel fun.'],
  ['Follow-up email', 'Any update?', 'Hi, just following up on my last message. Could you please let me know if there’s any update when you get a chance?'],
  ['Caption', 'nice day', 'Small pause, good light, better mood.'],
];

export default function ExamplesPage() {
  return (
    <InfoPageShell
      eyebrow="Samples"
      title="Examples that show the difference."
      description="Banter is useful when you know the meaning but cannot find the right words. Here are simple before-and-after samples."
    >
      <div className="space-y-4">
        {examples.map(([label, bad, better]) => (
          <section key={label} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9fd0ff]">{label}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4">
                <p className="text-xs uppercase text-red-200">Weak</p>
                <p className="mt-2 text-white/85">“{bad}”</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-xs uppercase text-emerald-200">Better</p>
                <p className="mt-2 text-white/85">“{better}”</p>
              </div>
            </div>
          </section>
        ))}
      </div>
      <Link href="/dashboard" className="btn-plus rounded-full">Open workspace</Link>
    </InfoPageShell>
  );
}
