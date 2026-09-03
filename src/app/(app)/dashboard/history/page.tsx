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
import { History as HistoryIcon, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function History() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const acc = historyAccess(user.role);

  if (acc === 'none') {
    return (
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
          <p className="chip mb-4"><HistoryIcon size={13} /> History</p>
          <h1 className="text-4xl font-black tracking-[-0.04em]">Never lose a good reply again.</h1>
          <p className="mt-2 text-muted">History saves your generated messages when you upgrade.</p>
        </section>
        <div className="rounded-[2rem] border border-[#4aa8ff]/30 bg-[#4aa8ff]/10 p-7 text-center">
          <Sparkles className="mx-auto mb-3 text-[#9fd0ff]" />
          <h2 className="text-2xl font-bold text-white">Unlock message history</h2>
          <p className="mt-2 text-muted">Keep the replies you may need again later.</p>
          <Link href="/dashboard/upgrade" className="btn-plus mt-5 rounded-full">Upgrade</Link>
        </div>
      </div>
    );
  }

  let rows = await db.select().from(generations).where(eq(generations.userId, user.id)).orderBy(desc(generations.createdAt));
  if (acc === 'limited') rows = rows.slice(0, HISTORY_LIMIT);

  const items = rows.map((r) => {
    let parsed: any = null;
    try { parsed = JSON.parse(decryptText(r.resultEnc)); } catch { parsed = null; }
    return { ...r, parsed };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
        <p className="chip mb-4"><HistoryIcon size={13} /> History</p>
        <h1 className="text-4xl font-black tracking-[-0.04em]">Your past saves, ready again.</h1>
        <p className="mt-2 text-muted">Copy an old reply, reuse a work mail, or learn what worked.</p>
      </section>
      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center text-muted">Nothing yet — generate your first message and it will appear here.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => {
            const p = it.parsed;
            const variants: string[] = p?.variants && Array.isArray(p.variants) ? p.variants : [];
            return (
              <div key={it.id} className="card space-y-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                  <span className="chip">{it.relationship} · {it.intent} · {it.tone} · {it.language}</span>
                  <span>{new Date(it.createdAt).toLocaleString()}</span>
                </div>
                {p?.format === 'email' && p.subject ? (
                  <div className="space-y-2">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm"><span className="text-muted">Subject: </span>{p.subject}</div>
                    <div className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm"><p className="whitespace-pre-wrap">{p.body}</p><CopyButton text={`Subject: ${p.subject}\n\n${p.body ?? ''}`} /></div>
                  </div>
                ) : p?.format === 'notice' && p.statement ? (
                  <div className="flex items-start justify-between gap-2 rounded-xl border border-gold/25 bg-gold/5 p-3 text-sm"><p className="whitespace-pre-wrap">{p.statement}</p><CopyButton text={p.statement} /></div>
                ) : (
                  variants.map((v: string, idx: number) => (
                    <div key={idx} className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm"><p className="whitespace-pre-wrap">{v}</p><CopyButton text={v} /></div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
