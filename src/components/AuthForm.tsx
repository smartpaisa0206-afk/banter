'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Key, ArrowRight, AlertCircle } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState(googleError ? 'Google sign-in failed. Try again or use email.' : '');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | undefined>();

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true);
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setErr(data.error || 'Something went wrong.'); return; }
    router.push('/dashboard'); router.refresh();
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true);
    const res = await fetch('/api/auth/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setErr(data.error || 'Could not send a code.'); return; }
    setOtpSent(true); setDevCode(data.devCode);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true);
    const res = await fetch('/api/auth/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setErr(data.error || 'Invalid code.'); return; }
    router.push('/dashboard'); router.refresh();
  }

  const submitHandler = tab === 'password' ? submitPassword : otpSent ? verifyOtp : sendOtp;

  return (
    <motion.form onSubmit={submitHandler} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur-2xl shadow-[0_40px_120px_-40px_rgba(124,92,255,0.4)]"
    >
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#7c5cff]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#4aa8ff]/10 blur-3xl" />
      <div className="relative">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-1 text-2xl font-black text-white">
          {mode === 'login' ? 'Welcome back 👋' : 'Create your account'}
        </motion.h1>
        <p className="mb-5 text-sm text-muted">
          {mode === 'login' ? 'Sign in to continue rewriting.' : 'Free forever. No credit card needed.'}
        </p>
        <AnimatePresence mode="wait">
          {err && (
            <motion.div initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
            >
              <AlertCircle size={14} className="shrink-0" />{err}
            </motion.div>
          )}
        </AnimatePresence>
        {devCode && (
          <div className="mb-4 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2.5 text-xs text-gold/90">
            Dev code: <b className="tracking-widest">{devCode}</b><span className="ml-1 opacity-70">(no real email key)</span>
          </div>
        )}
        <div className="mb-5 flex gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-1">
          {[['password', 'Password'], ['otp', 'Magic code']].map(([t, l]) => (
            <button key={t} type="button" onClick={() => { setTab(t as 'password' | 'otp'); setErr(''); }}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all duration-200 ${tab === t ? 'bg-[#7c5cff] text-white shadow-glow' : 'text-white/60 hover:text-white/85'}`}
            >{l}</button>
          ))}
        </div>
        <div className="mb-3">
          <label className="label">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {tab === 'password' ? (
            <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="mb-4">
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input className="input px-3.5 pl-9 pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </motion.div>
          ) : otpSent ? (
            <motion.div key="otp-verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="mb-4 space-y-3">
              <p className="text-xs text-muted">We sent a 6-digit code to <span className="font-medium text-white/90">{email}</span>.</p>
              <div>
                <label className="label">6-digit code</label>
                <div className="relative">
                  <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input className="input pl-9 tracking-[0.6em]" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="123456" maxLength={6} required />
                </div>
              </div>
              <button type="button" onClick={sendOtp} className="text-xs text-[#a78bfa] underline hover:text-[#c4b5fd] transition-colors">Resend code</button>
            </motion.div>
          ) : (
            <motion.div key="otp-send" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="mb-4">
              <p className="text-xs leading-relaxed text-muted">We'll email a 6-digit code — no password needed. New here? This also creates your free account.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button whileTap={{ scale: 0.97 }} className="btn-premium mb-3 w-full rounded-2xl py-3 text-base" disabled={loading}>
          {loading ? <span className="flex items-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="block h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />Processing…</span>
            : <span className="flex items-center gap-2">{tab === 'password' ? (mode === 'login' ? 'Log in' : 'Sign up') : otpSent ? 'Verify & continue' : 'Send code'}<ArrowRight size={16} /></span>}
        </motion.button>
        <motion.a href="/api/auth/google" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="btn-ghost mb-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3">
          <GoogleIcon /> Continue with Google
        </motion.a>
        <div className="divider mb-4" />
        <p className="text-center text-xs text-muted">
          {mode === 'login'
            ? <Link href="/signup" className="text-[#a78bfa] underline hover:text-[#c4b5fd] transition-colors">New here? Create an account →</Link>
            : <Link href="/login" className="text-[#a78bfa] underline hover:text-[#c4b5fd] transition-colors">Already have an account? Log in →</Link>}
        </p>
      </div>
    </motion.form>
  );
}
