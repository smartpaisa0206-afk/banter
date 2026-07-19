import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { savedMessages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { savedAccess } from '@/lib/plans';
import { SAVED_LIMIT } from '@/lib/config';
import { decryptText } from '@/lib/security';
import { SavedItem } from '@/components/SavedItem';

export const dynamic = 'force-dynamic';

export default async function Saved() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const acc = savedAccess(user.role);

  if (acc === 'none') {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Saved</h1>
        <div className="card p-6 text-center text-muted">
          Save is a Basic &amp; Premium feature.{' '}
          <Link href="/dashboard/upgrade" className="text-brand-soft underline">
            Upgrade
          </Link>
        </div>
      </div>
    );
  }

  let rows = await db
    .select()
    .from(savedMessages)
    .where(eq(savedMessages.userId, user.id))
    .orderBy(desc(savedMessages.createdAt));
  if (acc === 'limited') rows = rows.slice(0, SAVED_LIMIT);

  const items = rows.map((r) => ({
    id: r.id,
    title: r.title,
    content: decryptText(r.contentEnc),
    createdAt: r.createdAt,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Saved</h1>
      {items.length === 0 ? (
        <p className="text-muted">No saved messages yet.</p>
      ) : (
        items.map((it) => <SavedItem key={it.id} id={it.id} title={it.title} content={it.content} />)
      )}
    </div>
  );
}
