import { BRAND_NAME } from '@/lib/config';
import { MessageCircle } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white shadow-glow">
        <MessageCircle size={18} />
      </span>
      <span className="text-lg tracking-tight">{BRAND_NAME}</span>
    </span>
  );
}
