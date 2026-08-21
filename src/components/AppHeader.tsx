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
  Grid3X3,
  Sparkles,
  Menu,
  X,
  Keyboard,
  FileText,
  HelpCircle,
} from 'lucide-react';

export function AppHeader() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [llmReady, setLlmReady] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

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
  const item = 'flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-medium text-white/82 transition hover:bg-white/10 hover:text-white';
  const sectionTitle = 'mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.22em] text-muted';

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/82 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/upgrade" className={`${plus ? 'btn-plus' : 'btn-ghost'} hidden rounded-full px-3 py-2 text-sm sm:inline-flex`}>
            <Sparkles size={15} /> {plus ? 'Plus' : 'Upgrade'}
          </Link>
          {llmReady !== null && (
            <span
              title={llmReady ? 'AI live' : 'Template mode'}
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
        <div className="border-t border-white/10 bg-ink/95 px-4 py-5 shadow-[0_24px_70px_-50px_rgba(74,168,255,0.75)] backdrop-blur-2xl">
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Signed in as</p>
              <p className="mt-2 break-all text-lg font-bold text-white" title={email || 'Profile'}>{email || 'Profile'}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-white/10 bg-white/[0.045] px-2 py-1"><LanguagePicker /></div>
                <button onClick={logout} className="btn-ghost rounded-full px-4 py-2.5"><LogOut size={16} /> Log out</button>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Profile, plan, keyboard devices, and privacy controls are inside Settings.
              </p>
            </section>

            <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:grid-cols-2">
              <div>
                <p className={sectionTitle}>Main</p>
                <div className="space-y-2">
                  <Link onClick={() => setOpen(false)} href="/dashboard" className={item}><PenLine size={16} className="text-[#9fd0ff]" /> Compose</Link>
                  <Link onClick={() => setOpen(false)} href="/dashboard/history" className={item}><History size={16} className="text-[#9fd0ff]" /> History</Link>
                  <Link onClick={() => setOpen(false)} href="/dashboard/saved" className={item}><Bookmark size={16} className="text-[#9fd0ff]" /> Saved</Link>
                  <Link onClick={() => setOpen(false)} href="/dashboard/feedback" className={item}><MessageSquare size={16} className="text-[#9fd0ff]" /> Feedback</Link>
                </div>
              </div>

              <div>
                <p className={sectionTitle}>Tools</p>
                <div className="space-y-2">
                  <Link onClick={() => setOpen(false)} href="/keyboard" className={item}><Keyboard size={16} className="text-[#9fd0ff]" /> Keyboard beta</Link>
                  <Link onClick={() => setOpen(false)} href="/examples" className={item}><Grid3X3 size={16} className="text-[#9fd0ff]" /> Examples</Link>
                  <Link onClick={() => setOpen(false)} href="/articles" className={item}><FileText size={16} className="text-[#9fd0ff]" /> Articles</Link>
                  <Link onClick={() => setOpen(false)} href="/support" className={item}><HelpCircle size={16} className="text-[#9fd0ff]" /> Support</Link>
                </div>
              </div>

              <div>
                <p className={sectionTitle}>Account</p>
                <div className="space-y-2">
                  <Link onClick={() => setOpen(false)} href="/dashboard/upgrade" className={item}><Sparkles size={16} className="text-[#9fd0ff]" /> Pricing / Upgrade</Link>
                  <Link onClick={() => setOpen(false)} href="/dashboard/settings" className={item}><Settings size={16} className="text-[#9fd0ff]" /> Settings & Profile</Link>
                </div>
              </div>

              {role === 'admin' && (
                <div>
                  <p className={sectionTitle}>Admin</p>
                  <div className="space-y-2">
                    <Link onClick={() => setOpen(false)} href="/admin" className={item}><Shield size={16} className="text-[#9fd0ff]" /> Admin panel</Link>
                    <Link onClick={() => setOpen(false)} href="/admin/security" className={item}><Shield size={16} className="text-[#9fd0ff]" /> Security events</Link>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </header>
  );
}
