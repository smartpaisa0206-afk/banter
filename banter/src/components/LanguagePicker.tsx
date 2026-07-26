'use client';
import { useLang } from './LanguageContext';
import { UI_LANGUAGES } from '@/lib/i18n';

export function LanguagePicker({ className = '' }: { className?: string }) {
  const { outputLang, setOutputLang, setUiLang } = useLang();
  return (
    <label className={`inline-flex items-center gap-1.5 text-xs text-muted ${className}`}>
      <span aria-hidden>🌐</span>
      <select
        value={outputLang}
        onChange={(e) => {
          setOutputLang(e.target.value);
          setUiLang(e.target.value);
        }}
        className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/90"
        aria-label="Language"
      >
        {UI_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
