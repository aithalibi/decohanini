'use client';

import { Award, ShieldCheck, Truck } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

export default function Benefits() {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  const benefits = [
    {
      icon: Truck,
      title: isArabic ? 'توصيل سريع' : 'Livraison partout',
      description: isArabic ? 'في جميع أنحاء المغرب' : 'Dans tout le Maroc',
    },
    {
      icon: ShieldCheck,
      title: isArabic ? 'الدفع عند الاستلام' : 'Paiement à la livraison',
      description: isArabic ? 'بكل بساطة وثقة' : 'Simple, rapide et rassurant',
    },
    {
      icon: Award,
      title: isArabic ? 'اختيارات ممتازة' : 'Sélection premium',
      description: isArabic ? 'قطع مختارة بعناية' : 'Des pièces choisies avec soin',
    },
  ];

  return (
    <section className="w-full px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <div className="mx-auto grid w-full max-w-[1400px] gap-0 overflow-hidden border-y border-brand-sand bg-white/55 sm:grid-cols-3">
        {benefits.map(({ icon: Icon, title, description }, index) => (
          <div
            key={title}
            className={`flex min-w-0 items-center gap-3 px-4 py-4 sm:px-6 ${index > 0 ? 'sm:border-l sm:border-brand-sand/70' : ''}`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand-sand text-brand-espresso">
              <Icon size={18} strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-espresso">
                {title}
              </h3>
              <p className="mt-1 text-xs text-brand-gray-text">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
