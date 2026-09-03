import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { Footer } from '../components/Footer';
import { CursorEffects } from '../components/CursorEffects';
import {
  User, Shield, Keyboard, Moon, Sun, AlertTriangle, LogOut,
  Check, Smartphone, Crown,
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  { id: 'devices', label: 'Devices', icon: <Keyboard size={16} /> },
  { id: 'appearance', label: 'Appearance', icon: <Moon size={16} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="premium-shell flex min-h-screen flex-col">
      <CursorEffects />
      <AppHeader email="user@example.com" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#a78bfa]/20 text-[#a78bfa]">
              <User size={20} />
            </div>
            <h1 className="text-2xl font-black text-white">Settings</h1>
          </div>
          <p className="text-sm text-muted">Manage your account, devices, and preferences.</p>
        </motion.div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="shrink-0 lg:w-48"
          >
            <div className="premium-card p-2 space-y-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    activeTab === t.id
                      ? 'bg-[#7c5cff]/20 text-white shadow-[0_0_12px_-4px_rgba(124,92,255,0.5)]'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className={activeTab === t.id ? 'text-[#a78bfa]' : ''}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 space-y-4"
          >
            {activeTab === 'profile' && (
              <>
                <div className="premium-card p-6 space-y-5">
                  <h2 className="font-bold text-white">Account details</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff] shadow-glow">
                        <User size={28} className="text-white" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0b0b12] bg-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">user@example.com</p>
                      <span className="badge-plus">✦ Free plan</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Email address</label>
                      <input className="input" type="email" defaultValue="user@example.com" />
                    </div>
                    <div>
                      <label className="label">Plan</label>
                      <div className="input flex items-center gap-2 cursor-not-allowed opacity-70">
                        <Crown size={14} className="text-[#e9c46a]" /> Free · <a href="/dashboard/upgrade" className="text-[#4aa8ff] underline text-xs">Upgrade</a>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Generations today</label>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '60%' }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-[#7c5cff] to-[#4aa8ff]"
                          />
                        </div>
                        <span className="text-sm font-semibold text-white">3/5</span>
                      </div>
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/75">Active</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSave} className="btn btn-premium rounded-xl px-6 py-2.5 text-sm">
                    {saved ? <><Check size={15} /> Saved!</> : 'Save changes'}
                  </button>
                </div>

                {/* Danger zone */}
                <div className="premium-card border-red-500/20 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle size={18} />
                    <h2 className="font-bold">Danger zone</h2>
                  </div>
                  <p className="text-sm text-muted">This permanently deletes your account, sessions, saved messages, history, and keyboard tokens.</p>
                  <div>
                    <label className="label text-red-400/70">Type DELETE to confirm</label>
                    <input
                      className="input border-red-500/30 focus:border-red-500/60 focus:ring-red-500/20"
                      placeholder="DELETE"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                    />
                  </div>
                  <button
                    disabled={deleteConfirm !== 'DELETE'}
                    className="btn rounded-xl border border-red-500/30 bg-red-500/12 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <AlertTriangle size={15} /> Delete my account
                  </button>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <div className="premium-card p-6 space-y-5">
                <h2 className="font-bold text-white">Security settings</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Password', value: '••••••••', action: 'Change' },
                    { label: 'Two-factor auth', value: 'Not enabled', action: 'Enable' },
                    { label: 'Active sessions', value: '1 session', action: 'View all' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4"
                    >
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide">{item.label}</p>
                        <p className="font-medium text-white">{item.value}</p>
                      </div>
                      <button className="btn btn-ghost rounded-lg px-4 py-1.5 text-xs">{item.action}</button>
                    </motion.div>
                  ))}
                </div>
                <button className="btn rounded-xl border border-red-500/25 bg-red-500/8 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/15">
                  <LogOut size={15} /> Sign out all devices
                </button>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="premium-card p-6 space-y-5">
                <h2 className="font-bold text-white">Connected devices</h2>
                <p className="text-sm text-muted">Revoke any Android keyboard token you no longer trust.</p>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8 text-center">
                  <Smartphone size={28} className="mx-auto mb-3 text-muted" />
                  <p className="font-medium text-white">No keyboard devices</p>
                  <p className="mt-1 text-sm text-muted">Login from the Banter Android Keyboard app to connect one.</p>
                  <div className="mt-4">
                    <span className="badge-plus">Android keyboard — Phase 2</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#7c5cff]/25 bg-[#7c5cff]/8 p-4 text-sm text-[#c4b5fd]">
                  🔒 Banter Keyboard only sends your current text when you tap the Banter key. You can revoke access anytime from this page.
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="premium-card p-6 space-y-5">
                <h2 className="font-bold text-white">Appearance</h2>
                <div>
                  <p className="label">Theme</p>
                  <div className="flex gap-3">
                    {([
                      { id: 'dark', label: 'Dark', icon: <Moon size={16} /> },
                      { id: 'light', label: 'Light', icon: <Sun size={16} /> },
                    ] as const).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all ${
                          theme === t.id
                            ? 'border-[#7c5cff]/50 bg-[#7c5cff]/15 text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {t.icon} {t.label}
                        {theme === t.id && <Check size={14} className="text-[#a78bfa]" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label">Language</p>
                  <select className="input">
                    <option>English (US)</option>
                    <option>Hinglish</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
