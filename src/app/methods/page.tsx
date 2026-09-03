import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

const steps = [
  ['Type rough', 'Don’t perfect the message first. Write the messy version you already have in your head.'],
  ['Tap 🪄 or Generate', 'Banter reads the current situation and turns it into sendable options.'],
  ['Pick the closest one', 'Choose the message that feels most like you.'],
  ['Edit before sending', 'AI gives the first draft. You stay responsible for the final message.'],
];

const rules = [
  ['For chat', 'Use real words: “sorry busy”, “kkrh”, “she said ok”.'],
  ['For work', 'Paste rough instructions: “send mail, parts not booked, error came”.'],
  ['For privacy', 'Keyboard sends text only when you tap 🪄. Private fields are protected.'],
];

export default function MethodsPage() {
  return (
    <InfoPageShell
      eyebrow="How it works"
      title="Don’t overthink the setup."
      description="Banter works best when you give it the real messy situation, not a perfect prompt."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map(([title, body], i) => (
          <section key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#4aa8ff]/15 text-sm font-bold text-[#9fd0ff]">{i + 1}</span>
            <h2 className="mt-5 text-2xl font-bold text-white">{title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{body}</p>
          </section>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {rules.map(([title, body]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
            <h3 className="font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </div>
      <Link href="/keyboard" className="btn-plus rounded-full">Try keyboard beta</Link>
    </InfoPageShell>
  );
}
