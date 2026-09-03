import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { Footer } from '../components/Footer';
import { CursorEffects } from '../components/CursorEffects';
import { History, Search, Filter, Trash2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const mockHistory = [
  { id: '1', date: 'Today, 2:34 PM', rough: 'hey sry was busy', result: "Sorry, I got caught up. Didn't mean to ignore you — I should've replied earlier.", mode: 'personal', tone: 'warm' },
  { id: '2', date: 'Today, 11:12 AM', rough: 'tell boss deadline moved', result: "I wanted to flag that the project deadline will need to be pushed back slightly. I'll send a detailed update with the new timeline shortly.", mode: 'professional', tone: 'formal' },
  { id: '3', date: 'Yesterday, 8:45 PM', rough: 'wanna hang out', result: "Hey! I was thinking about you — would love to grab coffee or catch up this week if you're free?", mode: 'personal', tone: 'flirty' },
  { id: '4', date: 'Yesterday, 3:20 PM', rough: 'kkrh bhai', result: 'kuch khaas nahi bhai, tu bata kya chal raha hai?', mode: 'personal', tone: 'casual' },
  { id: '5', date: 'Dec 12, 10:00 AM', rough: 'follow up on invoice', result: "Hope you're doing well! I wanted to follow up on the invoice I sent over last week. Please let me know if you need any additional details.", mode: 'professional', tone: 'warm' },
];

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = mockHistory.filter(
    (h) => h.rough.toLowerCase().includes(search.toLowerCase()) || h.result.toLowerCase().includes(search.toLowerCase())
  );

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="premium-shell flex min-h-screen flex-col">
      <CursorEffects />
      <AppHeader email="user@example.com" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#7c5cff]/20 text-[#a78bfa]">
              <History size={20} />
            </div>
            <h1 className="text-2xl font-black text-white">History</h1>
          </div>
          <p className="text-sm text-muted ml-13">Your recent Banter rewrites.</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input pl-10"
              placeholder="Search your history…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost rounded-xl px-4">
            <Filter size={15} /> Filter
          </button>
        </motion.div>

        {/* Items */}
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="premium-card card-hover group p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${item.mode === 'personal' ? 'badge-plus' : 'badge-pro'}`}>
                    {item.mode}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-muted">{item.tone}</span>
                </div>
                <span className="text-xs text-muted">{item.date}</span>
              </div>

              <div className="mb-2">
                <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Rough draft</p>
                <p className="text-sm text-white/60 line-through decoration-[#7c5cff]/50">{item.rough}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#9fd0ff] mb-1">Banter result</p>
                <p className="text-sm leading-relaxed text-white/88">{item.result}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copy(item.result, item.id)}
                  className="btn btn-ghost rounded-lg py-1.5 text-xs"
                >
                  {copied === item.id ? <><Check size={13} className="text-emerald-400" /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
                <button className="btn rounded-lg border border-red-500/20 bg-red-500/8 py-1.5 text-xs text-red-400 hover:bg-red-500/15">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card flex min-h-[250px] flex-col items-center justify-center gap-3 text-center p-8">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#7c5cff]/15 text-[#a78bfa]">
                <History size={24} />
              </div>
              <p className="font-semibold text-white">No history found</p>
              <p className="text-sm text-muted">Your rewrites will appear here after you start composing.</p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
