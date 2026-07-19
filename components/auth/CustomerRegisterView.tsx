'use client';

import { Bell, ShieldCheck, Sparkles } from 'lucide-react';
import CustomerRegisterForm from '@/components/auth/CustomerRegisterForm';
import { registerTranslations } from '@/data/auth-translations';
import { useLanguageStore } from '@/store/language-store';

export default function CustomerRegisterView({ callbackUrl }: { callbackUrl: string }) {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = registerTranslations[language];
  const isArabic = language === 'AR';

  return (
    <section className="warm-speckle px-4 py-12 md:py-20" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-brand-sand bg-brand-white shadow-[0_24px_70px_rgba(68,47,35,0.13)] md:grid-cols-[42%_58%]">
        <div className="hidden flex-col justify-between bg-brand-brown p-10 text-brand-cream md:flex">
          <Sparkles size={30} className="text-brand-taupe" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-taupe">{t.panelEyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">{t.panelTitle}</h2>
            <div className="mt-6 space-y-3 text-sm text-brand-sand/85">
              <p className="flex items-center gap-3"><Bell size={17} />{t.newProducts}</p>
              <p className="flex items-center gap-3"><ShieldCheck size={17} />{t.secureAccount}</p>
            </div>
          </div>
          <p className="text-xs text-brand-sand/65">{t.freeRegistration}</p>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-7 flex items-center justify-end">
            <div className="flex rounded-full border border-brand-sand bg-brand-cream p-1 text-[11px] font-bold">
              <button type="button" onClick={() => setLanguage('FR')} aria-pressed={language === 'FR'} className={`rounded-full px-3 py-2 transition-colors ${language === 'FR' ? 'bg-brand-espresso text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'}`}>{t.languageFr}</button>
              <button type="button" onClick={() => setLanguage('AR')} aria-pressed={language === 'AR'} className={`rounded-full px-3 py-2 transition-colors ${language === 'AR' ? 'bg-brand-espresso text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'}`}>{t.languageAr}</button>
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel">{t.eyebrow}</p>
          <h1 className="mt-2 font-serif text-4xl text-brand-espresso">{t.title}</h1>
          <p className="mt-3 text-sm leading-6 text-brand-gray-text">{t.description}</p>
          <CustomerRegisterForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </section>
  );
}
