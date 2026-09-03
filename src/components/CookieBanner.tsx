import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(localStorage.getItem('banter_cookies_ok') !== '1');
    } catch {
      setShow(false);
    }
  }, []);

  function accept() {
    try { localStorage.setItem('banter_cookies_ok', '1'); } catch {}
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring' as const, stiffness: 280, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-50 p-4"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-[1.75rem] border border-white/12 bg-[#0e0e18]/98 p-4 shadow-[0_-20px_80px_-20px_rgba(124,92,255,0.5)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#7c5cff]/20 text-[#a78bfa] mt-0.5">
                <Cookie size={16} />
              </div>
              <p className="text-sm text-white/75">
                Banter uses essential cookies for login and security — nothing creepy.{' '}
                <Link to="/cookies" className="text-[#9fd0ff] underline hover:text-white transition-colors">
                  Learn more
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={accept}
                className="btn btn-plus rounded-full px-5 py-2 text-sm"
              >
                Accept
              </button>
              <button
                onClick={accept}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
