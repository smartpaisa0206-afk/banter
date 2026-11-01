import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';

export const dynamic = 'force-dynamic';

export default function Login() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
