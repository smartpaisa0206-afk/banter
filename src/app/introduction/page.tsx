'use client';
import { motion } from 'framer-motion';
import { InfoPageShell } from '@/components/InfoPageShell';
import Link from 'next/link';
import { ArrowRight, Heart, MessageCircle, Zap } from 'lucide-react';

export default function IntroductionPage() {
  return (
    <InfoPageShell
      eyebrow="About Banter"
      title="Say the right thing to the right person."
      description="Banter started from a simple observation: the right words at the right moment can change everything — and most of us struggle to find them."
    >
      <div className="premium-card p-7 space-y-4">
        <h2 className="text-xl font-black text-white">Why Banter exists</h2>
        <p className="text-sm leading-relaxed text-muted">
          We've all been there — staring at a screen, trying to figure out how to apologize to someone we care about, follow up on an email without sounding desperate, or say something flirty without being cringe. The words feel stuck.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          Banter is designed to unstick you. Type what you actually mean — even if it's messy — and Banter gives you something you'd actually want to send.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: <Heart size={20} />, color: '#a78bfa', title: 'Personal', desc: 'Crushes, partners, friends, family — relationships that matter.' },
          { icon: <MessageCircle size={20} />, color: '#4aa8ff', title: 'Professional', desc: 'Emails, follow-ups, pitches, and everything work-related.' },
          { icon: <Zap size={20} />, color: '#e9c46a', title: 'Instant', desc: 'Ready-to-send in seconds. No overthinking required.' },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="premium-card card-hover p-5 text-center"
          >
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${c.color}25`, color: c.color }}>
              {c.icon}
            </div>
            <h3 className="mb-1 font-bold text-white">{c.title}</h3>
            <p className="text-sm text-muted">{c.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/dashboard" className="btn btn-premium rounded-full px-8 py-4 text-base">
          Get started free <ArrowRight size={16} />
        </Link>
      </div>
    </InfoPageShell>
  );
}
