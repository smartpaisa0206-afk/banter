'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Logo } from './Logo';

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
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState(
    googleError ? 'Google sign-in failed. Try again or use email.' : '',
  );
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  // Where to send the user after auth: validated ?next= param, else /dashboard.
  // Only same-origin absolute paths are allowed ('/' but never '//').
  function safeNext(): string {
    const n = params.get('next');
    return n && n.startsWith('/') && !n.startsWith('//') ? n : '/dashboard';
  }

  const nextQuery = safeNext() === '/dashboard' ? '' : `?next=${encodeURIComponent(safeNext())}`;

  function onAuthed() {
    const dest = safeNext();
    setSuccess(true);
    setTimeout(() => {
      router.push(dest);
      router.refresh();
    }, 900);
  }

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
    onAuthed();
  }

  async function sendOtp(e: React.SyntheticEvent) {
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
    onAuthed();
  }

  const submitHandler = tab === 'password' ? submitPassword : otpSent ? verifyOtp : sendOtp;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-5">
      {/* BG orbs */}
      <div className="orb pointer-events-none -left-40 -top-40 h-[500px] w-[500px] bg-[#7c5cff]/15" />
      <div className="orb pointer-events-none -right-32 bottom-0 h-[400px] w-[400px] bg-[#4aa8ff]/12" style={{ animationDelay: '5s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo className="scale-125" />
          </Link>
        </div>

        <div className="premium-card p-7">
          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20"
                >
                  <Check size={28} className="text-emerald-400" />
                </motion.div>
                <p className="font-bold text-white">Welcome to Banter!</p>
                <p className="text-sm text-muted">Taking you to your dashboard…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <>
              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-xl font-black text-white">
                  {mode === 'login' ? 'Welcome back 👋' : 'Create your free account'}
                </h1>
                <p className="mt-1 text-sm text-muted">
                  {mode === 'login'
                    ? 'Sign in to your Banter account.'
                    : 'Start rewriting better messages today.'}
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {err && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    {err}
                  </motion.p>
                )}
              </AnimatePresence>

              {devCode && (
                <p className="mb-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold/90">
                  Dev code: <b className="tracking-widest">{devCode}</b>{' '}
                  <span className="opacity-70">(only shown without a real email key)</span>
                </p>
              )}

              {/* Tab toggle */}
              <div className="mb-5 flex gap-1.5 rounded-xl border border-white/8 bg-white/[0.03] p-1">
                {(['password', 'otp'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTab(t); setErr(''); setOtpSent(false); setDevCode(undefined); }}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                      tab === t ? 'bg-[#7c5cff] text-white shadow-glow' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {t === 'password' ? '🔑 Password' : '✉️ Magic code'}
                  </button>
                ))}
              </div>

              <form onSubmit={submitHandler} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      className="input pl-10"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password or OTP */}
                <AnimatePresence mode="wait">
                  {tab === 'password' ? (
                    <motion.div
                      key="password"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="label">Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                          className="input pl-10 pr-10"
                          type={showPass ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          minLength={8}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((v) => !v)}
                          aria-label={showPass ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-white"
                        >
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </motion.div>
                  ) : otpSent ? (
                    <motion.div
                      key="otpcode"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="mb-3 rounded-xl border border-[#4aa8ff]/25 bg-[#4aa8ff]/8 px-3 py-2.5 text-xs text-[#9fd0ff]">
                        We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
                      </p>
                      <label className="label">6-digit code</label>
                      <input
                        className="input text-center text-lg font-bold tracking-[0.6em]"
                        inputMode="numeric"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        required
                      />
                      <button type="button" onClick={sendOtp} className="mt-2 text-xs text-[#a78bfa] underline transition-colors hover:text-white">
                        Resend code
                      </button>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="otpinfo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-muted"
                    >
                      We&apos;ll email you a 6-digit code — no password needed. New here? This also creates your free account.
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="btn btn-premium w-full rounded-xl py-3.5 text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block"
                    >
                      ⟳
                    </motion.span>
                  ) : tab === 'password' ? (
                    <>{mode === 'login' ? 'Log in' : 'Create account'} <ArrowRight size={16} /></>
                  ) : otpSent ? (
                    <>Verify &amp; continue <ArrowRight size={16} /></>
                  ) : (
                    <>Send magic code <ArrowRight size={16} /></>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="divider flex-1" />
                <span className="text-xs text-muted">or</span>
                <div className="divider flex-1" />
              </div>

              {/* Google */}
              <a
                href={`/api/auth/google${nextQuery}`}
                className="btn btn-ghost w-full rounded-xl py-3"
              >
                <GoogleIcon size={18} />
                Continue with Google
              </a>

              {/* Switch mode */}
              <p className="mt-5 text-center text-xs text-muted">
                {mode === 'login' ? (
                  <>Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-[#a78bfa] underline transition-colors hover:text-white">Sign up free</Link>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <Link href="/login" className="text-[#a78bfa] underline transition-colors hover:text-white">Log in</Link>
                  </>
                )}
              </p>
            </>
          )}
        </div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex items-center justify-center gap-4 text-xs text-muted"
        >
          <span className="flex items-center gap-1"><Sparkles size={11} className="text-[#a78bfa]" /> Free forever plan</span>
          <span className="flex items-center gap-1"><Check size={11} className="text-emerald-400" /> No credit card</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
