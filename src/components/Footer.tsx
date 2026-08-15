import Link from 'next/link';
import { BRAND_NAME } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-center text-xs text-muted">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5">
        <img src="/hny-labs-logo.png" alt="HNY Labs" className="h-12 w-auto rounded-lg bg-white px-3 py-1" />
        <p>
          {BRAND_NAME} · Say the right thing to the right person. · A product by HNY Labs.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/introduction" className="hover:text-white">Introduction</Link>
          <Link href="/examples" className="hover:text-white">Examples</Link>
          <Link href="/methods" className="hover:text-white">How to use</Link>
          <Link href="/keyboard" className="hover:text-white">Keyboard beta</Link>
          <Link href="/articles" className="hover:text-white">Articles</Link>
          <Link href="/support" className="hover:text-white">Support</Link>
          <Link href="/cookies" className="hover:text-white">Cookies</Link>
        </nav>
        <p className="font-semibold text-white/70">Designed & built by HONEY · HNY Labs</p>
      </div>
    </footer>
  );
}
