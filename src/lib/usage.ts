import { db } from './db';
import { generations } from './db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { dailyLimitFor } from './plans';
import crypto from 'node:crypto';

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

export class QuotaExceededError extends Error {}
export class QuotaReserveError extends Error {}

export interface ReservationParams {
  relationship: string;
  intent: string;
  tone: string;
  language: string;
  length: string;
  hurry: boolean;
  contextEnc: string | null;
}

/**
 * Reserve one generation BEFORE calling the LLM: the quota count-check and
 * the generations-row insert happen together here, so the insert can no
 * longer silently fail (which used to hand out free generations) and the
 * ~20s LLM call runs after the quota is already spent.
 *
 * The row is written with an empty placeholder result; the caller fills it
 * in with `finalizeReservation()` after generation. If generate() throws
 * afterwards, the reservation stays consumed — quota is spent on the
 * attempt, not on success.
 *
 * NOTE: not wrapped in a DB transaction on purpose — Turso's HTTP driver
 * (libsql:// over HTTPS) does not support interactive transactions, so we
 * reserve sequentially. The remaining race is bounded by the per-user burst
 * rate limiter on the routes, and a duplicate reservation costs at most one
 * quota unit rather than handing out free ones.
 */
export async function reserveGeneration(params: ReservationParams & { userId: string; role: string | undefined | null }): Promise<string> {
  const limit = dailyLimitFor(params.role);
  if (isFinite(limit) && (await todaysCount(params.userId)) >= limit) {
    throw new QuotaExceededError('Daily limit reached.');
  }
  const id = crypto.randomUUID();
  try {
    await db.insert(generations).values({
      id,
      userId: params.userId,
      relationship: params.relationship,
      intent: params.intent,
      tone: params.tone,
      language: params.language,
      contextEnc: params.contextEnc,
      length: params.length,
      hurry: params.hurry,
      resultEnc: '{}', // placeholder — filled in by finalizeReservation()
      createdAt: Date.now(),
    });
  } catch (e) {
    // Never swallow this: a failed reserve must be a 500, not a free generation.
    throw new QuotaReserveError(`Could not reserve quota: ${e instanceof Error ? e.message : e}`);
  }
  return id;
}

/** Fill in the real (encrypted) result on a previously reserved row. */
export async function finalizeReservation(reservationId: string, resultEnc: string): Promise<void> {
  await db.update(generations).set({ resultEnc }).where(eq(generations.id, reservationId));
}
