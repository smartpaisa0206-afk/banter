import { AuthForm } from '../components/AuthForm';
import { CursorEffects } from '../components/CursorEffects';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0b0b12]">
      <CursorEffects />
      <AuthForm mode="signup" />
    </div>
  );
}
