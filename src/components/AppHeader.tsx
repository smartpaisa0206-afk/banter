'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { LanguagePicker } from './LanguagePicker';
import { ThemeToggle } from './ThemeToggle';
import { LogOut, PenLine, History, Bookmark, MessageSquare, Shield, Settings, UserCircle, Grid3X3, Sparkles, Menu, X, Heart, Briefcase, Keyboard } from 'lucide-react';

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
  const bulletItem = 'flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-medium text-white/82 transition hover:bg-white/10 hover:text-white';

  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: <Grid3X3 size={16} /> },
    { href: '/dashboard', label: 'Compose', icon: <PenLine size={16} /> },
    { href: '/dashboard/history', label: 'History', icon: <History size={16} /> },
    { href: '/dashboard/saved', label: 'Saved', icon: <Bookmark size={16} /> },
    { href: '/dashboard/feedback', label: 'Feedback', icon: <MessageSquare size={16} /> },
    { href: '/dashboard/upgrade', label: 'Pricing / Upgrade', icon: <Sparkles size={16} /> },
    { href: '/keyboard', label: 'Keyboard beta', icon: <Keyboard size={16} /> },
    { href: '/articles', label: 'Articles', icon: <span className="text-lg leading-none">•</span> },
    { href: '/examples', label: 'Examples', icon: <span className="text-lg leading-none">•</span> },
    { href: '/support', label: 'Support', icon: <span className="text-lg leading-none">•</span> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings size={16} /> },
    { href: '/dashboard/settings', label: 'Profile', icon: <UserCircle size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/82 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2"><Logo /></Link>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/upgrade" className={`${plus ? 'btn-plus' : 'btn-ghost'} hidden rounded-full px-3 py-2 text-sm sm:inline-flex`}>
            <Sparkles size={15} /> {plus ? 'Plus' : 'Upgrade'}
          </Link>
          {llmReady !== null && <span title={llmReady ? 'AI live' : 'Template mode'} className={`hidden h-2.5 w-2.5 rounded-full sm:inline-block ${llmReady ? 'bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]' : 'bg-[#4aa8ff]/80'}`} />}
          {remaining !== null && <span className="hidden chip xl:inline-flex">{remaining === null ? '∞' : remaining} left</span>}
          <ThemeToggle />
          <button onClick={() => setOpen((v) => !v)} className="btn-ghost rounded-full px-3 py-2" aria-label="Open menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-5 shadow-[0_24px_70px_-50px_rgba(74,168,255,0.75)] backdrop-blur-2xl">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Signed in as</p>
              <p className="mt-2 break-all text-lg font-bold text-white" title={email || 'Profile'}>{email || 'Profile'}</p>

              <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-2">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Writing style</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setMode('personal')} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition ${mode === 'personal' ? 'bg-brand text-white shadow-glow' : 'bg-white/[0.04] text-white/65 hover:bg-white/10'}`}><Heart size={15} /> Personal</button>
                  <button type="button" onClick={() => setMode('professional')} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition ${mode === 'professional' ? 'bg-[#4aa8ff] text-white' : 'bg-white/[0.04] text-white/65 hover:bg-white/10'}`}><Briefcase size={15} /> Professional</button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-white/10 bg-white/[0.045] px-2 py-1"><LanguagePicker /></div>
                <button onClick={logout} className="btn-ghost rounded-full px-4 py-2.5"><LogOut size={16} /> Log out</button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Navigation</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((item) => (
                  <Link key={`${item.href}-${item.label}`} onClick={() => setOpen(false)} href={item.href} className={bulletItem}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[#9fd0ff]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                {role === 'admin' && (
                  <Link onClick={() => setOpen(false)} href="/admin" className={bulletItem}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[#9fd0ff]"><Shield size={16} /></span>
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </header>
  );
}
