import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';
import { Download, Keyboard, ShieldCheck, WandSparkles, MessageSquare, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';

const steps = [
  ['Create or open account', 'Log in first. Keyboard download is locked behind your Banter account so beta access stays controlled.'],
  ['Download APK', 'Tap Download APK. Install the private Android beta and allow install from this source if Android asks.'],
  ['Connect keyboard', 'Open Banter Keyboard, keep the server URL as https://banter-mu.vercel.app, then sign in and Save.'],
  ['Enable keyboard', 'Android Settings → Keyboard → Manage keyboards → turn on Banter Keyboard.'],
  ['Test one real message', 'Open Notes or WhatsApp, type rough text, tap 🪄, and choose a suggestion.'],
];

const tests = [
  ['English', 'how do i say this is not my fault'],
  ['Hinglish', 'kkrh'],
  ['Work', 'write mail we did not book these parts error came'],
  ['Daily chat', 'tumne khana kha liya'],
];

export default function KeyboardPage() {
  return (
    <InfoPageShell
      eyebrow="Android keyboard beta"
      title="Your AI reply button inside any app."
      description="Install Banter Keyboard, type rough text in WhatsApp or Gmail, tap 🪄, and get a reply you can actually send."
    >
      <section className="relative overflow-hidden rounded-[2.5rem] border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-brand/25 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#9fd0ff]"><Keyboard size={30} /></div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white">Beta access requires login.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              We keep downloads behind login during testing so we can track bugs, protect the APK, and revoke keyboard tokens if needed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/api/download-keyboard" className="btn-plus rounded-full px-5 py-3"><Download size={17} /> Download APK</a>
              <Link href="/dashboard" className="btn-ghost rounded-full px-5 py-3">Open Banter</Link>
              <Link href="/dashboard/feedback" className="btn-ghost rounded-full px-5 py-3"><MessageSquare size={17} /> Report bug</Link>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-3 py-1.5 text-xs text-gold/90">
              <Lock size={13} /> Limited Android beta while we test with real users.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#9fd0ff]"><WandSparkles size={17} /> What it does</div>
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl bg-white/[0.06] p-3 text-white/85">Type: “sorry busy”</div>
              <div className="rounded-2xl bg-[#4aa8ff]/15 p-3 text-white">Tap 🪄</div>
              <div className="rounded-2xl bg-white/[0.06] p-3 text-white/85">Get: “Sorry, I got caught up. Didn’t mean to ignore you.”</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [<ShieldCheck key="i" />, 'Private by design', 'Text is sent only when you tap 🪄. No background typing upload.'],
          [<WandSparkles key="i" />, 'Same-language replies', 'English stays English. Hinglish stays Hinglish. Regional scripts stay in script.'],
          [<CheckCircle2 key="i" />, 'Undo supported', 'If a suggestion feels wrong, use Undo from the suggestion row.'],
        ].map(([icon, title, body]) => (
          <div key={String(title)} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <div className="mb-4 text-[#9fd0ff]">{icon}</div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-3xl font-black tracking-[-0.03em] text-white">Setup in five steps.</h2>
        <div className="mt-5 grid gap-3">
          {steps.map(([title, body], i) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#4aa8ff]/15 text-sm font-bold text-[#9fd0ff]">{i + 1}</span>
              <div><h3 className="font-semibold text-white">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{body}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-3xl font-black tracking-[-0.03em] text-white">Test these first.</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tests.map(([label, text]) => (
            <div key={text} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/85">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9fd0ff]">{label}</p>{text}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-gold/25 bg-gold/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 shrink-0 text-gold" />
          <div><h2 className="text-xl font-bold text-white">Beta warning</h2><p className="mt-2 text-sm leading-relaxed text-muted">This APK is for private testing. Do not use it for passwords, banking, OTPs, or highly sensitive information.</p></div>
        </div>
      </section>
    </InfoPageShell>
  );
}
