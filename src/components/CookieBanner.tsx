'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(localStorage.getItem('banter_cookies_ok') !== '1');
    } catch {
      setShow(false);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-3xl border border-white/10 bg-ink/95 p-4 text-sm text-white/78 shadow-[0_30px_90px_-45px_rgba(74,168,255,0.9)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
        <p>
          Banter uses essential cookies for login and security. No complicated tracking needed during testing.{' '}
          <Link href="/cookies" className="text-[#9fd0ff] hover:text-white">Learn more</Link>
        </p>
        <button
          onClick={() => {
            try { localStorage.setItem('banter_cookies_ok', '1'); } catch {}
            setShow(false);
          }}
          className="btn-plus shrink-0 rounded-full px-5"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
