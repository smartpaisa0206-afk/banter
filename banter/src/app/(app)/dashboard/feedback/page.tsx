'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!message.trim()) return;
    setSending(true);
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, rating, email }),
    });
    setSending(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mx-auto max-w-xl space-y-4 p-8 text-center"
      >
        <CheckCircle2 size={40} className="mx-auto text-emerald-400" />
        <h1 className="text-xl font-semibold">Thanks for the feedback!</h1>
        <p className="text-sm text-muted">It really helps us make Banter better. We read every message.</p>
        <Link href="/dashboard" className="btn-premium mx-auto px-5 py-2.5">
          Back to composer
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mx-auto max-w-xl space-y-5 p-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-brand-soft" />
        <h1 className="text-xl font-semibold">Share feedback</h1>
      </div>

      <div>
        <label className="label">How's Banter? (tap to rate)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className={`h-10 w-10 rounded-xl border text-sm transition ${
                rating >= n ? 'border-gold bg-gold/20 text-gold' : 'border-white/10 bg-white/5 text-white/60'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">What's on your mind?</label>
        <textarea
          className="input min-h-[120px] resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Bugs, ideas, a weird reply you got, anything…"
        />
      </div>

      <div>
        <label className="label">Email (optional — only if you want a reply)</label>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <button onClick={submit} disabled={sending || !message.trim()} className="btn-premium w-full py-3">
        {sending ? 'Sending…' : 'Send feedback'}
      </button>
    </motion.div>
  );
}
