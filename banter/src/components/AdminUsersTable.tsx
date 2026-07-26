'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Ban, Trash2 } from 'lucide-react';

export function AdminUsersTable({
  users,
}: {
  users: { id: string; email: string; role: string; status: string; createdAt: number }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function patch(id: string, patchData: Record<string, string>) {
    setBusy(id);
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patchData }),
    });
    setBusy(null);
    router.refresh();
  }
  async function del(id: string) {
    if (!confirm('Delete this user?')) return;
    setBusy(id);
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="p-3">Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-white/10">
              <td className="p-3">{u.email}</td>
              <td>
                <select
                  value={u.role}
                  disabled={busy === u.id}
                  onChange={(e) => patch(u.id, { role: e.target.value })}
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs"
                >
                  {['free', 'basic', 'premium', 'admin'].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td>{u.status}</td>
              <td className="text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="flex gap-1">
                <button
                  onClick={() => patch(u.id, { status: u.status === 'banned' ? 'active' : 'banned' })}
                  className="btn-ghost px-2 py-1.5 text-xs"
                  disabled={busy === u.id}
                  aria-label="Toggle ban"
                >
                  <Ban size={14} />
                </button>
                <button
                  onClick={() => del(u.id)}
                  className="btn-ghost px-2 py-1.5 text-xs"
                  disabled={busy === u.id}
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
