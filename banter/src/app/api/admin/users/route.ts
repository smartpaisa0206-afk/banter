import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const rows = await db
    .select({ id: users.id, email: users.email, role: users.role, status: users.status, createdAt: users.createdAt })
    .from(users)
    .orderBy(desc(users.createdAt));
  return NextResponse.json({ users: rows });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const parsed = z
    .object({
      id: z.string(),
      role: z.enum(['free', 'basic', 'premium', 'admin']).optional(),
      status: z.enum(['active', 'banned']).optional(),
    })
    .safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const data: { role?: string; status?: string } = {};
  if (parsed.data.role) data.role = parsed.data.role;
  if (parsed.data.status) data.status = parsed.data.status;
  await db.update(users).set(data).where(eq(users.id, parsed.data.id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ id: z.string() }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  if (parsed.data.id === user.id) return NextResponse.json({ error: 'Cannot delete your own account.' }, { status: 400 });
  await db.delete(users).where(eq(users.id, parsed.data.id));
  return NextResponse.json({ ok: true });
}
