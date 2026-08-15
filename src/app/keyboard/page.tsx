import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';
import { Download, Keyboard, ShieldCheck, WandSparkles, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

const steps = [
  ['1. Create a Banter account', 'Sign up or log in on the Banter website first. The keyboard uses the same account.'],
  ['2. Download the Android APK', 'Install the private beta APK on your Android phone. If Android blocks it, allow install from this source.'],
  ['3. Open Banter Keyboard', 'Server URL should be https://banter-mu.vercel.app. Enter your email and password, then tap Save and Connect.'],
  ['4. Enable the keyboard', 'Go to Android Settings → Keyboard → Manage keyboards → turn on Banter Keyboard.'],
  ['5. Switch keyboard and test', 'Open WhatsApp/Notes, switch to Banter Keyboard, type rough text, then tap 🪄.'],
];

const tests = [
  'how do i say this is not my fault',
  'kkrh',
  'write mail we did not book these parts error came',
  'tumne khana kha liya',
];

export default function KeyboardPage() {
  return (
    <InfoPageShell
      eyebrow="Android Keyboard Beta"
      title="Type rough. Tap 🪄. Send better."
      description="Banter Keyboard is a private Android beta that helps you generate better replies inside WhatsApp, Instagram, Gmail, Notes, and more."
    >
      <section className="relative overflow-hidden rounded-[2rem] border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-brand/25 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#9fd0ff]">
              <Keyboard size={30} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">Private beta for Android testers</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This is not Play Store public release yet. Use it only if you are comfortable testing a beta APK and sharing feedback.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/banter-keyboard-beta.apk" className="btn-plus rounded-full px-5 py-3">
                <Download size={17} /> Download APK
              </a>
              <Link href="/signup" className="btn-ghost rounded-full px-5 py-3">
                Create account
              </Link>
              <Link href="/dashboard/feedback" className="btn-ghost rounded-full px-5 py-3">
                <MessageSquare size={17} /> Send feedback
              </Link>
            </div>
            <p className="mt-3 text-xs text-gold/90">
              If download does not work, the APK has not been uploaded to the website yet. Ask HNY Labs for the beta APK link.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#9fd0ff]">
              <WandSparkles size={17} /> Keyboard flow
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl bg-white/[0.06] p-3 text-white/85">Rough text: “she replied with just ok”</div>
              <div className="rounded-2xl bg-[#4aa8ff]/15 p-3 text-white">Tap 🪄</div>
              <div className="rounded-2xl bg-white/[0.06] p-3 text-white/85">Suggestion: “That ‘ok’ feels suspiciously dry 😭 what happened?”</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
          <ShieldCheck className="mb-4 text-emerald-300" />
          <h3 className="font-bold text-white">Privacy-first</h3>
          <p className="mt-2 text-sm text-muted">Banter only sends text when you tap 🪄. It does not upload every keystroke.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
          <WandSparkles className="mb-4 text-[#9fd0ff]" />
          <h3 className="font-bold text-white">Same-language replies</h3>
          <p className="mt-2 text-sm text-muted">English stays English. Hinglish stays Hinglish. Tamil stays Tamil.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
          <CheckCircle2 className="mb-4 text-brand-soft" />
          <h3 className="font-bold text-white">Undo supported</h3>
          <p className="mt-2 text-sm text-muted">If a suggestion doesn’t feel right, use Undo from the suggestion row.</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold text-white">Setup steps</h2>
        <div className="mt-5 space-y-4">
          {steps.map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold text-white">Test these messages</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tests.map((t) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/85">{t}</div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-gold/25 bg-gold/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 shrink-0 text-gold" />
          <div>
            <h2 className="text-xl font-bold text-white">Beta warning</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              This APK is for private testing. It may have bugs. Do not use it for passwords, banking, OTPs, or highly sensitive information.
            </p>
          </div>
        </div>
      </section>
    </InfoPageShell>
  );
}
