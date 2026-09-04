'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoPageShell } from '@/components/InfoPageShell';
import { ChevronDown, Send, Check } from 'lucide-react';

const faqs = [
  { q: 'Is Banter really free?', a: 'Yes! Banter has a free tier with 5 rewrites per day. No credit card required, no time limit. Upgrade to Plus or Pro for unlimited rewrites and advanced features.' },
  { q: 'How does Banter decide how to rewrite my message?', a: 'Banter uses the relationship type, tone, mode (personal or professional), and message length you select, combined with AI to generate contextually appropriate rewrites.' },
  { q: 'Does Banter read or store my messages?', a: "Messages are sent to our AI provider (Groq/OpenAI/Anthropic) for generation. We don't sell or share your data. See our Privacy page for full details." },
  { q: 'What languages are supported?', a: 'Currently English, Hinglish, and Hindi. We\'re adding more languages based on user demand. Spanish, French, and more are coming soon.' },
  { q: 'How do I get the Android keyboard?', a: 'The native Android keyboard is a Phase 2 feature currently in private beta. Download the beta on the Keyboard page to be notified when it launches.' },
  { q: 'Can I cancel my subscription?', a: 'Yes, cancel anytime from your account settings. You\'ll keep access until the end of your billing period. No questions asked.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="premium-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-white pr-4">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="shrink-0 text-muted" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="border-t border-white/8 px-5 pb-5 pt-4">
              <p className="text-sm leading-relaxed text-muted">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SupportPage() {
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <InfoPageShell
      eyebrow="We're here for you"
      title="Support & FAQ"
      description="Got questions? We've got answers. Can't find what you're looking for? Drop us a message."
    >
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <FaqItem q={f.q} a={f.a} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card p-7">
        <h2 className="mb-2 text-xl font-black text-white">Still need help?</h2>
        <p className="mb-6 text-sm text-muted">Send us a message. We usually respond within 24 hours.</p>
        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-5">
            <Check size={20} className="text-emerald-400 shrink-0" />
            <p className="text-sm text-white">Message sent! We'll be in touch soon. 🙌</p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Your email</label><input className="input" type="email" placeholder="you@example.com" required /></div>
              <div><label className="label">Subject</label><input className="input" placeholder="What's this about?" required /></div>
            </div>
            <div><label className="label">Message</label><textarea className="input resize-none" rows={4} placeholder="Describe your issue or question…" value={msg} onChange={(e) => setMsg(e.target.value)} required /></div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn btn-premium rounded-xl px-6 py-3 text-sm">
              {loading ? '…' : <><Send size={15} /> Send message</>}
            </motion.button>
          </form>
        )}
      </motion.div>
    </InfoPageShell>
  );
}
