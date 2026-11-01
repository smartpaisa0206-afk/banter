import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCurrentUser } from '@/lib/auth';
import { logSecurityEvent } from '@/lib/securityEvents';
import { appBaseUrl } from '@/lib/oauth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const base = appBaseUrl(req.nextUrl.origin);
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', base));
  }

  const apkPath = join(process.cwd(), 'public', 'banter-keyboard-beta.apk');
  if (!existsSync(apkPath)) {
    await logSecurityEvent({ req, userId: user.id, eventType: 'keyboard_download', source: 'web', success: false, severity: 'warn', metadata: { reason: 'apk_missing' } });
    return new NextResponse(
      'Banter Keyboard beta APK is not uploaded yet. Please check the /keyboard page or ask HNY Labs for the latest beta link.',
      { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }
  await logSecurityEvent({ req, userId: user.id, eventType: 'keyboard_download', source: 'web', success: true });
  return NextResponse.redirect(new URL('/banter-keyboard-beta.apk', base));
}
