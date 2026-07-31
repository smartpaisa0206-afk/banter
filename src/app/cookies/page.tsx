import { InfoPageShell } from '@/components/InfoPageShell';

export default function CookiesPage() {
  return (
    <InfoPageShell
      eyebrow="Cookies"
      title="Cookie and privacy basics."
      description="This page explains how Banter uses basic browser storage and cookies in simple language."
    >
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold">Why cookies are used</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Banter uses essential cookies to keep you logged in and protect your session. Without these, the dashboard and account features cannot work properly.
        </p>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold">Local storage</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Banter may use browser storage for simple preferences, such as acknowledgement messages or shared text from another app.
        </p>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
        <h2 className="text-2xl font-bold">Your control</h2>
        <p className="mt-3 leading-relaxed text-muted">
          You can clear cookies from your browser settings. If you delete your account from settings, your account data, saved messages, sessions, and history are removed from Banter.
        </p>
      </section>
    </InfoPageShell>
  );
}
