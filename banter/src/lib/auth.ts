import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from './db';
import { users, sessions, mobileTokens } from './db/schema';
import { eq } from 'drizzle-orm';
import { SESSION_COOKIE, SESSION_MAX_AGE } from './config';

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const h = crypto.scryptSync(password, salt, 64);
  const hh = Buffer.from(hash, 'hex');
  return h.length === hh.length && crypto.timingSafeEqual(h, hh);
}

export async function createSession(userId: string, ip?: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await db.insert(sessions).values({
    id: crypto.randomUUID(),
    tokenHash,
    userId,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
    createdAt: Date.now(),
    ip: ip || null,
  });
  return token;
}

export async function destroySession(token: string): Promise<void> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function userFromToken(token?: string) {
  if (!token) return null;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const s = await db.query.sessions.findFirst({ where: eq(sessions.tokenHash, tokenHash) });
  if (!s || s.expiresAt < Date.now()) return null;
  const u = await db.query.users.findFirst({ where: eq(users.id, s.userId) });
  if (!u || u.status === 'banned') return null;
  return u;
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return userFromToken(token);
}

export function sessionTokenFromCookies(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value;
}

// Resolve a user from a mobile bearer token (used by the native keyboard).
export async function userFromMobileToken(token?: string) {
  if (!token) return null;
  const mt = await db.query.mobileTokens.findFirst({ where: eq(mobileTokens.token, token) });
  if (!mt || mt.expiresAt < Date.now()) return null;
  const u = await db.query.users.findFirst({ where: eq(users.id, mt.userId) });
  if (!u || u.status === 'banned') return null;
  return u;
}

// Create a long-lived device token for the native keyboard.
export async function createMobileToken(userId: string, device?: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  await db.insert(mobileTokens).values({
    id: crypto.randomUUID(),
    userId,
    token,
    device: device || null,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  });
  return token;
}

// Find a user by email or create one on the fly. Used by passwordless OTP login
// and Google sign-in, where no password is set (a random hash is stored so the
// not-null column is satisfied; these users simply can't use password login).
export async function upsertUserByEmail(email: string): Promise<{ id: string; email: string; role: string }> {
  const e = email.toLowerCase().trim();
  const existing = await db.query.users.findFirst({ where: eq(users.email, e) });
  if (existing) return existing;
  const { hash, salt } = hashPassword(crypto.randomBytes(24).toString('hex'));
  const [u] = await db
    .insert(users)
    .values({ id: crypto.randomUUID(), email: e, passwordHash: hash, salt, role: 'free', status: 'active', createdAt: Date.now() })
    .returning();
  return u;
}

// Set the session cookie on a NextResponse the same way register/login do.
export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}
