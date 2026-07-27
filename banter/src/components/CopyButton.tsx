'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`btn-ghost px-3 py-1.5 text-xs ${className}`}
    >
      {copied ? (
        <>
          <Check size={14} /> Copied
        </>
      ) : (
        <>
          <Copy size={14} /> Copy
        </>
      )}
    </button>
  );
}
