import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { otpCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { upsertUserByEmail, createSession, setSessionCookie } from '@/lib/auth';
import { SESSION_MAX_AGE } from '@/lib/config';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ email: z.string().email(), code: z.string().min(4).max(10) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email and code.' }, { status: 400 });

  const email = parsed.data.email.toLowerCase().trim();
  const now = Date.now();

  const rec = await db.query.otpCodes.findFirst({ where: eq(otpCodes.email, email) });
  if (!rec || rec.verified || rec.expiresAt < now || rec.code !== parsed.data.code) {
    return NextResponse.json({ error: 'Invalid or expired code. Request a new one.' }, { status: 401 });
  }

  await db.update(otpCodes).set({ verified: true }).where(eq(otpCodes.email, email));

  const user = await upsertUserByEmail(email);
  const ip = req.headers.get('x-forwarded-for') || undefined;
  const token = await createSession(user.id, ip);

  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, token);
  return res;
}
