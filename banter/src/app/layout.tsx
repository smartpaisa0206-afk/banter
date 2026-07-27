import './globals.css';
import type { Metadata, Viewport } from 'next';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/config';
import { LangProvider } from '@/components/LanguageContext';
import { RegisterSW } from '@/components/RegisterSW';

export const metadata: Metadata = {
  title: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
  description: BRAND_TAGLINE,
  manifest: '/manifest.webmanifest',
  applicationName: BRAND_NAME,
  appleWebApp: { capable: true, title: BRAND_NAME, statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#0b0b12',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>{children}</LangProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
