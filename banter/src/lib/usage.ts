import { db } from './db';
import { generations } from './db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { dailyLimitFor } from './plans';

export async function todaysCount(userId: string): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const rows = await db
    .select({ id: generations.id })
    .from(generations)
    .where(and(eq(generations.userId, userId), gte(generations.createdAt, start.getTime())));
  return rows.length;
}

export async function remainingFor(role: string | undefined | null, userId: string): Promise<number> {
  const limit = dailyLimitFor(role);
  if (!isFinite(limit)) return Infinity;
  const used = await todaysCount(userId);
  return Math.max(0, limit - used);
}

export async function withinLimit(role: string | undefined | null, userId: string): Promise<boolean> {
  const limit = dailyLimitFor(role);
  if (!isFinite(limit)) return true;
  return (await todaysCount(userId)) < limit;
}
