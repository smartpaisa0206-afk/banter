'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Bug, Languages, Keyboard } from 'lucide-react';

const quick = ['Keyboard bug', 'Wrong language', 'Bad suggestion', 'Too formal', 'APK install issue'];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!message.trim()) return;
    setSending(true);
    const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, rating, email }) });
    setSending(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mx-auto max-w-xl space-y-4 p-8 text-center">
        <CheckCircle2 size={44} className="mx-auto text-emerald-400" />
        <h1 className="text-3xl font-black tracking-[-0.04em]">Got it. We’ll use this to improve Banter.</h1>
        <p className="text-sm text-muted">Real bugs and bad replies are the fastest way to make the keyboard better.</p>
        <Link href="/dashboard" className="btn-plus mx-auto px-5 py-2.5">Back to composer</Link>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
        <p className="chip mb-4"><MessageSquare size={13} /> Feedback</p>
        <h1 className="text-4xl font-black tracking-[-0.04em]">Show us the moment it failed.</h1>
        <p className="mt-2 text-muted">Send the typed text, the app you tested in, and what looked wrong. Screenshots help most.</p>
      </section>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5 p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><Bug className="mb-2 text-[#9fd0ff]" /><p className="text-sm font-semibold">Bug</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><Languages className="mb-2 text-[#9fd0ff]" /><p className="text-sm font-semibold">Language</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><Keyboard className="mb-2 text-[#9fd0ff]" /><p className="text-sm font-semibold">Keyboard</p></div>
        </div>

        <div>
          <label className="label">Quick tag</label>
          <div className="flex flex-wrap gap-2">
            {quick.map((q) => <button key={q} onClick={() => setMessage((m) => m ? `${m}\n${q}: ` : `${q}: `)} className="chip hover:border-[#4aa8ff]/60 hover:text-white">{q}</button>)}
          </div>
        </div>

        <div>
          <label className="label">Rating</label>
          <div className="flex gap-2">{[1,2,3,4,5].map((n) => <button key={n} onClick={() => setRating(n)} className={`h-11 w-11 rounded-xl border text-sm transition ${rating >= n ? 'border-[#4aa8ff] bg-[#4aa8ff]/20 text-[#9fd0ff]' : 'border-white/10 bg-white/5 text-white/60'}`}>{n}</button>)}</div>
        </div>

        <div>
          <label className="label">What happened?</label>
          <textarea className="input min-h-[150px] resize-y" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Example: I typed 'how are you' but it replied in Hinglish. Tested in WhatsApp on Redmi Android 13." />
        </div>

        <div>
          <label className="label">Email optional</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <button onClick={submit} disabled={sending || !message.trim()} className="btn-plus w-full py-3">{sending ? 'Sending…' : 'Send feedback'}</button>
      </motion.div>
    </div>
  );
}
