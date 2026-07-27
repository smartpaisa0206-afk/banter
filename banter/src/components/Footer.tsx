import { BRAND_NAME } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-xs text-muted">
      <p>
        {BRAND_NAME} · Say the right thing to the right person. · Made for real conversations, not games.
      </p>
    </footer>
  );
}
