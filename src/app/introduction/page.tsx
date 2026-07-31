import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function IntroductionPage() {
  return (
    <InfoPageShell
      eyebrow="Introduction"
      title="Banter helps you decide what to say next."
      description="Most people do not struggle because they cannot type. They struggle because one message can change the tone of a relationship, a work conversation, or a first impression."
    >
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold">What Banter does</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Banter turns your situation into message options you can actually send. It supports personal replies, flirty texts, apologies, captions, emails, follow-ups, notices, and professional messages.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Personal', 'For friends, crushes, partners, family, apologies, and everyday chats.'],
          ['Professional', 'For emails, follow-ups, captions, updates, notices, and work messages.'],
          ['Human tone', 'You choose the context and tone so the result feels closer to you.'],
        ].map(([title, body]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
            <h3 className="font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </section>
      <Link href="/signup" className="btn-plus rounded-full">Try Banter free</Link>
    </InfoPageShell>
  );
}
