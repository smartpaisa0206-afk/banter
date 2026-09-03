'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BRAND_NAME } from '@/lib/config';
import { Heart } from 'lucide-react';

const links = [
  { href: '/introduction', label: 'Introduction' },
  { href: '/examples', label: 'Examples' },
  { href: '/methods', label: 'How to use' },
  { href: '/keyboard', label: 'Keyboard beta' },
  { href: '/articles', label: 'Articles' },
  { href: '/support', label: 'Support' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/cookies', label: 'Cookies' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 py-14 text-center text-xs text-muted">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-[#7c5cff]/8 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-5 px-5">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <img src="/hny-labs-logo.png" alt="HNY Labs"
            className="h-12 w-auto rounded-xl bg-white/90 px-3 py-1 shadow-[0_8px_30px_-8px_rgba(124,92,255,0.4)] transition-transform duration-300 hover:scale-105"
          />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }} className="text-sm font-medium text-white/60">
          {BRAND_NAME} · Say the right thing to the right person.
        </motion.p>
        <motion.nav initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors duration-200 hover:text-white hover:underline decoration-[#a78bfa]/50 underline-offset-3">
              {l.label}
            </Link>
          ))}
        </motion.nav>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="divider w-full" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25, duration: 0.5 }} className="flex items-center gap-1.5 font-semibold text-white/55">
          Made with <Heart size={12} className="text-[#f472b6]" fill="#f472b6" /> by HONEY · HNY Labs
        </motion.p>
      </div>
    </footer>
  );
}
