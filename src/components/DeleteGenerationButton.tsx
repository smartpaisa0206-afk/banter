'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

// Two-click confirm delete for a history item. On success the card is
// removed locally and the server list refreshes.
export function DeleteGenerationButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gone, setGone] = useState(false);

  async function doDelete() {
    setBusy(true);
    try {
      const res = await fetch(`/api/generations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGone(true);
        router.refresh();
      } else {
        setConfirming(false);
      }
    } catch {
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  }

  if (gone) return null;

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        aria-label="Delete this generation"
        title="Delete"
        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-500/15 hover:text-red-300"
      >
        <Trash2 size={14} />
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <span className="text-xs text-muted">Delete?</span>
      <button
        onClick={doDelete}
        disabled={busy}
        className="rounded-lg bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/30 disabled:opacity-50"
      >
        {busy ? 'Deleting…' : 'Yes'}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={busy}
        className="rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:bg-white/10 hover:text-white"
      >
        Keep
      </button>
    </span>
  );
}
