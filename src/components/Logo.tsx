import { MessageCircleHeart } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-black tracking-tight text-white ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff] shadow-glow">
        <MessageCircleHeart size={16} className="text-white" />
      </span>
      <span className="gradient-text text-xl">Banter</span>
    </span>
  );
}
