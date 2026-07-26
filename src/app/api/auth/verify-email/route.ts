import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, otpCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ code: z.string().min(4).max(10) });

// Verifies the logged-in user's email using the code sent on signup / resend.
// This is what stops throwaway/fake emails: you can only verify an inbox you
// actually control (in prod the code is emailed; in dev it is returned).
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter the code.' }, { status: 400 });

  const now = Date.now();
  const rec = await db.query.otpCodes.findFirst({ where: eq(otpCodes.email, user.email) });
  if (!rec || rec.verified || rec.expiresAt < now || rec.code !== parsed.data.code) {
    return NextResponse.json({ error: 'Invalid or expired code. Request a new one.' }, { status: 401 });
  }

  await db.update(otpCodes).set({ verified: true }).where(eq(otpCodes.email, user.email));
  // emailVerified removed - schema does not have this column
  return NextResponse.json({ ok: true });
}
