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
import { Bookmark, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Saved() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const acc = savedAccess(user.role);

  if (acc === 'none') {
    return (
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
          <p className="chip mb-4"><Bookmark size={13} /> Saved</p>
          <h1 className="text-4xl font-black tracking-[-0.04em]">Save the replies worth keeping.</h1>
          <p className="mt-2 text-muted">Saved messages are available on Plus and Pro.</p>
        </section>
        <div className="rounded-[2rem] border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-7 text-center">
          <Sparkles className="mx-auto mb-3 text-[#9fd0ff]" />
          <h2 className="text-2xl font-bold text-white">Unlock saved messages</h2>
          <p className="mt-2 text-muted">Keep your best replies, captions, and work messages in one place.</p>
          <Link href="/dashboard/upgrade" className="btn-plus mt-5 rounded-full">Upgrade</Link>
        </div>
      </div>
    );
  }

  let rows = await db.select().from(savedMessages).where(eq(savedMessages.userId, user.id)).orderBy(desc(savedMessages.createdAt));
  if (acc === 'limited') rows = rows.slice(0, SAVED_LIMIT);

  const items = rows.map((r) => ({ id: r.id, title: r.title, content: decryptText(r.contentEnc), createdAt: r.createdAt }));

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
        <p className="chip mb-4"><Bookmark size={13} /> Saved</p>
        <h1 className="text-4xl font-black tracking-[-0.04em]">Your best lines, saved.</h1>
        <p className="mt-2 text-muted">Messages you save from Banter appear here for quick reuse.</p>
      </section>
      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center text-muted">No saved messages yet. Generate a reply, then tap Save.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">{items.map((it) => <SavedItem key={it.id} id={it.id} title={it.title} content={it.content} />)}</div>
      )}
    </div>
  );
}
