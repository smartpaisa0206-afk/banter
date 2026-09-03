'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const params = useSearchParams();
  const googleError = params.get('error') === 'google';

  const [tab, setTab] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState(
    googleError ? 'Google sign-in failed. Try again or use email.' : '',
  );
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | undefined>();

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setErr(data.error || 'Something went wrong.');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setErr(data.error || 'Could not send a code.');
      return;
    }
    setOtpSent(true);
    setDevCode(data.devCode);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setErr(data.error || 'Invalid code.');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  const submitHandler = tab === 'password' ? submitPassword : otpSent ? verifyOtp : sendOtp;

  return (
    <form onSubmit={submitHandler} className="card mx-auto w-full max-w-sm space-y-4 p-6">
      <h1 className="text-xl font-semibold">
        {mode === 'login' ? 'Welcome back' : 'Create your free account'}
      </h1>
      {err && <p className="text-sm text-red-400">{err}</p>}
      {devCode && (
        <p className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold/90">
          Dev code: <b className="tracking-widest">{devCode}</b>{' '}
          <span className="opacity-70">(only shown without a real email key)</span>
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setTab('password');
            setErr('');
          }}
          className={`chip flex-1 ${tab === 'password' ? 'border-brand/60 text-white' : ''}`}
        >
          Email + Password
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('otp');
            setErr('');
          }}
          className={`chip flex-1 ${tab === 'otp' ? 'border-brand/60 text-white' : ''}`}
        >
          Magic code
        </button>
      </div>

      <div>
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      {tab === 'password' ? (
        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </div>
      ) : otpSent ? (
        <div className="space-y-2">
          <p className="text-xs text-muted">
            We sent a 6-digit code to <span className="text-white/90">{email}</span>. Enter it to
            finish (this creates your free account if you&apos;re new).
          </p>
          <div>
            <label className="label">6-digit code</label>
            <input
              className="input tracking-[0.5em]"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              maxLength={6}
              required
            />
          </div>
          <button type="button" onClick={sendOtp} className="text-xs text-brand-soft underline">
            Resend code
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted">
          We&apos;ll email you a 6-digit code — no password needed. New here? This also creates your
          free account.
        </p>
      )}

      <button className="btn-premium w-full" disabled={loading}>
        {loading
          ? '…'
          : tab === 'password'
            ? mode === 'login'
              ? 'Log in'
              : 'Sign up'
            : otpSent
              ? 'Verify & continue'
              : 'Send code'}
      </button>

      <a
        href="/api/auth/google"
        className="btn-ghost flex w-full items-center justify-center gap-2"
      >
        <GoogleIcon /> Continue with Google
      </a>

      <p className="text-center text-xs text-muted">
        {mode === 'login' ? (
          <Link href="/signup" className="underline">
            New here? Create an account
          </Link>
        ) : (
          <Link href="/login" className="underline">
            Already have an account? Log in
          </Link>
        )}
      </p>
    </form>
  );
}
