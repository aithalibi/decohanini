'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/store/language-store';

type Section = { title: string; content: string };
type PageContent = { eyebrow: string; title: string; intro: string; sections: Section[] };

export default function InformationPage({ eyebrow, title, intro, sections, arabic }: PageContent & { arabic?: PageContent }) {
  const language = useLanguageStore((state) => state.language);
  const content = language === 'AR' && arabic ? arabic : { eyebrow, title, intro, sections };

  return (
    <section dir={language === 'AR' ? 'rtl' : 'ltr'} className="bg-brand-cream py-10 md:py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="warm-speckle rounded-[28px] border border-brand-sand p-6 text-center sm:p-10"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel">{content.eyebrow}</p><h1 className="mt-3 font-serif text-4xl text-brand-espresso md:text-5xl">{content.title}</h1><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-brand-gray-text">{content.intro}</p></div>
        <div className="mt-7 space-y-4">{content.sections.map((section) => <article key={section.title} className="rounded-[22px] border border-brand-sand bg-brand-white p-5 sm:p-7"><h2 className="font-serif text-2xl text-brand-espresso">{section.title}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-brand-gray-text">{section.content}</p></article>)}</div>
        <div className="mt-7 rounded-[22px] bg-brand-espresso p-6 text-center text-brand-cream"><p className="text-sm">{language === 'AR' ? 'هل لديك سؤال قبل الطلب؟' : 'Une question avant de commander?'}</p><Link href="/#contact-section" className="mt-4 inline-block rounded-full bg-brand-caramel px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">{language === 'AR' ? 'تواصل معنا' : 'Nous contacter'}</Link></div>
      </div>
    </section>
  );
}
