import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { securityEvents } from '@/lib/db/schema';

export type SecurityEventType =
  | 'login_success'
  | 'login_failed'
  | 'login_locked'
  | 'mobile_login_success'
  | 'mobile_login_failed'
  | 'generate_success'
  | 'generate_failed'
  | 'mobile_generate_success'
  | 'mobile_generate_failed'
  | 'generation_limit_hit'
  | 'admin_user_banned'
  | 'admin_user_unbanned'
  | 'token_revoked'
  | 'account_deleted';

export type SecuritySource = 'web' | 'android_keyboard' | 'admin' | 'api';
export type SecuritySeverity = 'info' | 'warn' | 'critical';

function hashIp(ip: string): string {
  const secret = process.env.APP_ENCRYPTION_KEY || process.env.SESSION_SECRET || 'dev-security-event-secret';
  return crypto.createHash('sha256').update(`${secret}:${ip}`).digest('hex').slice(0, 32);
}

export function requestMeta(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
  return {
    ipHash: hashIp(ip),
    country: req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || null,
    userAgent: req.headers.get('user-agent')?.slice(0, 300) || null,
  };
}

export async function logSecurityEvent(opts: {
  req?: NextRequest;
  userId?: string | null;
  eventType: SecurityEventType;
  source: SecuritySource;
  success: boolean;
  severity?: SecuritySeverity;
  metadata?: Record<string, unknown>;
}) {
  try {
    const meta = opts.req ? requestMeta(opts.req) : { ipHash: null, country: null, userAgent: null };
    await db.insert(securityEvents).values({
      id: crypto.randomUUID(),
      userId: opts.userId || null,
      eventType: opts.eventType,
      source: opts.source,
      ipHash: meta.ipHash,
      country: meta.country,
      userAgent: meta.userAgent,
      success: opts.success,
      severity: opts.severity || (opts.success ? 'info' : 'warn'),
      metadataJson: opts.metadata ? JSON.stringify(opts.metadata).slice(0, 2000) : null,
      createdAt: Date.now(),
    });
  } catch {
    // Security logging must never break the user-facing request.
  }
}
