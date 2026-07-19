import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { savedMessages } from '@/lib/db/schema';
import { savedAccess } from '@/lib/plans';
import { SAVED_LIMIT } from '@/lib/config';
import { encryptText, decryptText } from '@/lib/security';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const acc = savedAccess(user.role);
  if (acc === 'none') return NextResponse.json({ error: 'Upgrade to save messages.' }, { status: 403 });

  const rows = await db
    .select()
    .from(savedMessages)
    .where(eq(savedMessages.userId, user.id))
    .orderBy(desc(savedMessages.createdAt));
  const limited = acc === 'limited' ? rows.slice(0, SAVED_LIMIT) : rows;
  const items = limited.map((r) => ({
    id: r.id,
    title: r.title,
    content: decryptText(r.contentEnc),
    createdAt: r.createdAt,
  }));
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const acc = savedAccess(user.role);
  if (acc === 'none') return NextResponse.json({ error: 'Upgrade to save messages.' }, { status: 403 });
  if (acc === 'limited') {
    const c = await db.select({ id: savedMessages.id }).from(savedMessages).where(eq(savedMessages.userId, user.id));
    if (c.length >= SAVED_LIMIT) return NextResponse.json({ error: 'Saved limit reached on Basic.' }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = z
    .object({ title: z.string().max(120).optional(), content: z.string().min(1).max(8000) })
    .safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const [row] = await db
    .insert(savedMessages)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      title: parsed.data.title || null,
      contentEnc: encryptText(parsed.data.content),
      createdAt: Date.now(),
    })
    .returning({ id: savedMessages.id });
  return NextResponse.json({ id: row.id, ok: true });
}
