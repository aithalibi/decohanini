'use client';

import { ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import CustomerLoginForm from '@/components/auth/CustomerLoginForm';
import { loginTranslations } from '@/data/auth-translations';
import { useLanguageStore } from '@/store/language-store';

export default function CustomerLoginView({ callbackUrl }: { callbackUrl: string }) {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = loginTranslations[language];
  const isArabic = language === 'AR';

  return (
    <section className="warm-speckle px-3 py-8 sm:px-4 sm:py-12 md:py-20" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[24px] border border-brand-sand bg-brand-white shadow-[0_24px_70px_rgba(68,47,35,0.13)] md:grid-cols-[42%_58%]">
        <div className="hidden flex-col justify-between bg-brand-brown p-10 text-brand-cream md:flex">
          <Sparkles size={30} className="text-brand-taupe" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-taupe">{t.panelEyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">{t.panelTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-brand-sand/80">{t.panelDescription}</p>
          </div>
          <p className="flex items-center gap-2 text-xs text-brand-sand/75"><ShieldCheck size={17} />{t.secureSession}</p>
        </div>

        <div className="p-4 sm:p-8 md:p-12">
          <div className="mb-6 flex flex-wrap items-center justify-end gap-2.5 sm:mb-7 sm:gap-3">
            <Link href="/" className="rounded-full border border-brand-sand bg-brand-cream px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-brown transition-colors hover:bg-brand-sand/70 sm:px-4 sm:text-[11px]">
              {isArabic ? 'عودة للرئيسية' : "Retour à l'accueil"}
            </Link>
            <div className="flex rounded-full border border-brand-sand bg-brand-cream p-1 text-[10px] font-bold sm:text-[11px]">
              <button type="button" onClick={() => setLanguage('FR')} aria-pressed={language === 'FR'} className={`rounded-full px-3 py-2 transition-colors ${language === 'FR' ? 'bg-brand-espresso text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'}`}>{t.languageFr}</button>
              <button type="button" onClick={() => setLanguage('AR')} aria-pressed={language === 'AR'} className={`rounded-full px-3 py-2 transition-colors ${language === 'AR' ? 'bg-brand-espresso text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'}`}>{t.languageAr}</button>
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel">{t.eyebrow}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-brand-espresso sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-sm leading-6 text-brand-gray-text">{t.description}</p>
          <CustomerLoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </section>
  );
}
