'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { InfoPageShell } from '@/components/InfoPageShell';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

const articles = [
  {
    slug: 'why-sorry-is-the-hardest-word-to-get-right',
    category: 'Communication',
    title: 'Why "sorry" is the hardest word to get right',
    desc: 'Most apologies fail because they focus on the sender, not the receiver. Here\'s how to write one that actually lands.',
    read: '4 min read',
    emoji: '🙏',
    color: '#4c6fff',
  },
  {
    slug: 'the-5-second-rule-for-work-emails',
    category: 'Workplace',
    title: 'The 5-second rule for work emails',
    desc: 'If your recipient needs more than 5 seconds to understand your ask, your email needs rewriting.',
    read: '3 min read',
    emoji: '💼',
    color: '#4aa8ff',
  },
  {
    slug: 'texting-someone-you-like-without-being-weird',
    category: 'Relationships',
    title: 'Texting someone you like without being weird',
    desc: 'The anxiety of "does this sound desperate?" — and how to escape it.',
    read: '5 min read',
    emoji: '💜',
    color: '#8b9bf0',
  },
  {
    slug: 'why-hinglish-is-the-future-of-messaging',
    category: 'Language',
    title: 'Why Hinglish is the future of messaging',
    desc: 'Code-switching isn\'t laziness — it\'s a sophisticated form of expression. Banter gets it.',
    read: '4 min read',
    emoji: '🇮🇳',
    color: '#e9c46a',
  },
  {
    slug: 'the-reply-you-never-send-costs-more-than-you-think',
    category: 'Productivity',
    title: 'The reply you never send costs more than you think',
    desc: 'Leaving messages on read — intentionally or not — damages relationships slowly. Here\'s a fix.',
    read: '3 min read',
    emoji: '⏰',
    color: '#34d399',
  },
  {
    slug: 'how-ai-learns-your-tone-without-reading-your-diary',
    category: 'AI & Writing',
    title: 'How AI learns your tone without reading your diary',
    desc: 'The difference between AI that mimics you and AI that amplifies you.',
    read: '6 min read',
    emoji: '🤖',
    color: '#f87171',
  },
];

export default function ArticlesPage() {
  return (
    <InfoPageShell
      eyebrow="Insights & guides"
      title="Write better. Connect better."
      description="Practical articles about communication, relationships, and the words that make a difference."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <Link key={i} href={`/articles/${a.slug}`} className="block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -6 }}
            className="premium-card card-hover group flex h-full flex-col cursor-pointer p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ background: `${a.color}22`, color: a.color }}>
                {a.category}
              </span>
              <span className="text-2xl">{a.emoji}</span>
            </div>
            <h3 className="mb-2 font-black text-white leading-snug group-hover:text-[#8b9bf0] transition-colors">{a.title}</h3>
            <p className="flex-1 text-sm leading-relaxed text-muted">{a.desc}</p>
            <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Clock size={12} /> {a.read}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#4c6fff] group-hover:gap-2 transition-all">
                Read <ArrowRight size={12} />
              </span>
            </div>
          </motion.div>
          </Link>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4c6fff]/20 text-[#8b9bf0]">
          <BookOpen size={20} />
        </div>
        <div>
          <p className="font-semibold text-white">More articles coming weekly</p>
          <p className="text-sm text-muted">We publish practical communication guides every week.</p>
        </div>
      </motion.div>
    </InfoPageShell>
  );
}
