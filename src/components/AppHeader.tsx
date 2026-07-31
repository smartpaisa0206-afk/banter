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

  const plus = role === 'premium' || role === 'admin' || role === 'basic';
  const navItem = 'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2.5 text-sm text-white/82 transition hover:bg-white/10 hover:text-white';

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/82 backdrop-blur-2xl">
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
        <div className="border-t border-white/10 bg-ink/95 px-4 py-3 shadow-[0_24px_70px_-50px_rgba(74,168,255,0.75)] backdrop-blur-2xl">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
            <span className="mr-1 hidden max-w-[170px] truncate text-sm font-semibold text-white/80 md:inline" title={email || 'Profile'}>
              {email || 'Profile'}
            </span>

            <div className="flex rounded-full border border-white/10 bg-black/25 p-1">
              <button
                type="button"
                onClick={() => setMode('personal')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === 'personal' ? 'bg-brand text-white shadow-glow' : 'text-white/65 hover:bg-white/10'}`}
              >
                <Heart size={14} className="text-pink-300" /> Personal
              </button>
              <button
                type="button"
                onClick={() => setMode('professional')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === 'professional' ? 'bg-[#4aa8ff] text-white shadow-[0_12px_35px_-16px_rgba(74,168,255,0.9)]' : 'text-white/65 hover:bg-white/10'}`}
              >
                <Briefcase size={14} /> Professional
              </button>
            </div>

            <Link onClick={() => setOpen(false)} href="/dashboard" className={navItem}><Grid3X3 size={16} /> Dashboard</Link>
            <Link onClick={() => setOpen(false)} href="/dashboard" className={navItem}><PenLine size={16} /> Compose</Link>
            <Link onClick={() => setOpen(false)} href="/dashboard/history" className={navItem}><History size={16} /> History</Link>
            <Link onClick={() => setOpen(false)} href="/dashboard/saved" className={navItem}><Bookmark size={16} /> Saved</Link>
            <Link onClick={() => setOpen(false)} href="/dashboard/feedback" className={navItem}><MessageSquare size={16} /> Feedback</Link>
            <Link onClick={() => setOpen(false)} href="/dashboard/upgrade" className={navItem}><Sparkles size={16} /> Pricing</Link>
            <Link onClick={() => setOpen(false)} href="/articles" className={navItem}>Articles</Link>
            <Link onClick={() => setOpen(false)} href="/examples" className={navItem}>Examples</Link>
            <Link onClick={() => setOpen(false)} href="/methods" className={navItem}>How to use</Link>
            <Link onClick={() => setOpen(false)} href="/support" className={navItem}>Support</Link>
            <Link onClick={() => setOpen(false)} href="/dashboard/settings" className={navItem}><Settings size={16} /> Settings</Link>
            <Link onClick={() => setOpen(false)} href="/dashboard/settings" className={navItem}><UserCircle size={16} /> Profile</Link>
            {role === 'admin' && <Link onClick={() => setOpen(false)} href="/admin" className={navItem}><Shield size={16} /> Admin</Link>}
            <div className="rounded-full border border-white/10 bg-white/[0.045] px-2 py-1"><LanguagePicker /></div>
            <button onClick={logout} className={`${navItem} justify-start text-left`}><LogOut size={16} /> Log out</button>
          </div>
        </div>
      )}
    </header>
  );
}
