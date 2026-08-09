'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  LogOut,
  Trash2,
  UserCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Ban,
  RefreshCw,
} from 'lucide-react';

interface Me {
  user: { id: string; email: string; role: string; status: string } | null;
  remaining: number | null;
  llmReady: boolean;
}

interface MobileDevice {
  id: string;
  device: string | null;
  createdAt: number;
  expiresAt: number;
  lastUsedAt: number | null;
  revokedAt: number | null;
}

function fmt(ts?: number | null) {
  if (!ts) return 'Never';
  return new Date(ts).toLocaleString();
}

function planName(role?: string | null) {
  if (role === 'premium' || role === 'basic') return 'Plus';
  if (role === 'admin') return 'Admin';
  return 'Free';
}

export function ProfileSettings() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [devices, setDevices] = useState<MobileDevice[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadProfile() {
    setError('');
    try {
      const [meRes, devRes] = await Promise.all([fetch('/api/me'), fetch('/api/mobile/devices')]);
      if (meRes.ok) setMe(await meRes.json());
      if (devRes.ok) {
        const d = await devRes.json();
        setDevices(Array.isArray(d.devices) ? d.devices : []);
      }
    } catch {
      setError('Could not load profile.');
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  async function revokeDevice(id: string) {
    if (!window.confirm('Revoke this keyboard device? It will need to login again.')) return;
    setRevoking(id);
    const res = await fetch(`/api/mobile/devices/${id}`, { method: 'DELETE' });
    setRevoking(null);
    if (res.ok) {
      await loadProfile();
      router.refresh();
    } else {
      setError('Could not revoke device.');
    }
  }

  async function deleteAccount() {
    if (deleteConfirm !== 'DELETE') return;
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
  const activeDevices = devices.filter((d) => !d.revokedAt && d.expiresAt > Date.now());

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#4aa8ff]/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="chip mb-4"><Settings size={13} /> Account</p>
            <h1 className="text-4xl font-bold tracking-tight">Profile & settings</h1>
            <p className="mt-2 text-sm text-muted">Manage your Banter account, plan, keyboard devices, privacy, and session.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadProfile} className="btn-ghost rounded-full px-4 py-3">
              <RefreshCw size={16} /> Refresh
            </button>
            <Link href="/dashboard/upgrade" className="btn-plus rounded-full px-5 py-3">
              <Sparkles size={16} /> Upgrade to Plus
            </Link>
          </div>
        </div>
      </section>

      {error && <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

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
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Email</span>
              <span className="break-all font-medium text-white">{user?.email || 'Loading…'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Plan</span>
              <span className="badge-plus">{planName(user?.role)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-300"><ShieldCheck size={15} /> {user?.status || 'active'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Generations left today</span>
              <span className="font-medium text-white">{me ? me.remaining ?? 'Unlimited' : 'Loading…'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-muted">Active keyboard devices</span>
              <span className="font-medium text-white">{activeDevices.length}</span>
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
          <input className="input mt-4" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Type DELETE" />
          <button
            onClick={deleteAccount}
            disabled={deleteConfirm !== 'DELETE' || busy}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} /> {busy ? 'Deleting…' : 'Delete account'}
          </button>
        </section>
      </div>

      <section className="card p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/15 text-brand-soft">
              <Smartphone size={25} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Connected keyboard devices</h2>
              <p className="text-sm text-muted">Revoke any Android keyboard token you no longer trust.</p>
            </div>
          </div>
          <Link href="/methods" className="btn-ghost hidden rounded-full sm:inline-flex">How keyboard works</Link>
        </div>

        <div className="space-y-3">
          {devices.map((d) => {
            const revoked = !!d.revokedAt;
            const expired = d.expiresAt <= Date.now();
            return (
              <div key={d.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-white">{d.device || 'Android Keyboard'}</p>
                    {revoked ? <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-xs text-red-200">revoked</span> : expired ? <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">expired</span> : <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-200">active</span>}
                  </div>
                  <p className="mt-1 text-xs text-muted">Created: {fmt(d.createdAt)} · Last used: {fmt(d.lastUsedAt)} · Expires: {fmt(d.expiresAt)}</p>
                </div>
                <button
                  onClick={() => revokeDevice(d.id)}
                  disabled={revoked || revoking === d.id}
                  className="btn-ghost rounded-full px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Ban size={14} /> {revoking === d.id ? 'Revoking…' : revoked ? 'Revoked' : 'Revoke'}
                </button>
              </div>
            );
          })}
          {!devices.length && (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted">
              No keyboard devices yet. Login from the Banter Android Keyboard app to connect one.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-6">
        <h2 className="text-xl font-semibold">Privacy note</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Banter Keyboard only sends your current text when you tap the Banter key. You can revoke keyboard access anytime from this page.
        </p>
      </section>
    </div>
  );
}
