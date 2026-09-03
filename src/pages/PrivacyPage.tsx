import { motion } from 'framer-motion';
import { InfoPageShell } from '../components/InfoPageShell';
import { Shield, Lock, Eye, Database, Trash2 } from 'lucide-react';

const sections = [
  {
    icon: <Eye size={20} />,
    title: 'What we collect',
    content: 'We collect your email address for authentication, message inputs when you use Banter (temporarily), and basic usage analytics. We do not collect financial data — payments are handled by Stripe.',
  },
  {
    icon: <Database size={20} />,
    title: 'How we store your data',
    content: 'All data is encrypted at rest using AES-256. Sessions use secure, httpOnly cookies. We use Turso (libSQL) for data storage with strict access controls.',
  },
  {
    icon: <Lock size={20} />,
    title: 'Third-party sharing',
    content: 'Message content is sent to our AI provider (Groq, OpenAI, or Anthropic) for generation only. We do not sell, rent, or share your personal data with any third party for marketing.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Your rights',
    content: 'You can request a copy of your data, correct inaccuracies, or delete your account at any time from Settings. We honor GDPR and CCPA rights for all users.',
  },
  {
    icon: <Trash2 size={20} />,
    title: 'Data deletion',
    content: 'When you delete your account, all personal data including messages, history, saved items, and sessions are permanently deleted within 7 days. Backups are purged within 30 days.',
  },
];

export default function PrivacyPage() {
  return (
    <InfoPageShell
      eyebrow="Legal · Privacy"
      title="Your privacy matters."
      description="Banter is built on the principle that your conversations are yours. Here's exactly what we do — and don't do — with your data."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="premium-card card-hover p-6"
          >
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#7c5cff]/20 text-[#a78bfa]">
              {s.icon}
            </div>
            <h3 className="mb-2 font-bold text-white">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{s.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="premium-card p-6 text-sm text-muted space-y-2">
        <p className="font-semibold text-white">Contact & updates</p>
        <p>Last updated: December 2025. For privacy inquiries, contact us via the Support page. We'll notify you of any material changes via email.</p>
      </div>
    </InfoPageShell>
  );
}
