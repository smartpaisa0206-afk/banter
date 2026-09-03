import { BRAND_NAME } from '@/lib/config';
import { MessageCircleHeart } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 font-semibold ${className}`}>
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] text-white shadow-glow backdrop-blur-xl">
        <span className="absolute inset-0 bg-gradient-to-br from-brand via-brand-soft to-[#4aa8ff] opacity-95" />
        <MessageCircleHeart size={20} className="relative z-10" />
        <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/40 blur-md" />
      </span>
      <span className="text-xl font-black tracking-tight text-white">
        {BRAND_NAME}
      </span>
    </span>
  );
}
