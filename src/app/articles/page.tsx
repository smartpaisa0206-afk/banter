import Link from 'next/link';
import { InfoPageShell } from '@/components/InfoPageShell';

const articles = [
  {
    href: '/articles/how-to-reply-when-you-dont-know-what-to-say',
    title: 'How to Reply When You Don’t Know What to Say',
    desc: 'For the moment you type, delete, type again, and still hesitate.',
  },
  {
    href: '/examples',
    title: 'Rough vs Better Message Examples',
    desc: 'See late replies, not-my-fault replies, Hinglish, and work mail examples.',
  },
  {
    href: '/keyboard',
    title: 'Banter Keyboard Beta',
    desc: 'Install the Android keyboard and test 🪄 inside WhatsApp, Notes, or Gmail.',
  },
];

export default function ArticlesPage() {
  return (
    <InfoPageShell
      eyebrow="Articles"
      title="Learn what to say before the moment passes."
      description="Short guides and examples for replies, apologies, work messages, and the words people hesitate to send."
    >
      <div className="grid gap-4">
        {articles.map((a) => (
          <Link key={a.href} href={a.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 transition hover:border-[#4aa8ff]/50 hover:bg-white/[0.07]">
            <h2 className="text-2xl font-bold text-white group-hover:text-[#9fd0ff]">{a.title}</h2>
            <p className="mt-2 text-muted">{a.desc}</p>
          </Link>
        ))}
      </div>
    </InfoPageShell>
  );
}
