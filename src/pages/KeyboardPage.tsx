import { motion } from 'framer-motion';
import { InfoPageShell } from '../components/InfoPageShell';
import { Keyboard, Smartphone, Download, Lock, Zap, Check } from 'lucide-react';

const steps = [
  { icon: <Download size={20} />, step: '01', title: 'Download the app', desc: 'Get the Banter Android app from the link below and install it on your device.' },
  { icon: <Keyboard size={20} />, step: '02', title: 'Enable the keyboard', desc: 'Go to Settings → System → Languages & Input → Virtual Keyboard and enable Banter.' },
  { icon: <Lock size={20} />, step: '03', title: 'Log in', desc: 'Open the Banter keyboard settings and log in with your account to activate AI rewrites.' },
  { icon: <Zap size={20} />, step: '04', title: 'Start rewriting', desc: 'Tap the Banter key on any keyboard while typing to instantly rewrite your message.' },
];

const features = [
  'Works in any app — WhatsApp, Gmail, Slack, Instagram',
  'Only sends text when you tap the Banter key',
  'Session-based token — revoke anytime from Settings',
  'End-to-end encrypted transmission',
  'Relationship & tone settings sync from your account',
];

export default function KeyboardPage() {
  return (
    <InfoPageShell
      eyebrow="Phase 2 · Coming soon"
      title="Banter lives in your keyboard."
      description="Rewrite any message, in any app, without switching context. The Banter Android keyboard puts AI rewrites one tap away."
    >
      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 rounded-2xl border border-[#e9c46a]/30 bg-[#e9c46a]/8 p-5"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9c46a]/20 text-[#e9c46a]">
          <Smartphone size={20} />
        </div>
        <div>
          <p className="font-bold text-white">Android Keyboard — Phase 2</p>
          <p className="text-sm text-muted">Native Kotlin IME keyboard. Currently in private beta.</p>
        </div>
        <span className="ml-auto badge-gold shrink-0">Coming soon</span>
      </motion.div>

      {/* Steps */}
      <div className="premium-card p-6">
        <h2 className="mb-6 text-xl font-black text-white">How to set it up</h2>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#7c5cff]/20 text-[#a78bfa]">
                {s.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{s.step}</span>
                  <h3 className="font-bold text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-muted">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div className="premium-card p-6">
        <h2 className="mb-4 text-lg font-black text-white">Privacy & security</h2>
        <ul className="space-y-3">
          {features.map((f, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2.5 text-sm text-white/80"
            >
              <Check size={15} className="mt-0.5 shrink-0 text-emerald-400" />
              {f}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-4 rounded-[2rem] border border-[#7c5cff]/30 bg-[#7c5cff]/8 p-8 text-center"
      >
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#4aa8ff] shadow-glow">
          <Keyboard size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-black text-white">Join the waitlist</h3>
        <p className="text-sm text-muted max-w-sm">Be among the first to get the Banter Android keyboard when it launches.</p>
        <div className="flex w-full max-w-sm gap-2">
          <input className="input flex-1" type="email" placeholder="your@email.com" />
          <button className="btn btn-premium rounded-xl px-5 shrink-0">Notify me</button>
        </div>
      </motion.div>
    </InfoPageShell>
  );
}
