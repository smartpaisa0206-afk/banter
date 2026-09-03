import { AuthForm } from '../components/AuthForm';
import { CursorEffects } from '../components/CursorEffects';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b0b12]">
      <CursorEffects />
      <AuthForm mode="login" />
    </div>
  );
}
