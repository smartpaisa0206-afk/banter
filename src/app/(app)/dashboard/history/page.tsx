import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generations } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { historyAccess } from '@/lib/plans';
import { HISTORY_LIMIT } from '@/lib/config';
import { decryptText } from '@/lib/security';
import { CopyButton } from '@/components/CopyButton';
import { Crown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function History() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const acc = historyAccess(user.role);

  if (acc === 'none') {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">History</h1>
        <div className="card p-6 text-center text-muted">
          History is a Basic &amp; Premium feature.{' '}
          <Link href="/dashboard/upgrade" className="text-brand-soft underline">
            Upgrade
          </Link>
        </div>
      </div>
    );
  }

  let rows = await db
    .select()
    .from(generations)
    .where(eq(generations.userId, user.id))
    .orderBy(desc(generations.createdAt));
  if (acc === 'limited') rows = rows.slice(0, HISTORY_LIMIT);

  const items = rows.map((r) => {
    let parsed: any = null;
    try {
      parsed = JSON.parse(decryptText(r.resultEnc));
    } catch {
      parsed = null;
    }
    return { ...r, parsed };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">History</h1>
      {items.length === 0 ? (
        <p className="text-muted">Nothing yet — your generated messages will appear here.</p>
      ) : (
        items.map((it) => {
          const p = it.parsed;
          const variants: string[] = p?.variants && Array.isArray(p.variants) ? p.variants : [];
          return (
            <div key={it.id} className="card space-y-2 p-4">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>
                  {it.relationship} · {it.intent} · {it.tone} · {it.language}
                </span>
                <span>{new Date(it.createdAt).toLocaleString()}</span>
              </div>
              {p?.format === 'email' && p.subject ? (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-black/20 p-3 text-sm">
                    <p>
                      <span className="text-muted">Subject: </span>
                      {p.subject}
                    </p>
                    <CopyButton text={`Subject: ${p.subject}\n\n${p.body ?? ''}`} />
                  </div>
                  <div className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-black/20 p-3 text-sm">
                    <p className="whitespace-pre-wrap">{p.body}</p>
                  </div>
                </div>
              ) : p?.format === 'notice' && p.statement ? (
                <div className="flex items-start justify-between gap-2 rounded-lg border border-gold/25 bg-gold/5 p-3 text-sm">
                  <p className="whitespace-pre-wrap">{p.statement}</p>
                  <CopyButton text={p.statement} />
                </div>
              ) : (
                variants.map((v: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-black/20 p-3 text-sm"
                  >
                    <p className="whitespace-pre-wrap">{v}</p>
                    <CopyButton text={v} />
                  </div>
                ))
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
