import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { feedback } from '@/lib/db/schema';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  message: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  await db
    .insert(feedback)
    .values({
      id: crypto.randomUUID(),
      userId: user?.id ?? null,
      role: user?.role ?? null,
      rating: parsed.data.rating ?? null,
      message: parsed.data.message,
      email: parsed.data.email || null,
      createdAt: Date.now(),
    })
    .catch(() => {});
  return NextResponse.json({ ok: true });
}
