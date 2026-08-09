import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { logSecurityEvent } from '@/lib/securityEvents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (params.id === me.id) return NextResponse.json({ error: 'You cannot ban yourself.' }, { status: 400 });

  await db.update(users).set({ status: 'banned' }).where(eq(users.id, params.id));
  await logSecurityEvent({ req, userId: params.id, eventType: 'admin_user_banned', source: 'admin', success: true, severity: 'critical', metadata: { adminId: me.id } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await db.update(users).set({ status: 'active' }).where(eq(users.id, params.id));
  await logSecurityEvent({ req, userId: params.id, eventType: 'admin_user_unbanned', source: 'admin', success: true, metadata: { adminId: me.id } });
  return NextResponse.json({ ok: true });
}
