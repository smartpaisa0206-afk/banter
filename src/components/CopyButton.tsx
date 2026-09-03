'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.button whileTap={{ scale: 0.94 }} whileHover={{ y: -1 }}
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      className={`btn-ghost relative overflow-hidden px-3.5 py-1.5 text-xs ${className}`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="copied" initial={{ opacity: 0, scale: 0.8, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -4 }} transition={{ duration: 0.2 }} className="flex items-center gap-1.5 text-emerald-400">
            <Check size={13} /> Copied!
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ opacity: 0, scale: 0.8, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -4 }} transition={{ duration: 0.2 }} className="flex items-center gap-1.5">
            <Copy size={13} /> Copy
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
