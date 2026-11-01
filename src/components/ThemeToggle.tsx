'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('banter_theme');
    const isLight = saved === 'light';
    setLight(isLight);
    document.documentElement.classList.toggle('light', isLight);
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle('light', next);
    localStorage.setItem('banter_theme', next ? 'light' : 'dark');
  }

  return (
    <button onClick={toggle} className="btn-ghost rounded-full px-3 py-2" aria-label="Toggle theme">
      {light ? <Moon size={16} /> : <Sun size={16} />}
      <span className="hidden sm:inline">{light ? 'Dark' : 'Light'}</span>
    </button>
  );
}
