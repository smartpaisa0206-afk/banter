'use client';
import { useEffect, useState } from 'react';

type Item = {
  id: string;
  email: string | null;
  role: string | null;
  rating: number | null;
  message: string;
  createdAt: number;
};

export function AdminFeedbackTable() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch('/api/admin/feedbacks')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => setItems(d.feedback ?? []))
      .catch(() => setErr('Could not load feedback (admin only).'));
  }, []);

  if (err) return <p className="text-sm text-red-400">{err}</p>;
  if (items === null) return <p className="text-sm text-muted">Loading…</p>;
  if (!items.length) return <p className="text-sm text-muted">No feedback yet.</p>;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">{items.length} message{items.length === 1 ? '' : 's'}</p>
      {items.map((f) => (
        <div key={f.id} className="card p-4 text-sm">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium">{f.email || 'anonymous'}</span>
            <span className="text-xs text-muted">
              {f.rating ? `${f.rating}/5 ★` : 'no rating'} · {new Date(f.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-white/90">{f.message}</p>
        </div>
      ))}
    </div>
  );
}
