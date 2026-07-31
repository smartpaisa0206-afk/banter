import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

const articles = [
  {
    href: '/articles/how-to-reply-when-you-dont-know-what-to-say',
    title: 'How to Reply When You Don’t Know What to Say',
    desc: 'A practical guide for writing clear, human replies when your brain goes blank.',
  },
  {
    href: '/examples',
    title: 'Message Examples: Weak vs Better Replies',
    desc: 'Quick samples for apologies, flirting, follow-ups, captions, and more.',
  },
];

export default function ArticlesPage() {
  return (
    <InfoPageShell
      eyebrow="Articles"
      title="Better words, better moments."
      description="Guides for personal texts, professional messages, apologies, replies, captions, and communication confidence."
    >
      <div className="grid gap-4">
        {articles.map((a) => (
          <Link key={a.href} href={a.href} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 transition hover:border-[#4aa8ff]/50 hover:bg-white/[0.07]">
            <h2 className="text-2xl font-bold text-white">{a.title}</h2>
            <p className="mt-2 text-muted">{a.desc}</p>
          </Link>
        ))}
      </div>
    </InfoPageShell>
  );
}
