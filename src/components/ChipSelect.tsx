'use client';
import { motion } from 'framer-motion';

export interface ChipOption { id: string; label: string; }
export interface ChipGroup { label: string; options: ChipOption[]; }

export function ChipSelect({ groups, value, onChange }: { groups: ChipGroup[]; value: string; onChange: (id: string) => void; }) {
  return (
    <div className="space-y-5">
      {groups.map((g, gi) => (
        <motion.div key={g.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.05, duration: 0.35 }}>
          <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{g.label}</div>
          <div className="flex flex-wrap gap-2">
            {g.options.map((o) => {
              const active = o.id === value;
              return (
                <motion.button key={o.id} type="button" whileTap={{ scale: 0.92 }} whileHover={{ y: -2 }} onClick={() => onChange(o.id)}
                  className={`relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${active ? 'border-brand bg-brand text-white shadow-glow' : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-brand/45 hover:bg-white/8 hover:text-white'}`}
                >
                  {o.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
