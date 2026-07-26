'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { LanguagePicker } from './LanguagePicker';
import { LogOut, PenLine, History, Bookmark, MessageSquare, Shield, Settings, UserCircle, Grid3X3, Sparkles } from 'lucide-react';

export function AppHeader() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [llmReady, setLlmReady] = useState<boolean | null>(null);

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

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <PenLine size={15} /> Compose
          </Link>
          <Link href="/dashboard/history" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <History size={15} /> History
          </Link>
          <Link href="/dashboard/saved" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <Bookmark size={15} /> Saved
          </Link>
          <Link href="/dashboard/feedback" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <MessageSquare size={15} /> Feedback
          </Link>
          {role === 'admin' && (
            <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
              <Shield size={15} /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 md:inline-flex">
            <Grid3X3 size={15} /> Workspace
          </Link>
          <Link href="/dashboard/upgrade" className={`${plus ? 'btn-plus' : 'btn-ghost'} hidden rounded-full px-3 py-2 text-sm md:inline-flex`}>
            <Sparkles size={15} /> {plus ? 'Plus' : 'Upgrade'}
          </Link>
          <LanguagePicker />
          {llmReady !== null && (
            <span
              title={llmReady ? 'AI live' : 'Template mode (no AI key)'}
              className={`hidden h-2.5 w-2.5 rounded-full sm:inline-block ${
                llmReady ? 'bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]' : 'bg-[#4aa8ff]/80'
              }`}
            />
          )}
          {remaining !== null && <span className="hidden chip xl:inline-flex">{remaining === null ? '∞' : remaining} left</span>}
          <Link href="/dashboard/settings" className="btn-ghost rounded-full px-3 py-2" aria-label="Settings">
            <Settings size={16} />
          </Link>
          <Link href="/dashboard/settings" className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-white/85 hover:bg-white/10 sm:inline-flex" title={email || 'Profile'}>
            <UserCircle size={17} />
            <span className="hidden max-w-[110px] truncate xl:inline">{email || 'Profile'}</span>
          </Link>
          <button onClick={logout} className="btn-ghost rounded-full px-3 py-2" aria-label="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
