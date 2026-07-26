'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { t } from '@/lib/i18n';

interface Ctx {
  uiLang: string;
  setUiLang: (l: string) => void;
  outputLang: string;
  setOutputLang: (l: string) => void;
}

const LangCtx = createContext<Ctx>({
  uiLang: 'en',
  setUiLang: () => {},
  outputLang: 'en',
  setOutputLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [uiLang, setUiLangState] = useState('en');
  const [outputLang, setOutputLangState] = useState('en');

  useEffect(() => {
    const u = localStorage.getItem('banter_ui');
    const o = localStorage.getItem('banter_out');
    if (u) setUiLangState(u);
    if (o) setOutputLangState(o);
  }, []);

  const setUiLang = (l: string) => {
    setUiLangState(l);
    localStorage.setItem('banter_ui', l);
  };
  const setOutputLang = (l: string) => {
    setOutputLangState(l);
    localStorage.setItem('banter_out', l);
  };

  return (
    <LangCtx.Provider value={{ uiLang, setUiLang, outputLang, setOutputLang }}>{children}</LangCtx.Provider>
  );
}

export function useLang() {
  return useContext(LangCtx);
}

export function useT() {
  const { uiLang } = useLang();
  return (key: string) => t(uiLang, key);
}
