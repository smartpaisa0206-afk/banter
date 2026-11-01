'use client';
import { motion } from 'framer-motion';

export interface ChipOption {
  id: string;
  label: string;
}
export interface ChipGroup {
  label: string;
  options: ChipOption[];
}

export function ChipSelect({
  groups,
  value,
  onChange,
}: {
  groups: ChipGroup[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{g.label}</div>
          <div className="flex flex-wrap gap-2">
            {g.options.map((o) => {
              const active = o.id === value;
              return (
                <motion.button
                  key={o.id}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onChange(o.id)}
                  className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                    active
                      ? 'border-brand bg-brand text-white shadow-glow'
                      : 'border-white/10 bg-white/5 text-white/75 hover:border-brand/50 hover:text-white'
                  }`}
                >
                  {o.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
