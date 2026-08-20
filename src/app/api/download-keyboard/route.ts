import { NextResponse } from 'next/server';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const apkPath = join(process.cwd(), 'public', 'banter-keyboard-beta.apk');
  if (!existsSync(apkPath)) {
    return new NextResponse(
      'Banter Keyboard beta APK is not uploaded yet. Please check the /keyboard page or ask HNY Labs for the latest beta link.',
      { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }
  return NextResponse.redirect(new URL('/banter-keyboard-beta.apk', process.env.NEXT_PUBLIC_SITE_URL || 'https://banter-mu.vercel.app'));
}
