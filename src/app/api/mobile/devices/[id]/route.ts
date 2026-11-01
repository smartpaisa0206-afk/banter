import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { mobileTokens } from '@/lib/db/schema';
import { logSecurityEvent } from '@/lib/securityEvents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = Date.now();
  await db
    .update(mobileTokens)
    .set({ revokedAt: now })
    .where(and(eq(mobileTokens.id, params.id), eq(mobileTokens.userId, user.id)));

  await logSecurityEvent({
    req,
    userId: user.id,
    eventType: 'token_revoked',
    source: 'web',
    success: true,
    metadata: { mobileTokenId: params.id },
  });

  return NextResponse.json({ ok: true, revokedAt: now });
}
