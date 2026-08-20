import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';
import { ShieldCheck, Keyboard, Trash2, Smartphone } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <InfoPageShell
      eyebrow="Privacy"
      title="Your words should stay yours."
      description="Banter is built around a simple rule: help you write better without secretly collecting everything you type."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <Keyboard className="mb-4 text-[#9fd0ff]" />
          <h2 className="text-2xl font-bold text-white">Keyboard privacy</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Banter Keyboard sends text only when you tap 🪄. It does not upload every keystroke in the background.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <ShieldCheck className="mb-4 text-emerald-300" />
          <h2 className="text-2xl font-bold text-white">Private fields protected</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Banter disables magic suggestions in password/private fields where Android marks the input as sensitive.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold text-white">What Banter uses</h2>
        <ul className="mt-4 space-y-3 text-muted">
          <li>• Your account email for login.</li>
          <li>• Your current text only when you tap 🪄.</li>
          <li>• Generated messages, saved securely for history if your plan allows it.</li>
          <li>• Security events such as login attempts and keyboard token use, with hashed IPs.</li>
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <Smartphone className="mb-4 text-brand-soft" />
          <h2 className="text-2xl font-bold text-white">Device control</h2>
          <p className="mt-3 text-muted">You can revoke Android keyboard access anytime from dashboard settings.</p>
          <Link href="/dashboard/settings" className="btn-plus mt-5 rounded-full">Manage devices</Link>
        </div>
        <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6">
          <Trash2 className="mb-4 text-red-200" />
          <h2 className="text-2xl font-bold text-white">Delete account</h2>
          <p className="mt-3 text-muted">You can delete your Banter account, sessions, history, saved messages, and keyboard tokens.</p>
          <Link href="/dashboard/settings" className="btn-ghost mt-5 rounded-full">Open settings</Link>
        </div>
      </section>
    </InfoPageShell>
  );
}
