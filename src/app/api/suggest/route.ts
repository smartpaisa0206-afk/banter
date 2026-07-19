import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { liveSuggest, relAccessible, toneAccessible, intentAccessible, intentById } from '@/lib/engine';
import { withinLimit, remainingFor } from '@/lib/usage';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  partial: z.string().max(4000),
  relationship: z.string().optional(),
  intent: z.string().optional(),
  tone: z.string().optional(),
  language: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { partial, relationship, intent, tone, language } = parsed.data;
  if (relationship && !relAccessible(relationship, user.role))
    return NextResponse.json({ error: 'Upgrade to use this relationship.' }, { status: 403 });
  if (tone && !toneAccessible(tone, user.role))
    return NextResponse.json({ error: 'Upgrade to use this tone.' }, { status: 403 });
  if (intent) {
    const cfg = intentById(intent);
    if (!cfg || !intentAccessible(intent, user.role))
      return NextResponse.json({ error: 'Upgrade to use this intent.' }, { status: 403 });
  }

  if (!(await withinLimit(user.role, user.id))) {
    const rem = await remainingFor(user.role, user.id);
    return NextResponse.json(
      { error: 'Daily limit reached.', remaining: Number.isFinite(rem) ? rem : null, limitHit: true },
      { status: 429 },
    );
  }

  const out = await liveSuggest({ partial, relationship, intent, tone, language });
  return NextResponse.json(out);
}
