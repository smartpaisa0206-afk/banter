import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [tab, setTab] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (!email.includes('@')) {
      setErr('Please enter a valid email address.');
      return;
    }
    if (tab === 'otp' && !otpSent) {
      setOtpSent(true);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      {/* BG orbs */}
      <div className="orb h-[500px] w-[500px] bg-[#7c5cff]/15 -top-40 -left-40 pointer-events-none" />
      <div className="orb h-[400px] w-[400px] bg-[#4aa8ff]/12 bottom-0 -right-32 pointer-events-none" style={{ animationDelay: '5s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
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
                  transition={{ type: 'spring' as const, stiffness: 300, delay: 0.1 }}
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

              {/* Tab toggle */}
              <div className="mb-5 flex gap-1.5 rounded-xl border border-white/8 bg-white/[0.03] p-1">
                {(['password', 'otp'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTab(t); setErr(''); setOtpSent(false); }}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                      tab === t ? 'bg-[#7c5cff] text-white shadow-glow' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {t === 'password' ? '🔑 Password' : '✉️ Magic code'}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="space-y-4">
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
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
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
                        className="input text-center tracking-[0.6em] text-lg font-bold"
                        inputMode="numeric"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        required
                      />
                      <button type="button" onClick={() => setOtpSent(false)} className="mt-2 text-xs text-[#a78bfa] underline hover:text-white transition-colors">
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
                      We'll email you a 6-digit code — no password needed. New here? This also creates your free account.
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
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
                    <>Verify & continue <ArrowRight size={16} /></>
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
              <button className="btn btn-ghost w-full rounded-xl py-3">
                <GoogleIcon size={18} />
                Continue with Google
              </button>

              {/* Switch mode */}
              <p className="mt-5 text-center text-xs text-muted">
                {mode === 'login' ? (
                  <>Don't have an account?{' '}
                    <Link to="/signup" className="text-[#a78bfa] underline hover:text-white transition-colors">Sign up free</Link>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <Link to="/login" className="text-[#a78bfa] underline hover:text-white transition-colors">Log in</Link>
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
