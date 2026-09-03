import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { Composer } from '../components/Composer';
import { CursorEffects } from '../components/CursorEffects';
import { Footer } from '../components/Footer';

export default function DashboardPage() {
  return (
    <div className="premium-shell flex min-h-screen flex-col bg-[#0b0b12]">
      <CursorEffects />
      <AppHeader email="user@example.com" role="free" />
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 py-6"
      >
        <Composer />
      </motion.main>
      <Footer />
    </div>
  );
}
