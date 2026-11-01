import type { NextRequest } from 'next/server';

const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'local').split(',')[0].trim();
}

export function rateLimit(req: NextRequest, opts: { key: string; limit: number; windowMs: number; userId?: string | null }) {
  const id = `${opts.key}:${opts.userId || clientIp(req)}`;
  const now = Date.now();
  const bucket = buckets.get(id);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(id, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs };
  }
  if (bucket.count >= opts.limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }
  bucket.count += 1;
  return { ok: true, remaining: opts.limit - bucket.count, resetAt: bucket.resetAt };
}
