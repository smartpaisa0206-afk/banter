'use client';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const links = [
  { to: '/introduction', label: 'Introduction' },
  { to: '/examples', label: 'Examples' },
  { to: '/methods', label: 'How to use' },
  { to: '/keyboard', label: 'Keyboard beta' },
  { to: '/articles', label: 'Articles' },
  { to: '/support', label: 'Support' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/cookies', label: 'Cookies' },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/8 py-12">
      {/* Glow top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c5cff]/40 to-transparent" />
      
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Logo className="scale-110" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-muted text-center max-w-md"
        >
          Say the right thing to the right person. A relationship-aware message assistant built for real conversations.
        </motion.p>

        {/* Nav links */}
        <motion.nav
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className="text-xs text-muted hover:text-white transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </motion.nav>

        {/* Divider */}
        <div className="divider w-full max-w-xs" />

        {/* Bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-1.5 text-xs text-white/40"
        >
          Designed & built with <Heart size={11} className="text-[#7c5cff] fill-[#7c5cff]" /> by HONEY · HNY Labs · 2026
        </motion.p>
      </div>
    </footer>
  );
}
