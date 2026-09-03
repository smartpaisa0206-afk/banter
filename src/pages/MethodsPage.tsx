import { motion } from 'framer-motion';
import { InfoPageShell } from '../components/InfoPageShell';
import { Wand2, Users, MessageCircle, Layers, Zap, Check } from 'lucide-react';

const methods = [
  {
    icon: <Users size={22} />,
    color: '#7c5cff',
    title: 'Relationship awareness',
    desc: 'Banter knows the difference between texting your partner vs emailing your boss. Select who you\'re writing to, and the language, warmth, and formality adjust automatically.',
  },
  {
    icon: <MessageCircle size={22} />,
    color: '#4aa8ff',
    title: 'Tone calibration',
    desc: 'Choose from 7 tones: warm, casual, formal, flirty, apologetic, confident, or playful. Banter layers tone on top of relationship context for nuanced results.',
  },
  {
    icon: <Layers size={22} />,
    color: '#e9c46a',
    title: 'Mode switching',
    desc: 'Personal mode handles social messages. Works mode handles professional writing — emails, follow-ups, marketing copy, and more.',
  },
  {
    icon: <Wand2 size={22} />,
    color: '#a78bfa',
    title: 'AI generation engine',
    desc: 'Powered by Groq / OpenAI / Anthropic with smart template fallback. Works even without an internet connection using local templates.',
  },
  {
    icon: <Zap size={22} />,
    color: '#34d399',
    title: 'Graceful fallback',
    desc: 'No API key? No problem. Banter\'s template engine generates solid rewrites using contextual logic — always gives you something usable.',
  },
];

export default function MethodsPage() {
  return (
    <InfoPageShell
      eyebrow="Behind the scenes"
      title="How Banter actually works."
      description="Not just AI completions — a purpose-built system that understands context, relationships, and human communication."
    >
      <div className="space-y-4">
        {methods.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="premium-card card-hover flex gap-5 p-6"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${m.color}22`, color: m.color }}>
              {m.icon}
            </div>
            <div>
              <h3 className="mb-2 font-bold text-white">{m.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="premium-card p-6"
      >
        <h2 className="mb-4 text-lg font-black text-white">Our principles</h2>
        <ul className="space-y-3">
          {[
            'Privacy first — your messages are never used for training',
            'Speed — results in under 3 seconds',
            'Always useful — template fallback ensures you always get something',
            'Human-sounding — reads like you wrote it, just better',
          ].map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
              <Check size={15} className="mt-0.5 shrink-0 text-emerald-400" />
              {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </InfoPageShell>
  );
}
