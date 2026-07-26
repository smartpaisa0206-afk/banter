import { BRAND_NAME } from '@/lib/config';

// Refined brand mark: a speech bubble (conversation) with a spark of "magic",
// rendered in the Banter purple -> gold gradient. Inline so it needs no icon lib.
function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bmark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#e9c46a" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#bmark)" />
      {/* chat bubble */}
      <path
        d="M9 8 h14 a3 3 0 0 1 3 3 v6 a3 3 0 0 1 -3 3 h-7 l-4 3.4 v-3.4 h-1 a3 3 0 0 1 -3 -3 v-6 a3 3 0 0 1 3 -3 z"
        fill="#0b0b12"
      />
      {/* typing dots */}
      <circle cx="13" cy="14" r="1.6" fill="#e9c46a" />
      <circle cx="17.5" cy="14" r="1.6" fill="#fff" />
      <circle cx="22" cy="14" r="1.6" fill="#fff" />
      {/* spark */}
      <path
        d="M23 4 l1.4 3.2 3.2 1.4 -3.2 1.4 -1.4 3.2 -1.4 -3.2 -3.2 -1.4 3.2 -1.4 z"
        fill="#fff"
        opacity="0.95"
      />
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${className}`}>
      <Mark />
      <span className="text-lg tracking-tight">{BRAND_NAME}</span>
    </span>
  );
}
