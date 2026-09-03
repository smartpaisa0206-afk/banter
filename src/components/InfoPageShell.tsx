import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';

export function InfoPageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="premium-shell flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/"><Logo className="scale-105" /></Link>
          <nav className="hidden items-center gap-5 text-sm text-white/70 md:flex">
            <Link href="/keyboard" className="hover:text-white">Keyboard</Link>
            <Link href="/examples" className="hover:text-white">Examples</Link>
            <Link href="/methods" className="hover:text-white">How it works</Link>
            <Link href="/articles" className="hover:text-white">Articles</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </nav>
          <Link href="/dashboard" className="btn-plus rounded-full px-4 py-2.5">Open Banter</Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-16">
        <div className="premium-card rounded-[2.25rem] p-7 sm:p-10">
          <p className="kicker">{eyebrow}</p>
          <h1 className="headline-balance mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        </div>
        <div className="mt-10 space-y-6">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
