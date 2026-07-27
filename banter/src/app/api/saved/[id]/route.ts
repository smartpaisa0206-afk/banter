import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { savedMessages } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  await db
    .delete(savedMessages)
    .where(and(eq(savedMessages.id, params.id), eq(savedMessages.userId, user.id)));
  return NextResponse.json({ ok: true });
}
