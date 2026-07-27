'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { LanguagePicker } from './LanguagePicker';
import {
  LogOut,
  PenLine,
  History,
  Bookmark,
  MessageSquare,
  Shield,
  Settings,
  UserCircle,
  Grid3X3,
  Sparkles,
  Menu,
  X,
  Heart,
  Briefcase,
} from 'lucide-react';

export function AppHeader() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [llmReady, setLlmReady] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'personal' | 'professional'>('personal');

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setRole(d.user.role);
          setEmail(d.user.email);
          setRemaining(d.remaining);
          setLlmReady(d.llmReady);
        }
      })
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const plus = role === 'premium' || role === 'admin';
  const item = 'flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white/82 hover:bg-white/10 hover:text-white';

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/upgrade" className={`${plus ? 'btn-plus' : 'btn-ghost'} hidden rounded-full px-3 py-2 text-sm sm:inline-flex`}>
            <Sparkles size={15} /> {plus ? 'Plus' : 'Upgrade'}
          </Link>
          {llmReady !== null && (
            <span
              title={llmReady ? 'AI live' : 'Template mode (no AI key)'}
              className={`hidden h-2.5 w-2.5 rounded-full sm:inline-block ${
                llmReady ? 'bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]' : 'bg-[#4aa8ff]/80'
              }`}
            />
          )}
          {remaining !== null && <span className="hidden chip xl:inline-flex">{remaining === null ? '∞' : remaining} left</span>}
          <button onClick={() => setOpen((v) => !v)} className="btn-ghost rounded-full px-3 py-2" aria-label="Open menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-4 shadow-[0_30px_90px_-55px_rgba(74,168,255,0.75)] backdrop-blur-2xl">
          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/90">
                <UserCircle size={18} /> {email || 'Your profile'}
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-black/20 p-2">
                <button
                  type="button"
                  onClick={() => setMode('personal')}
                  className={`mode-pill ${mode === 'personal' ? 'mode-pill-active' : ''}`}
                >
                  <Heart size={15} className="text-pink-300" /> Personal
                </button>
                <button
                  type="button"
                  onClick={() => setMode('professional')}
                  className={`mode-pill ${mode === 'professional' ? 'mode-pill-active' : ''}`}
                >
                  <Briefcase size={15} className="text-[#9fd0ff]" /> Professional
                </button>
              </div>
              <p className="mt-3 text-xs text-muted">
                Menu mode is a quick preference. Use the mode switch inside Compose to generate personal or professional copy.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Link onClick={() => setOpen(false)} href="/dashboard" className={item}><Grid3X3 size={16} /> Dashboard</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard" className={item}><PenLine size={16} /> Compose</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/history" className={item}><History size={16} /> History</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/saved" className={item}><Bookmark size={16} /> Saved</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/feedback" className={item}><MessageSquare size={16} /> Feedback</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/upgrade" className={item}><Sparkles size={16} /> Pricing / Upgrade</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/settings" className={item}><Settings size={16} /> Settings</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/settings" className={item}><UserCircle size={16} /> Profile</Link>
              {role === 'admin' && <Link onClick={() => setOpen(false)} href="/admin" className={item}><Shield size={16} /> Admin</Link>}
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2"><LanguagePicker /></div>
              <button onClick={logout} className={`${item} justify-start text-left`}><LogOut size={16} /> Log out</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
