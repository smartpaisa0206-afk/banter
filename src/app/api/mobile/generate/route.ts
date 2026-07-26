import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { userFromMobileToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { generations } from '@/lib/db/schema';
import { generate, relAccessible, toneAccessible, intentAccessible, intentById } from '@/lib/engine';
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
  token: z.string().optional(),
});

// Native keyboard generation. Auth via bearer token (header or body).
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
  const body = await req.json().catch(() => ({}));
  const token = bearer || body?.token;
  const user = await userFromMobileToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const { relationship, intent, tone, language, context, length, hurry } = parsed.data;

  if (!relAccessible(relationship, user.role))
    return NextResponse.json({ error: 'Upgrade to use this relationship.' }, { status: 403 });
  if (!toneAccessible(tone, user.role))
    return NextResponse.json({ error: 'Upgrade to use this tone.' }, { status: 403 });
  const intentCfg = intentById(intent);
  if (!intentCfg || !intentAccessible(intent, user.role))
    return NextResponse.json({ error: 'Upgrade to use this intent.' }, { status: 403 });
  if (intentCfg.category === 'works' && !canUseWorks(user.role))
    return NextResponse.json({ error: 'Upgrade to use Works.' }, { status: 403 });

  if (!(await withinLimit(user.role, user.id))) {
    const rem = await remainingFor(user.role, user.id);
    return NextResponse.json(
      { error: 'Daily limit reached.', remaining: Number.isFinite(rem) ? rem : null, limitHit: true },
      { status: 429 },
    );
  }

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
