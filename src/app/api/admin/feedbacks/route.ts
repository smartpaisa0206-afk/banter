import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { feedback } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Admin-only: list all user feedback, newest first.
// NOTE: path is /api/admin/feedbacks (plural) to avoid a route-name
// collision with the public /api/feedback endpoint in the production build.
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const rows = await db
    .select({
      id: feedback.id,
      email: feedback.email,
      role: feedback.role,
      rating: feedback.rating,
      message: feedback.message,
      createdAt: feedback.createdAt,
    })
    .from(feedback)
    .orderBy(desc(feedback.createdAt));
  return NextResponse.json({ feedback: rows });
}
