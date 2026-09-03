import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { Footer } from '../components/Footer';
import { CursorEffects } from '../components/CursorEffects';
import { Bookmark, Copy, Check, Trash2, Star } from 'lucide-react';
import { useState } from 'react';

const mockSaved = [
  { id: '1', title: 'Late reply apology', content: "Sorry, I got caught up. Didn't mean to ignore you — I should've replied earlier.", date: 'Dec 15' },
  { id: '2', title: 'Work deadline email', content: "I wanted to flag that the project deadline will need to be pushed back slightly. I'll send a detailed update with the new timeline shortly.", date: 'Dec 14' },
  { id: '3', title: 'Crush check-in', content: "Hey! I was thinking about you — would love to grab coffee or catch up this week if you're free?", date: 'Dec 13' },
  { id: '4', title: 'Invoice follow-up', content: "Hope you're doing well! I wanted to follow up on the invoice I sent over last week. Please let me know if you need any additional details.", date: 'Dec 12' },
];

export default function SavedPage() {
  const [items, setItems] = useState(mockSaved);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  function del(id: string) {
    if (window.confirm('Delete this saved message?')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  return (
    <div className="premium-shell flex min-h-screen flex-col">
      <CursorEffects />
      <AppHeader email="user@example.com" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9c46a]/20 text-[#e9c46a]">
              <Bookmark size={20} />
            </div>
            <h1 className="text-2xl font-black text-white">Saved</h1>
          </div>
          <p className="text-sm text-muted">Messages you've saved for reuse.</p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e9c46a]/15 text-[#e9c46a]"
            >
              <Star size={28} />
            </motion.div>
            <p className="font-semibold text-white">Nothing saved yet</p>
            <p className="text-sm text-muted max-w-xs">When you save a Banter message, it'll appear here for quick reuse.</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="premium-card card-hover group flex flex-col p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    {item.title && (
                      <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    )}
                    <span className="text-xs text-muted">{item.date}</span>
                  </div>
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#e9c46a]/15 text-[#e9c46a]">
                    <Star size={14} className="fill-current" />
                  </div>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-white/82 mb-4">{item.content}</p>
                <div className="flex items-center gap-2 border-t border-white/8 pt-3">
                  <button
                    onClick={() => copy(item.content, item.id)}
                    className="btn btn-ghost flex-1 rounded-lg py-1.5 text-xs"
                  >
                    {copied === item.id ? <><Check size={13} className="text-emerald-400" /> Copied!</> : <><Copy size={13} /> Copy</>}
                  </button>
                  <button
                    onClick={() => del(item.id)}
                    className="btn rounded-lg border border-red-500/20 bg-red-500/8 py-1.5 px-3 text-xs text-red-400 hover:bg-red-500/15"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
