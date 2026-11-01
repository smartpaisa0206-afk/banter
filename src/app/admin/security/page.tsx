import { redirect } from 'next/navigation';
import { desc, inArray } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { securityEvents, users } from '@/lib/db/schema';
import { AdminSecurityTable } from '@/components/AdminSecurityTable';

export const dynamic = 'force-dynamic';

export default async function AdminSecurityPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== 'admin') redirect('/dashboard');

  const rows = await db.select().from(securityEvents).orderBy(desc(securityEvents.createdAt)).limit(200);
  const userIds = Array.from(new Set(rows.map((r) => r.userId).filter(Boolean))) as string[];
  const userRows = userIds.length ? await db.select({ id: users.id, email: users.email }).from(users).where(inArray(users.id, userIds)) : [];
  const emailById = new Map(userRows.map((u) => [u.id, u.email]));

  const events = rows.map((e) => ({
    id: e.id,
    userId: e.userId,
    email: e.userId ? emailById.get(e.userId) || null : null,
    eventType: e.eventType,
    source: e.source,
    ipHash: e.ipHash,
    country: e.country,
    success: e.success,
    severity: e.severity,
    userAgent: e.userAgent,
    createdAt: e.createdAt,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Security events</h1>
        <p className="mt-1 text-sm text-muted">Defensive logs for login, keyboard, generation, and admin actions. IPs are hashed, not raw.</p>
      </div>
      <AdminSecurityTable events={events} />
    </div>
  );
}
