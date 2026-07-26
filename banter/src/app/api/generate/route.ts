import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generations } from '@/lib/db/schema';
import { generate, streamGenerate, relAccessible, toneAccessible, intentAccessible, intentById } from '@/lib/engine';
import { canUseWorks } from '@/lib/plans';
import { withinLimit, remainingFor } from '@/lib/usage';
import { encryptText } from '@/lib/security';
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

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

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

  if (!(await withinLimit(user.role, user.id))) {
    const rem = await remainingFor(user.role, user.id);
    return NextResponse.json(
      { error: 'Daily limit reached.', remaining: Number.isFinite(rem) ? rem : null, limitHit: true },
      { status: 429 },
    );
  }

  // Non-streaming path: mobile keyboard / simple clients.
  if (!stream) {
    const output = await generate({ relationship, intent, tone, language, context, length, hurry });
    await db
      .insert(generations)
      .values({
        id: crypto.randomUUID(),
        userId: user.id,
        relationship,
        intent,
        tone,
        language,
        contextEnc: context ? encryptText(context) : null,
        length: length || 'medium',
        hurry: !!hurry,
        resultEnc: encryptText(JSON.stringify(output)),
        createdAt: Date.now(),
      })
      .catch(() => {});
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

        // Persist + compute remaining in the background of the stream.
        await db
          .insert(generations)
          .values({
            id: crypto.randomUUID(),
            userId: user.id,
            relationship,
            intent,
            tone,
            language,
            contextEnc: context ? encryptText(context) : null,
            length: length || 'medium',
            hurry: !!hurry,
            resultEnc: encryptText(JSON.stringify(output)),
            createdAt: Date.now(),
          })
          .catch(() => {});
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
