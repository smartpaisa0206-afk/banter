'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

const navLinks = [
  { to: '/keyboard', label: 'Keyboard' },
  { to: '/examples', label: 'Examples' },
  { to: '/methods', label: 'How it works' },
  { to: '/articles', label: 'Articles' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/support', label: 'Support' },
];

export function InfoPageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="premium-shell flex min-h-screen flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-white/8 bg-[#0b0b12]/90 backdrop-blur-2xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-white/65 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className="relative hover:text-white transition-colors group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#7c5cff] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <Link href="/dashboard" className="btn btn-plus rounded-full px-4 py-2.5 text-sm">
            <Sparkles size={14} />
            Open Banter
          </Link>
        </div>
      </motion.header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </motion.div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="aurora-card mb-10 p-8 sm:p-12"
        >
          <p className="kicker">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-5"
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
