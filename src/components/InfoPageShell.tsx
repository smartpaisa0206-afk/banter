'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

export function InfoPageShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="premium-shell flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07070f]/82 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link href="/" className="transition-transform duration-200 hover:scale-105"><Logo className="scale-105" /></Link>
          <nav className="hidden items-center gap-5 text-sm text-white/65 md:flex">
            {[['/keyboard','Keyboard'],['/examples','Examples'],['/methods','How it works'],['/articles','Articles'],['/privacy','Privacy'],['/support','Support']].map(([href, label]) => (
              <Link key={href} href={href} className="transition-colors duration-200 hover:text-white">{label}</Link>
            ))}
          </nav>
          <Link href="/dashboard" className="btn-premium rounded-full px-5 py-2.5 text-sm">Open Banter <ArrowRight size={14} /></Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-16">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="premium-card mb-10 p-8 sm:p-12">
          <p className="kicker">{eyebrow}</p>
          <h1 className="headline-balance mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="space-y-6">{children}</motion.div>
      </main>
      <Footer />
    </div>
  );
}
