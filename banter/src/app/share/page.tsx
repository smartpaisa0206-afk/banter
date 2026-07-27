'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ShareTarget() {
  const router = useRouter();
  const [text, setText] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('text') || '';
    setText(t);
    if (t) localStorage.setItem('banter_share', t);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <Logo />
      <div className="card mt-8 w-full max-w-md space-y-5 p-6 text-center">
        <span className="chip mx-auto mb-2 inline-flex">
          <Sparkles size={12} /> Shared to Banter
        </span>
        <p className="text-sm text-muted">We&apos;ll drop this into your composer so you can rephrase it.</p>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-left text-sm whitespace-pre-wrap">
          {text || '—'}
        </div>
        <button onClick={() => router.push('/dashboard')} className="btn-premium w-full py-3">
          Open in Banter <ArrowRight size={16} />
        </button>
        <Link href="/dashboard" className="block text-xs text-muted hover:text-white">
          Cancel
        </Link>
      </div>
    </div>
  );
}
