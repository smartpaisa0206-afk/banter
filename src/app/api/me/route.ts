import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { remainingFor } from '@/lib/usage';
import { llmReady } from '@/lib/engine';
import { topTonesFor } from '@/lib/toneStats';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  const rem = await remainingFor(user.role, user.id);
  const topTones = await topTonesFor(user.id, 3);
  return NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role, status: user.status },
    emailVerified: user.emailVerified ? 1 : 0,
    topTone: topTones[0]?.tone ?? null,
    topTones,
    remaining: Number.isFinite(rem) ? rem : null, // null = unlimited
    llmReady: llmReady(),
    templateMode: !llmReady(),
  });
}
