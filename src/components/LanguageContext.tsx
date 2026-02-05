// src/components/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
  lang: Language;
  t: typeof translations['zh']; // 讓 TypeScript 知道翻譯檔的結構
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en'); // 建議預設英文 (國際賽事)

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}