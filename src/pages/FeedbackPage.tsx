import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { Footer } from '../components/Footer';
import { CursorEffects } from '../components/CursorEffects';
import { MessageSquare, Send, Check, Star } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="premium-shell flex min-h-screen flex-col">
      <CursorEffects />
      <AppHeader email="user@example.com" />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4aa8ff]/20 text-[#4aa8ff]">
              <MessageSquare size={20} />
            </div>
            <h1 className="text-2xl font-black text-white">Feedback</h1>
          </div>
          <p className="text-sm text-muted">Help us make Banter better. Every piece of feedback matters.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="premium-card flex flex-col items-center gap-5 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' as const, stiffness: 300, delay: 0.1 }}
                className="grid h-20 w-20 place-items-center rounded-full bg-emerald-500/20"
              >
                <Check size={36} className="text-emerald-400" />
              </motion.div>
              <h2 className="text-2xl font-black text-white">Thank you! 🙌</h2>
              <p className="text-muted max-w-sm">Your feedback goes directly to the team. We read every single message.</p>
              <button
                onClick={() => { setSubmitted(false); setMessage(''); setRating(0); }}
                className="btn btn-ghost rounded-xl px-6 py-2.5 text-sm"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={submit}
              className="premium-card p-7 space-y-6"
            >
              {/* Type */}
              <div>
                <p className="label">Feedback type</p>
                <div className="flex flex-wrap gap-2">
                  {['general', 'bug', 'feature', 'quality', 'other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`chip capitalize ${type === t ? 'chip-active' : ''}`}
                    >
                      {t === 'bug' ? '🐛' : t === 'feature' ? '✨' : t === 'quality' ? '⭐' : t === 'general' ? '💬' : '📝'} {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star rating */}
              <div>
                <p className="label">Your rating (optional)</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                      key={s}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${(hover || rating) >= s ? 'text-[#e9c46a] fill-[#e9c46a]' : 'text-white/20'}`}
                      />
                    </motion.button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 self-center text-sm text-[#e9c46a] font-medium">
                      {['', 'Poor', 'Fair', 'Good', 'Great', 'Amazing!'][rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="label">Message *</label>
                <textarea
                  className="input resize-none"
                  rows={5}
                  placeholder="Tell us what you think, what you'd love to see, or anything that's bothering you…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading || !message.trim()}
                className="btn btn-premium w-full rounded-xl py-3.5 text-base"
              >
                {loading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⟳</motion.span>
                ) : (
                  <><Send size={16} /> Send feedback</>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
