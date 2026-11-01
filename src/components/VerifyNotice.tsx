'use client';
import { useEffect, useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';

// Shown to logged-in users whose email isn't verified yet. Blocks fake /
// throwaway signups: you can only verify an inbox you actually control.
export function VerifyNotice() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setEmail(d.user.email);
          setVerified(d.emailVerified === 1);
        }
      })
      .catch(() => {});
  }, []);

  async function resend() {
    setBusy(true);
    setMsg('');
    setDevCode(null);
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (d.devCode) setDevCode(d.devCode);
    setMsg(d.ok ? 'Code sent — check your email (dev code shown if no email provider).' : d.error || 'Could not send code.');
  }

  async function verify() {
    setBusy(true);
    setMsg('');
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setVerified(true);
      setMsg('Email verified — you’re all set!');
    } else {
      setMsg(d.error || 'Invalid code.');
    }
  }

  if (verified === null || verified) return null;

  return (
    <div className="card border-gold/30 bg-gradient-to-r from-gold/10 to-brand/10 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold to-yellow-300 text-ink">
          <Mail size={20} />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-white">Verify your email to start writing</p>
          <p className="text-sm text-muted">We sent a 6-digit code to {email}. Enter it below.</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          inputMode="numeric"
          className="input w-32 tracking-[0.3em]"
        />
        <button onClick={verify} disabled={busy} className="btn-gold">
          Verify
        </button>
        <button onClick={resend} disabled={busy} className="btn-ghost">
          {busy ? <RefreshCw size={14} className="animate-spin" /> : 'Resend'}
        </button>
      </div>
      {devCode && <p className="mt-2 text-xs text-gold">Dev code: {devCode}</p>}
      {msg && <p className="mt-2 text-xs text-muted">{msg}</p>}
    </div>
  );
}
