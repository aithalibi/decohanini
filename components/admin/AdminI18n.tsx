'use client';

import { useLanguageStore } from '@/store/language-store';

export function AdminText({ fr, ar }: { fr: string; ar: string }) {
  const language = useLanguageStore((state) => state.language);
  return <>{language === 'AR' ? ar : fr}</>;
}

export function AdminDate({ value, withTime = false }: { value: string; withTime?: boolean }) {
  const language = useLanguageStore((state) => state.language);
  const options: Intl.DateTimeFormatOptions = withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return <>{new Date(value).toLocaleDateString(language === 'AR' ? 'ar-MA' : 'fr-FR', options)}</>;
}

export function AdminLanguageSwitch({ compact = false }: { compact?: boolean }) {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <div className={`flex items-center rounded-full border border-brand-taupe bg-brand-white p-1 ${compact ? 'text-[10px]' : 'text-xs'}`} dir="ltr" aria-label={language === 'AR' ? 'اختيار اللغة' : 'Choisir la langue'}>
      {(['FR', 'AR'] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          className={`rounded-full px-2.5 py-1.5 font-bold transition-colors ${language === item ? 'bg-brand-brown text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'}`}
          aria-pressed={language === item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
