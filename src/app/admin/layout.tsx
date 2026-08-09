import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/dashboard');
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-white/60 hover:text-white">Admin</Link>
            <Link href="/admin/security" className="text-white/60 hover:text-white">Security</Link>
            <Link href="/dashboard" className="text-white/60 hover:text-white">Back to app</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-6">{children}</main>
    </div>
  );
}
