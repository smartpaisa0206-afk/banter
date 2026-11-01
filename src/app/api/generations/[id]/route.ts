import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Delete one of the user's own past generations. Ownership is verified
// server-side: anything else (missing, or belongs to someone else) is a 404.
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const existing = await db.query.generations.findFirst({
    where: and(eq(generations.id, params.id), eq(generations.userId, user.id)),
    columns: { id: true },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(generations).where(eq(generations.id, params.id));
  return NextResponse.json({ ok: true });
}
