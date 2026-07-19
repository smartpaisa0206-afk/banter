'use client';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function SavedItem({ id, title, content }: { id: string; title: string | null; content: string }) {
  const router = useRouter();
  async function del() {
    if (!confirm('Delete this saved message?')) return;
    await fetch(`/api/saved/${id}`, { method: 'DELETE' });
    router.refresh();
  }
  return (
    <div className="card space-y-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="whitespace-pre-wrap text-sm">{content}</p>
        <button onClick={del} className="btn-ghost px-2 py-1.5 text-xs" aria-label="Delete">
          <Trash2 size={14} />
        </button>
      </div>
      {title && <p className="text-xs text-muted">{title}</p>}
    </div>
  );
}
