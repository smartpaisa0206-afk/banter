import { db } from './db';
import { userToneStats } from './db/schema';
import { eq, desc, sql } from 'drizzle-orm';

// Tone-learning v1: lightweight per-user tone selection stats.
// Every helper is failure-safe: if the table doesn't exist yet (migration
// not run on an old DB), the feature silently no-ops instead of breaking
// generation or page loads.

export async function recordToneUse(userId: string, tone: string): Promise<void> {
  const now = Date.now();
  await db
    .insert(userToneStats)
    .values({ userId, tone, count: 1, updatedAt: now })
    .onConflictDoUpdate({
      target: [userToneStats.userId, userToneStats.tone],
      set: { count: sql`${userToneStats.count} + 1`, updatedAt: now },
    })
    .catch(() => {});
}

export async function topTonesFor(userId: string, limit = 3): Promise<{ tone: string; count: number }[]> {
  const rows = await db
    .select({ tone: userToneStats.tone, count: userToneStats.count })
    .from(userToneStats)
    .where(eq(userToneStats.userId, userId))
    .orderBy(desc(userToneStats.count))
    .limit(limit)
    .catch(() => []);
  return rows;
}

export async function topToneFor(userId: string): Promise<string | null> {
  const rows = await topTonesFor(userId, 1);
  return rows[0]?.tone ?? null;
}
