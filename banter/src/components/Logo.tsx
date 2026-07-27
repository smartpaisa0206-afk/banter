import { BRAND_NAME } from '@/lib/config';
import { MessageCircleHeart } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] text-white shadow-glow backdrop-blur-xl">
        <span className="absolute inset-0 bg-gradient-to-br from-brand via-brand-soft to-gold opacity-90" />
        <MessageCircleHeart size={19} className="relative z-10" />
        <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/35 blur-md" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        <span className="gradient-text">{BRAND_NAME}</span>
      </span>
    </span>
  );
}
