'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { try { setShow(localStorage.getItem('banter_cookies_ok') !== '1'); } catch { setShow(false); } }, []);
  function accept() { try { localStorage.setItem('banter_cookies_ok', '1'); } catch {} setShow(false); }
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }} className="fixed inset-x-0 bottom-0 z-50 p-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-3xl border border-white/12 bg-[#0d0d1a]/96 p-5 text-sm text-white/80 shadow-[0_-20px_80px_-30px_rgba(74,168,255,0.6)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#4aa8ff]/15 text-[#9fd0ff]"><Cookie size={17} /></div>
              <p className="text-sm leading-relaxed">Banter uses essential cookies for login and security. No complicated tracking during testing.{' '}
                <Link href="/cookies" className="font-medium text-[#9fd0ff] underline underline-offset-2 hover:text-white transition-colors">Learn more</Link>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} onClick={accept} className="btn-plus rounded-full px-6 py-2.5 text-sm">Accept</motion.button>
              <motion.button whileTap={{ scale: 0.94 }} onClick={accept} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white transition-colors"><X size={15} /></motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
