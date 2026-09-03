import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

export default function SupportPage() {
  return (
    <InfoPageShell
      eyebrow="Support"
      title="Found a bug? Send the exact moment."
      description="The fastest way to improve Banter is a screenshot, the text you typed, the app you tested in, and what went wrong."
    >
      <section className="rounded-[2rem] border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-7">
        <h2 className="text-3xl font-black tracking-[-0.03em] text-white">Report with context.</h2>
        <p className="mt-3 max-w-2xl text-muted">Don’t just say “not working.” Tell us the exact text, language, mode, app, and screenshot. That helps fix it fast.</p>
        <Link href="/dashboard/feedback" className="btn-plus mt-6 rounded-full">Open feedback</Link>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {[
          ['Keyboard issue', 'Phone model, Android version, app tested in, screenshot, exact typed text.'],
          ['Wrong language', 'Send input text and output screenshot. Example: English input produced Hinglish.'],
          ['Bad suggestion', 'Tell if it was too formal, cringe, wrong meaning, or too long.'],
          ['Account issue', 'Tell whether login, APK download, device revoke, or plan limit caused the problem.'],
        ].map(([title, body]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold text-white">HNY Labs</h2>
        <p className="mt-2 text-muted">Banter is an early HNY Labs product. Feedback from real conversations decides what we build next.</p>
      </section>
    </InfoPageShell>
  );
}
