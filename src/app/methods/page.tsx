import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

const steps = [
  ['1. Choose a mode', 'Use Personal for relationships and everyday chats. Use Professional for emails, work, captions, and business messages.'],
  ['2. Pick the situation', 'Select what you want: flirt, apologize, follow up, write an email, make a caption, or create a notice.'],
  ['3. Add real context', 'Write one or two lines about what happened. The more specific you are, the better the result feels.'],
  ['4. Choose tone and length', 'Make it warm, confident, professional, bold, short, medium, or long.'],
  ['5. Review before sending', 'Banter gives a draft. You stay in control. Edit anything that does not feel like you.'],
];

export default function MethodsPage() {
  return (
    <InfoPageShell
      eyebrow="How to use"
      title="The simple Banter method."
      description="Use Banter as a decision helper. It gives you the first draft so you stop overthinking and start communicating clearly."
    >
      <div className="space-y-4">
        {steps.map(([title, body]) => (
          <section key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{body}</p>
          </section>
        ))}
      </div>
      <div className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
        <h2 className="text-2xl font-bold">Best tip</h2>
        <p className="mt-2 text-muted">Don’t ask for “a reply.” Add the real situation: who it is for, what happened, and how you want to sound.</p>
      </div>
      <Link href="/dashboard" className="btn-plus rounded-full">Open Banter</Link>
    </InfoPageShell>
  );
}
