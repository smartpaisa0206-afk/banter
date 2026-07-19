import { AuthForm } from '@/components/AuthForm';
import { Logo } from '@/components/Logo';

export const dynamic = 'force-dynamic';

export default function Signup() {
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
