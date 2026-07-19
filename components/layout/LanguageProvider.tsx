'use client';

import React, { useEffect } from 'react';
import { useLanguageStore } from '../../store/language-store';

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
      document.documentElement.lang = language === 'AR' ? 'ar' : 'fr';
    }
  }, [language]);

  return <>{children}</>;
}
