import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, createSession } from '@/lib/auth';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/config';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password (min 8 characters).' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  const { hash, salt } = hashPassword(parsed.data.password);
  const [u] = await db
    .insert(users)
    .values({ id: crypto.randomUUID(), email, passwordHash: hash, salt, role: 'free', status: 'active', createdAt: Date.now() })
    .returning({ id: users.id });

  const token = await createSession(u.id, req.headers.get('x-forwarded-for') || undefined);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
