import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';
import { ArrowRight, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="orb h-[400px] w-[400px] bg-[#7c5cff]/15 -top-20 left-1/2 -translate-x-1/2 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Link to="/" className="mb-8 inline-block">
          <Logo className="scale-125" />
        </Link>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6 text-8xl font-black gradient-text"
        >
          404
        </motion.div>

        <h1 className="mb-3 text-2xl font-black text-white">Hmm, that page doesn't exist.</h1>
        <p className="mb-8 text-muted max-w-sm mx-auto">
          Maybe Banter can help you find the right words for how you're feeling right now.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn btn-premium rounded-full px-6 py-3">
            <Home size={16} /> Go home
          </Link>
          <Link to="/dashboard" className="btn btn-ghost rounded-full px-6 py-3">
            Open Banter <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
