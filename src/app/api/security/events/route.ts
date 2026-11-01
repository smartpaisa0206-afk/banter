import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { securityEvents } from '@/lib/db/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const me = await getCurrentUser();
  if (!me || me.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const rows = await db.select().from(securityEvents).orderBy(desc(securityEvents.createdAt)).limit(200);
  return NextResponse.json({ events: rows });
}
