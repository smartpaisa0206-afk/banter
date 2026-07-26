'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, LogOut, Trash2, UserCircle, Settings, ShieldCheck, Sparkles } from 'lucide-react';

interface Me {
  user: { id: string; email: string; role: string; status: string } | null;
  remaining: number | null;
  llmReady: boolean;
}

export function ProfileSettings() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setError('Could not load profile.'));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  async function deleteAccount() {
    if (confirm !== 'DELETE') return;
    setBusy(true);
    setError('');
    const res = await fetch('/api/account', { method: 'DELETE' });
    setBusy(false);
    if (res.ok) {
      router.push('/signup');
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Could not delete account.');
    }
  }

  const user = me?.user;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#4aa8ff]/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="chip mb-4"><Settings size={13} /> Account</p>
            <h1 className="text-4xl font-bold tracking-tight">Profile & settings</h1>
            <p className="mt-2 text-sm text-muted">Manage your Banter account, plan, privacy, and session.</p>
          </div>
          <Link href="/dashboard/upgrade" className="btn-plus rounded-full px-5 py-3">
            <Sparkles size={16} /> Upgrade to Plus
          </Link>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <section className="card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#4aa8ff]/15 text-[#9fd0ff]">
              <UserCircle size={26} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">User details</h2>
              <p className="text-sm text-muted">Your current logged-in account.</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Email</span>
              <span className="font-medium text-white">{user?.email || 'Loading…'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Plan</span>
              <span className="badge-plus">{user?.role === 'premium' ? 'Plus' : user?.role || 'Free'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-300"><ShieldCheck size={15} /> {user?.status || 'active'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Generations left today</span>
              <span className="font-medium text-white">{me ? me.remaining ?? 'Unlimited' : 'Loading…'}</span>
            </div>
          </div>

          <button onClick={logout} className="btn-ghost mt-5 rounded-full px-5">
            <LogOut size={16} /> Log out
          </button>
        </section>

        <section className="card border-red-400/20 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-400/10 text-red-200">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Danger zone</h2>
              <p className="text-sm text-muted">Delete your account and data.</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/75">
            This permanently deletes your account, sessions, saved messages, history, and keyboard tokens.
            Type <span className="font-semibold text-white">DELETE</span> to confirm.
          </p>
          <input
            className="input mt-4"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type DELETE"
          />
          {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
          <button
            onClick={deleteAccount}
            disabled={confirm !== 'DELETE' || busy}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} /> {busy ? 'Deleting…' : 'Delete account'}
          </button>
        </section>
      </div>
    </div>
  );
}
