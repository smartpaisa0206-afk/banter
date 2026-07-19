import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AppHeader } from '@/components/AppHeader';
import { PageTransition } from '@/components/PageTransition';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
