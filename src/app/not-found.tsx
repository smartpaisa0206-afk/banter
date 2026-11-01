import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ArrowRight, Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 text-center">
      <div className="orb pointer-events-none -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 bg-[#7c5cff]/15" />

      <div className="relative z-10">
        <Link href="/" className="mb-8 inline-block">
          <Logo className="scale-125" />
        </Link>

        <div className="animate-float mb-6 text-8xl font-black gradient-text">
          404
        </div>

        <h1 className="mb-3 text-2xl font-black text-white">Hmm, that page doesn&apos;t exist.</h1>
        <p className="mx-auto mb-8 max-w-sm text-muted">
          Maybe Banter can help you find the right words for how you&apos;re feeling right now.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="btn btn-premium rounded-full px-6 py-3">
            <Home size={16} /> Go home
          </Link>
          <Link href="/dashboard" className="btn btn-ghost rounded-full px-6 py-3">
            Open Banter <ArrowRight size={16} />
          </Link>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Sparkles size={12} className="text-[#a78bfa]" />
          Say the right thing to the right person.
        </p>
      </div>
    </div>
  );
}
