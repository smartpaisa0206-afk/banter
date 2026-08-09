'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Ban, ShieldAlert } from 'lucide-react';

export function AdminSecurityTable({
  events,
}: {
  events: {
    id: string;
    userId: string | null;
    email: string | null;
    eventType: string;
    source: string;
    ipHash: string | null;
    country: string | null;
    success: boolean;
    severity: string;
    userAgent: string | null;
    createdAt: number;
  }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function ban(userId: string) {
    if (!confirm('Ban this user?')) return;
    setBusy(userId);
    await fetch(`/api/security/user/${userId}/ban`, { method: 'POST' });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="p-3">Time</th>
            <th>Event</th>
            <th>User</th>
            <th>Source</th>
            <th>IP hash</th>
            <th>Country</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-t border-white/10 align-top">
              <td className="p-3 text-xs text-muted">{new Date(e.createdAt).toLocaleString()}</td>
              <td>
                <div className="font-medium">{e.eventType}</div>
                <div className="max-w-xs truncate text-xs text-muted" title={e.userAgent || ''}>{e.userAgent || '—'}</div>
              </td>
              <td className="text-xs">{e.email || e.userId || 'anonymous'}</td>
              <td>{e.source}</td>
              <td className="font-mono text-xs">{e.ipHash || '—'}</td>
              <td>{e.country || '—'}</td>
              <td>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${e.success ? 'bg-emerald-400/10 text-emerald-200' : e.severity === 'critical' ? 'bg-red-400/10 text-red-200' : 'bg-gold/10 text-gold'}`}>
                  <ShieldAlert size={12} /> {e.success ? 'ok' : e.severity}
                </span>
              </td>
              <td>
                {e.userId && (
                  <button onClick={() => ban(e.userId!)} disabled={busy === e.userId} className="btn-ghost px-2 py-1.5 text-xs">
                    <Ban size={14} /> Ban
                  </button>
                )}
              </td>
            </tr>
          ))}
          {!events.length && (
            <tr><td className="p-4 text-muted" colSpan={8}>No security events yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
