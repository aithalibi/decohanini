'use client';

import { Star } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

export default function ReviewsSection() {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  const reviews = [
    {
      name: 'Sara M.',
      role: isArabic ? 'الدار البيضاء' : 'Casablanca',
      text: isArabic
        ? 'التفاصيل جميلة جداً والصور في الموقع تبدو أنيقة وواضحة. الطلب وصل بسرعة والتغليف ممتاز.'
        : 'Les détails sont vraiment soignés. Le site est élégant, les photos sont claires et la commande est arrivée vite.',
    },
    {
      name: 'Yassine B.',
      role: isArabic ? 'الرباط' : 'Rabat',
      text: isArabic
        ? 'أحببت أسلوب العرض الجديد، أشعر أن كل فئة لها هوية خاصة. تجربة سهلة وراقية.'
        : 'Le nouveau rendu donne une vraie identité à chaque univers. Une expérience simple, fluide et premium.',
    },
    {
      name: 'Nadia K.',
      role: isArabic ? 'مراكش' : 'Marrakech',
      text: isArabic
        ? 'خدمة واتساب سريعة والمنتجات وصلت كما في الصور تماماً. الموقع صار أجمل بكثير.'
        : 'Le service WhatsApp est réactif et les produits correspondent parfaitement aux visuels. Le site est beaucoup plus beau maintenant.',
    },
  ];

  return (
    <section className="w-full bg-[linear-gradient(180deg,#fffdfa_0%,#f5ebde_100%)] py-14 md:py-20">
      <div className="container mx-auto px-3 sm:px-5 lg:px-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-brand-caramel">
            {isArabic ? 'آراء الزبائن' : 'Avis clients'}
          </p>
          <h2 className="font-display italic mt-3 text-[clamp(2rem,3.8vw,3.2rem)] leading-none text-brand-espresso">
            {isArabic ? 'تجربة جميلة من أول نظرة' : 'Une expérience qui plaît dès le premier regard'}
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-[26px] border border-brand-sand bg-white/90 p-6 shadow-[0_14px_32px_rgba(45,34,27,0.06)]">
              <div className="flex items-center gap-1 text-brand-caramel">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={`${review.name}-${index}`} size={15} fill="currentColor" strokeWidth={1.5} />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-brand-gray-text">
                {review.text}
              </p>
              <div className="mt-6 border-t border-brand-sand pt-4">
                <p className="text-sm font-bold text-brand-espresso">{review.name}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-caramel">{review.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
