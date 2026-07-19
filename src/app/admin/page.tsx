import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { getSetting } from '@/lib/settings';
import { AdminUsersTable } from '@/components/AdminUsersTable';
import { SettingsForm } from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  const rows = await db.select().from(users).orderBy(desc(users.createdAt));
  const usersData = rows.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
  }));
  const settings = {
    freeDailyLimit: await getSetting('free_daily_limit', '5'),
    maintenance: await getSetting('maintenance', 'false'),
    llmEnabled: await getSetting('llm_enabled', 'true'),
  };
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-3 text-2xl font-semibold">Users</h1>
        <AdminUsersTable users={usersData} />
      </section>
      <section>
        <h1 className="mb-3 text-2xl font-semibold">Settings</h1>
        <SettingsForm settings={settings} />
      </section>
    </div>
  );
}
