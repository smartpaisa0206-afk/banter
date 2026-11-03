'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { InfoPageShell } from '@/components/InfoPageShell';
import { Keyboard, Smartphone, Download, Lock, Zap, Check, ShieldCheck, MessageSquare } from 'lucide-react';

const steps = [
  { icon: <Download size={20} />, step: '01', title: 'Download the package', desc: 'Grab the complete keyboard package below — source, guide and beta APK, free for everyone.' },
  { icon: <Keyboard size={20} />, step: '02', title: 'Install and enable', desc: 'Install the APK, then enable Banter Keyboard from Android keyboard settings.' },
  { icon: <Lock size={20} />, step: '03', title: 'Connect account', desc: 'Open Banter Keyboard settings and sign in once. Password is not stored.' },
  { icon: <Zap size={20} />, step: '04', title: 'Tap the wand', desc: 'Type rough in WhatsApp, Notes or Gmail, then tap 🪄 to rewrite.' },
];

const features = [
  'Works in WhatsApp, Gmail, Notes, Instagram and most text fields',
  'Only sends text when you tap 🪄',
  'Keyboard device tokens can be revoked anytime',
  'Private/password fields disable magic suggestions',
  'Same-language replies across all 17 supported languages',
];

export default function KeyboardPage() {
  return (
    <InfoPageShell eyebrow="Android keyboard beta" title="Banter lives in your keyboard." description="Rewrite any message, in any app, without switching context. Type rough, tap 🪄, and send better.">
      <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col gap-4 rounded-2xl border border-[#e9c46a]/30 bg-[#e9c46a]/8 p-5 sm:flex-row sm:items-center">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e9c46a]/20 text-[#e9c46a]"><Smartphone size={22} /></div>
        <div className="flex-1"><p className="font-bold text-white">Android Keyboard — Private Beta</p><p className="text-sm text-muted">Free download, no login needed. Test with real messages and report what feels wrong.</p></div>
        <span className="badge-gold shrink-0">Limited beta</span>
      </motion.div>

      <div className="premium-card p-6">
        <h2 className="mb-6 text-xl font-black text-white">How to set it up</h2>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#4c6fff]/20 text-[#8b9bf0]">{s.icon}</div>
              <div><div className="mb-1 flex items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-muted">{s.step}</span><h3 className="font-bold text-white">{s.title}</h3></div><p className="text-sm text-muted">{s.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="premium-card p-6">
        <h2 className="mb-4 text-lg font-black text-white">Privacy & security</h2>
        <ul className="space-y-3">{features.map((f, i) => <motion.li key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-start gap-2.5 text-sm text-white/80"><Check size={15} className="mt-0.5 shrink-0 text-emerald-400" />{f}</motion.li>)}</ul>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-4 rounded-[2rem] border border-[#4c6fff]/30 bg-[#4c6fff]/8 p-8 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#4c6fff] to-[#4aa8ff] shadow-glow"><Keyboard size={24} className="text-white" /></div>
        <h3 className="text-xl font-black text-white">Download Banter Keyboard</h3>
        <p className="max-w-sm text-sm text-muted">Free for everyone — the complete package: Android source, build files, setup guide, and the beta APK.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/banter-keyboard-complete.zip" download className="btn btn-premium rounded-full px-6 py-3"><Download size={16} /> Download package (.zip)</a>
          <Link href="/dashboard/feedback" className="btn btn-ghost rounded-full px-6 py-3"><MessageSquare size={16} /> Report bug</Link>
          <Link href="/privacy" className="btn btn-ghost rounded-full px-6 py-3"><ShieldCheck size={16} /> Privacy</Link>
        </div>
      </motion.div>
    </InfoPageShell>
  );
}
