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
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-ink/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/"><Logo /></Link>
          <nav className="hidden items-center gap-5 text-sm text-white/70 md:flex">
            <Link href="/introduction" className="hover:text-white">Introduction</Link>
            <Link href="/examples" className="hover:text-white">Examples</Link>
            <Link href="/methods" className="hover:text-white">How to use</Link>
            <Link href="/articles" className="hover:text-white">Articles</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </nav>
          <Link href="/signup" className="btn-plus rounded-full">Start free</Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-16">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-[#9fd0ff]">{eyebrow}</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        <div className="mt-10 space-y-6">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
