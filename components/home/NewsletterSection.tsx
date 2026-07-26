'use client';

import { Mail } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

export default function NewsletterSection() {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  return (
    <section className="w-full bg-brand-espresso py-14 text-brand-cream md:py-20">
      <div className="container mx-auto px-3 sm:px-5 lg:px-10">
        <div className="grid gap-6 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,#2d221b_0%,#3a2a20_55%,#6a4c35_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)] lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-brand-sand/80">
              {isArabic ? 'النشرة البريدية' : 'Newsletter'}
            </p>
            <h2 className="font-display italic mt-4 text-[clamp(2rem,4vw,3.5rem)] leading-[0.95]">
              {isArabic ? 'احصل على أول الإلهام قبل الجميع' : 'Recevez nos inspirations avant tout le monde'}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-brand-sand/85 sm:text-base">
              {isArabic
                ? 'اطّلع على الإصدارات الجديدة، القطع الموسمية، والاختيارات التي نصممها لإضفاء طابع أكثر فخامة على المنزل.'
                : 'Découvrez les nouveautés, les sélections saisonnières et les pièces qui donnent à la maison une allure plus raffinée.'}
            </p>
          </div>

          <form className="flex flex-col gap-3 self-center rounded-[28px] border border-white/10 bg-white/8 p-3 backdrop-blur-md sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-full bg-white px-4 py-3 text-brand-espresso">
              <Mail size={18} className="shrink-0 text-brand-caramel" />
              <input
                id="newsletter-email"
                type="email"
                placeholder={isArabic ? 'بريدك الإلكتروني' : 'Votre e-mail'}
                className="w-full bg-transparent text-sm outline-none placeholder:text-brand-gray-text"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-brand-cream px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-espresso transition-colors hover:bg-white"
            >
              {isArabic ? 'اشترك الآن' : 'S’inscrire'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
