'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SettingsForm({
  settings,
}: {
  settings: { freeDailyLimit: string; maintenance: string; llmEnabled: string };
}) {
  const router = useRouter();
  const [freeDailyLimit, setFreeDailyLimit] = useState(settings.freeDailyLimit);
  const [maintenance, setMaintenance] = useState(settings.maintenance === 'true');
  const [llmEnabled, setLlmEnabled] = useState(settings.llmEnabled === 'true');
  const [saved, setSaved] = useState(false);

  async function save() {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        freeDailyLimit,
        maintenance: String(maintenance),
        llmEnabled: String(llmEnabled),
      }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      router.refresh();
    }
  }

  return (
    <div className="card max-w-md space-y-4 p-5">
      <div>
        <label className="label">Free daily limit</label>
        <input
          className="input w-32"
          value={freeDailyLimit}
          onChange={(e) => setFreeDailyLimit(e.target.value)}
        />
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} className="accent-brand" />
        Maintenance mode
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={llmEnabled} onChange={(e) => setLlmEnabled(e.target.checked)} className="accent-brand" />
        LLM enabled
      </label>
      <button onClick={save} className="btn-premium">
        {saved ? 'Saved!' : 'Save settings'}
      </button>
    </div>
  );
}
