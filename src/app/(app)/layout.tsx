import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { AppHeader } from '@/components/AppHeader';
import { PageTransition } from '@/components/PageTransition';
import { VerifyNotice } from '@/components/VerifyNotice';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    // Middleware normally catches cookie-less users first; this backstop
    // covers a session cookie that exists but fails real verification, and
    // preserves the deep-link target (set as x-pathname by middleware).
    const raw = headers().get('x-pathname') || '/dashboard';
    const target = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard';
    redirect(`/login?next=${encodeURIComponent(target)}`);
  }
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <VerifyNotice />
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
