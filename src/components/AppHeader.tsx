import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import {
  Menu, X, ChevronDown, Sparkles, User, History, Bookmark,
  MessageSquare, Keyboard, BookOpen, Newspaper, HelpCircle,
  CreditCard, Settings, LogOut, LayoutDashboard,
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Compose', icon: <Sparkles size={15} /> },
  { to: '/dashboard/history', label: 'History', icon: <History size={15} /> },
  { to: '/dashboard/saved', label: 'Saved', icon: <Bookmark size={15} /> },
  { to: '/dashboard/feedback', label: 'Feedback', icon: <MessageSquare size={15} /> },
];

const toolLinks = [
  { to: '/keyboard', label: 'Keyboard beta', icon: <Keyboard size={15} /> },
  { to: '/examples', label: 'Examples', icon: <BookOpen size={15} /> },
  { to: '/articles', label: 'Articles', icon: <Newspaper size={15} /> },
  { to: '/support', label: 'Support', icon: <HelpCircle size={15} /> },
];

export function AppHeader({ email = 'user@example.com', role = 'free' }: { email?: string; role?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-white/8 bg-[#0b0b12]/90 backdrop-blur-2xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(l.to)
                    ? 'bg-[#7c5cff]/20 text-white shadow-[0_0_15px_-5px_rgba(124,92,255,0.6)]'
                    : 'text-white/65 hover:bg-white/8 hover:text-white'
                }`}
              >
                {l.icon}
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/upgrade"
              className="hidden items-center gap-1.5 rounded-full border border-[#e9c46a]/40 bg-[#e9c46a]/10 px-3.5 py-1.5 text-xs font-bold text-[#e9c46a] transition-all hover:bg-[#e9c46a]/20 sm:flex"
            >
              <Sparkles size={12} />
              Upgrade
            </Link>

            {/* Profile dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff]">
                  <User size={12} className="text-white" />
                </div>
                <span className="max-w-[120px] truncate text-xs">{email.split('@')[0]}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/12 bg-[#0e0e18] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="border-b border-white/8 px-4 py-3">
                      <p className="text-xs font-semibold text-white/90 truncate">{email}</p>
                      <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        role === 'premium' ? 'badge-gold' : 'badge-plus'
                      }`}>
                        {role === 'premium' ? '⭐ Premium' : '✦ Free'}
                      </span>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      {[
                        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
                        { to: '/dashboard/upgrade', label: 'Upgrade Plan', icon: <CreditCard size={14} /> },
                        { to: '/dashboard/settings', label: 'Settings', icon: <Settings size={14} /> },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/8 hover:text-white"
                        >
                          <span className="text-[#a78bfa]">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                      <div className="my-1 divider" />
                      <Link
                        to="/login"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <LogOut size={14} />
                        Sign out
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/12 md:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-[57px] z-40 overflow-hidden border-b border-white/8 bg-[#0b0b12]/95 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-4">
              {/* User info */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff]">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[200px]">{email}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                    role === 'premium' ? 'text-[#e9c46a]' : 'text-[#9fd0ff]'
                  }`}>
                    {role === 'premium' ? '⭐ Premium' : '✦ Free plan'}
                  </span>
                </div>
              </div>

              {/* Nav sections */}
              <div className="grid grid-cols-2 gap-2">
                {[...navLinks, ...toolLinks.slice(0, 2)].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium transition-colors ${
                      isActive(l.to)
                        ? 'bg-[#7c5cff]/20 text-white'
                        : 'border border-white/8 bg-white/[0.03] text-white/70 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <span className="text-[#a78bfa]">{l.icon}</span>
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="flex gap-2">
                <Link
                  to="/dashboard/upgrade"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-gold flex-1 rounded-full py-2.5 text-sm"
                >
                  <Sparkles size={14} /> Upgrade
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost flex-1 rounded-full py-2.5 text-sm"
                >
                  <Settings size={14} /> Settings
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
