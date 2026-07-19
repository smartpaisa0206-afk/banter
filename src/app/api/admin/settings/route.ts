import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getSetting, setSetting } from '@/lib/settings';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json({
    freeDailyLimit: await getSetting('free_daily_limit', '5'),
    maintenance: await getSetting('maintenance', 'false'),
    llmEnabled: await getSetting('llm_enabled', 'true'),
  });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const parsed = z
    .object({
      freeDailyLimit: z.string().optional(),
      maintenance: z.string().optional(),
      llmEnabled: z.string().optional(),
    })
    .safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  if (parsed.data.freeDailyLimit !== undefined) await setSetting('free_daily_limit', parsed.data.freeDailyLimit);
  if (parsed.data.maintenance !== undefined) await setSetting('maintenance', parsed.data.maintenance);
  if (parsed.data.llmEnabled !== undefined) await setSetting('llm_enabled', parsed.data.llmEnabled);
  return NextResponse.json({ ok: true });
}
