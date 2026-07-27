import crypto from 'node:crypto';

function key32(): Buffer {
  const k = process.env.APP_ENCRYPTION_KEY || 'dev-insecure-key-change-me-please-32plus';
  return crypto.createHash('sha256').update(k).digest();
}

// AES-256-GCM encryption for message content at rest.
export function encryptText(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key32(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptText(b64: string): string {
  const buf = Buffer.from(b64, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key32(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

// Tiny in-memory brute-force guard for login (per-ip, resets after window).
const attempts = new Map<string, { count: number; till: number }>();
const WINDOW = 15 * 60 * 1000; // 15 min
const MAX = 8;

export function registerFailedAttempt(key: string): void {
  const now = Date.now();
  const a = attempts.get(key) || { count: 0, till: now + WINDOW };
  a.count += 1;
  a.till = now + WINDOW;
  attempts.set(key, a);
}
export function isLockedOut(key: string): boolean {
  const a = attempts.get(key);
  if (!a) return false;
  if (Date.now() > a.till) {
    attempts.delete(key);
    return false;
  }
  return a.count >= MAX;
}
export function clearAttempts(key: string): void {
  attempts.delete(key);
}
