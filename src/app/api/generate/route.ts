import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generate, streamGenerate, relAccessible, toneAccessible, intentAccessible, intentById } from '@/lib/engine';
import { canUseWorks } from '@/lib/plans';
import { withinLimit, remainingFor, reserveGeneration, finalizeReservation, QuotaExceededError } from '@/lib/usage';
import { recordToneUse } from '@/lib/toneStats';
import { encryptText } from '@/lib/security';
import { logSecurityEvent } from '@/lib/securityEvents';
import { rateLimit } from '@/lib/rateLimit';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  relationship: z.string().min(1),
  intent: z.string().min(1),
  tone: z.string().min(1),
  language: z.string().min(1),
  context: z.string().max(4000).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  hurry: z.boolean().optional(),
  stream: z.boolean().optional(),
});

// Reserve one quota unit before the LLM runs. Returns the reservation id,
// or an error response if the limit is hit or the reserve insert fails.
async function reserveOrRespond(req: NextRequest, user: { id: string; role: string }, opts: {
  relationship: string; intent: string; tone: string; language: string;
  length?: string; hurry?: boolean; context?: string;
}): Promise<{ reservationId: string } | { response: NextResponse }> {
  if (!(await withinLimit(user.role, user.id))) {
    const rem = await remainingFor(user.role, user.id);
    await logSecurityEvent({ req, userId: user.id, eventType: 'generation_limit_hit', source: 'web', success: false, severity: 'warn', metadata: { relationship: opts.relationship, intent: opts.intent, tone: opts.tone } });
    return {
      response: NextResponse.json(
        { error: 'Daily limit reached.', remaining: Number.isFinite(rem) ? rem : null, limitHit: true },
        { status: 429 },
      ),
    };
  }
  try {
    const reservationId = await reserveGeneration({
      userId: user.id,
      role: user.role,
      relationship: opts.relationship,
      intent: opts.intent,
      tone: opts.tone,
      language: opts.language,
      length: opts.length || 'medium',
      hurry: !!opts.hurry,
      contextEnc: opts.context ? encryptText(opts.context) : null,
    });
    return { reservationId };
  } catch (e) {
    if (e instanceof QuotaExceededError) {
      const rem = await remainingFor(user.role, user.id);
      return {
        response: NextResponse.json(
          { error: 'Daily limit reached.', remaining: Number.isFinite(rem) ? rem : null, limitHit: true },
          { status: 429 },
        ),
      };
    }
    console.error('[generate] quota reserve failed:', e instanceof Error ? e.message : e);
    return {
      response: NextResponse.json(
        { error: 'Could not start generation. Please try again.' },
        { status: 500 },
      ),
    };
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const burst = rateLimit(req, { key: 'generate:web', userId: user.id, limit: 12, windowMs: 60 * 1000 });
  if (!burst.ok) {
    await logSecurityEvent({ req, userId: user.id, eventType: 'generate_failed', source: 'web', success: false, severity: 'warn', metadata: { reason: 'burst_rate_limited' } });
    return NextResponse.json({ error: 'Too many requests. Slow down and try again.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { relationship, intent, tone, language, context, length, hurry, stream } = parsed.data;

  if (!relAccessible(relationship, user.role))
    return NextResponse.json({ error: 'Upgrade to use this relationship.' }, { status: 403 });
  if (!toneAccessible(tone, user.role))
    return NextResponse.json({ error: 'Upgrade to use this tone.' }, { status: 403 });
  const intentCfg = intentById(intent);
  if (!intentCfg || !intentAccessible(intent, user.role))
    return NextResponse.json({ error: 'Upgrade to use this intent.' }, { status: 403 });
  if (intentCfg.category === 'works' && !canUseWorks(user.role))
    return NextResponse.json({ error: 'Upgrade to use Works (emails, social, marketing).' }, { status: 403 });

  const reserved = await reserveOrRespond(req, user, { relationship, intent, tone, language, length, hurry, context });
  if ('response' in reserved) return reserved.response;
  const { reservationId } = reserved;

  // Non-streaming path: mobile keyboard / simple clients.
  if (!stream) {
    const output = await generate({ relationship, intent, tone, language, context, length, hurry });
    await finalizeReservation(reservationId, encryptText(JSON.stringify(output)));
    await recordToneUse(user.id, tone);
    await logSecurityEvent({ req, userId: user.id, eventType: 'generate_success', source: 'web', success: true, metadata: { relationship, intent, tone, language, hurry: !!hurry } });
    const rem = await remainingFor(user.role, user.id);
    return NextResponse.json({ ...output, remaining: Number.isFinite(rem) ? rem : null });
  }

  // Streaming path: web UI. Sends first byte immediately (meta), streams
  // deltas to keep the connection alive, then reveals the structured result.
  const encoder = new TextEncoder();
  const streamRes = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

      try {
        const output = await streamGenerate(
          { relationship, intent, tone, language, context, length, hurry },
          (e) => {
            if (e.type === 'meta') send('meta', e);
            else if (e.type === 'delta') send('delta', e);
            else if (e.type === 'done') send('done', e.output);
            else if (e.type === 'error') send('error', e);
          },
          req.signal,
        );

        // Persist the result onto the reservation, then compute remaining.
        // The reservation row was already counted against the quota up front.
        await finalizeReservation(reservationId, encryptText(JSON.stringify(output)));
        await recordToneUse(user.id, tone);
        await logSecurityEvent({ req, userId: user.id, eventType: 'generate_success', source: 'web', success: true, metadata: { relationship, intent, tone, language, stream: true, hurry: !!hurry } });
        const rem = await remainingFor(user.role, user.id);
        send('remaining', { remaining: Number.isFinite(rem) ? rem : null });
      } catch (err) {
        send('error', { message: 'Generation failed. Please try again.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(streamRes, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
