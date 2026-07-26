'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { LanguagePicker } from './LanguagePicker';
import { LogOut, PenLine, History, Bookmark, Crown, MessageSquare, Shield, Gift } from 'lucide-react';

export function AppHeader() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [llmReady, setLlmReady] = useState<boolean | null>(null);
  const [trialing, setTrialing] = useState<boolean>(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(0);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setRole(d.user.role);
          setRemaining(d.remaining);
          setLlmReady(d.llmReady);
          setTrialing(!!d.trialing);
          setTrialDaysLeft(d.trialDaysLeft ?? 0);
        }
      })
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const premium = role === 'premium' || role === 'admin';

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 text-sm text-white/70 hover:text-white sm:inline-flex"
          >
            <PenLine size={16} /> Compose
          </Link>
          <Link
            href="/dashboard/history"
            className="hidden items-center gap-1.5 text-sm text-white/70 hover:text-white sm:inline-flex"
          >
            <History size={16} /> History
          </Link>
          <Link
            href="/dashboard/saved"
            className="hidden items-center gap-1.5 text-sm text-white/70 hover:text-white sm:inline-flex"
          >
            <Bookmark size={16} /> Saved
          </Link>
          <Link
            href="/dashboard/feedback"
            className="hidden items-center gap-1.5 text-sm text-white/70 hover:text-white sm:inline-flex"
          >
            <MessageSquare size={16} /> Feedback
          </Link>
          <Link
            href="/dashboard#refer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-gold to-yellow-300 px-3 py-2 text-sm font-semibold text-ink shadow-glow hover:brightness-105"
          >
            <Gift size={16} /> Refer
          </Link>
          <Link href="/dashboard/upgrade" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <Crown size={16} /> Upgrade
          </Link>
          {role === 'admin' && (
            <Link
              href="/admin"
              className="hidden items-center gap-1.5 text-sm text-white/70 hover:text-white sm:inline-flex"
            >
              <Shield size={16} /> Admin
            </Link>
          )}
          <LanguagePicker />
          {trialing && premium ? (
            <span
              className="badge-special animate-pulse-brand"
              title={`Premium trial — ${trialDaysLeft} day(s) left`}
            >
              ⚡ PREMIUM · {trialDaysLeft}d
            </span>
          ) : premium ? (
            <span className="badge-special">PREMIUM</span>
          ) : null}
          {llmReady !== null && (
            <span
              title={llmReady ? 'AI live' : 'Template mode (no AI key)'}
              className={`hidden h-2.5 w-2.5 rounded-full sm:inline-block ${
                llmReady ? 'bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]' : 'bg-gold/70'
              }`}
            />
          )}
          {remaining !== null && (
            <span className="hidden chip sm:inline-flex">{remaining === null ? '∞' : remaining} left</span>
          )}
          <button onClick={logout} className="btn-ghost px-3 py-2" aria-label="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
