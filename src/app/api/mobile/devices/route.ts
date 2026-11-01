import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { mobileTokens } from '@/lib/db/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select({
      id: mobileTokens.id,
      device: mobileTokens.device,
      createdAt: mobileTokens.createdAt,
      expiresAt: mobileTokens.expiresAt,
      lastUsedAt: mobileTokens.lastUsedAt,
      revokedAt: mobileTokens.revokedAt,
    })
    .from(mobileTokens)
    .where(eq(mobileTokens.userId, user.id))
    .orderBy(desc(mobileTokens.createdAt));

  return NextResponse.json({ devices: rows });
}
