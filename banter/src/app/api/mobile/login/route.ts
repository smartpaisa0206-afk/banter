import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, createMobileToken } from '@/lib/auth';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  device: z.string().optional(),
});

// Native keyboard login: returns a bearer token the keyboard stores on-device.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { email, password, device } = parsed.data;
  const u = await db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) });
  if (!u || !verifyPassword(password, u.passwordHash, u.salt) || u.status === 'banned') {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
  const token = await createMobileToken(u.id, device);
  return NextResponse.json({
    token,
    user: { id: u.id, email: u.email, role: u.role },
  });
}
