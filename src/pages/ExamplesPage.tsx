import { motion } from 'framer-motion';
import { InfoPageShell } from '../components/InfoPageShell';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const examples = [
  {
    category: '💑 Romantic',
    items: [
      { rough: 'sorry i forgot our plans', polished: "Hey, I'm really sorry about today. I completely dropped the ball and I feel terrible about it. Can we reschedule? I want to make it up to you." },
      { rough: 'wanna hang', polished: "Hey! I've been thinking about you — would love to grab coffee or do something fun together this week if you're up for it?" },
    ],
  },
  {
    category: '💼 Professional',
    items: [
      { rough: 'deadline moved', polished: "I wanted to give you a heads-up that we'll need to adjust the project timeline. I'll share a revised schedule with updated milestones by end of day." },
      { rough: 'follow up invoice', polished: "Hope you're having a great week! I wanted to gently follow up on the invoice from last month. Please let me know if you need any documentation." },
    ],
  },
  {
    category: '🤝 Casual',
    items: [
      { rough: 'sry busy', polished: "Hey, sorry for going quiet! Things got hectic on my end. How are you doing? Would love to catch up soon." },
      { rough: 'how r u', polished: "Hey! It's been a while — how have you been? Hope everything's going well on your end." },
    ],
  },
  {
    category: '🇮🇳 Hinglish',
    items: [
      { rough: 'kkrh', polished: 'kuch khaas nahi, tu bata kya chal raha hai?' },
      { rough: 'bhai help chahiye', polished: 'Bhai, ek kaam tha — thoda time hai toh baat karni thi, important hai yaar.' },
    ],
  },
];

function ExCard({ rough, polished }: { rough: string; polished: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(polished).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="premium-card card-hover p-5 space-y-3"
    >
      <div>
        <p className="label mb-1.5">Rough draft</p>
        <p className="text-sm text-white/55 line-through decoration-[#7c5cff]/50">{rough}</p>
      </div>
      <div className="divider" />
      <div>
        <p className="label mb-1.5 text-[#9fd0ff]">Banter ✦</p>
        <p className="text-sm leading-relaxed text-white/88">{polished}</p>
      </div>
      <button onClick={copy} className="btn btn-ghost w-full rounded-xl py-2 text-xs">
        {copied ? <><Check size={13} className="text-emerald-400" /> Copied!</> : <><Copy size={13} /> Copy this</>}
      </button>
    </motion.div>
  );
}

export default function ExamplesPage() {
  return (
    <InfoPageShell
      eyebrow="See it in action"
      title="Real examples. Real messages."
      description="Banter handles everything from awkward apologies to professional follow-ups — across relationships, tones, and languages."
    >
      {examples.map((cat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-black text-white">{cat.category}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {cat.items.map((ex, j) => (
              <ExCard key={j} rough={ex.rough} polished={ex.polished} />
            ))}
          </div>
        </motion.div>
      ))}
    </InfoPageShell>
  );
}
