'use client';

import { Award, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

export default function CommitmentsSection() {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  const commitments = [
    {
      icon: Truck,
      title: isArabic ? 'توصيل موثوق' : 'Livraison fiable',
      description: isArabic ? 'المنتجات تصل بعناية وفي الوقت المناسب' : 'Des colis suivis et soignés jusqu’à chez vous',
    },
    {
      icon: ShieldCheck,
      title: isArabic ? 'دفع عند الاستلام' : 'Paiement à réception',
      description: isArabic ? 'حرية وطمأنينة عند إتمام الطلب' : 'Une expérience simple et rassurante',
    },
    {
      icon: Award,
      title: isArabic ? 'اختيار انتقائي' : 'Sélection exigeante',
      description: isArabic ? 'قطع مختارة لتبقى أنيقة لفترة طويلة' : 'Des pièces choisies pour durer et traverser les tendances',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: isArabic ? 'ردود سريعة ومساعدة مباشرة عند الحاجة' : 'Une réponse rapide pour vous accompagner',
    },
  ];

  return (
    <section className="w-full bg-[linear-gradient(180deg,#f6ede0_0%,#fffdfa_100%)] py-14 md:py-20">
      <div className="container mx-auto px-3 sm:px-5 lg:px-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-brand-caramel">
            {isArabic ? 'التزاماتنا' : 'Nos engagements'}
          </p>
          <h2 className="font-display italic mt-3 text-[clamp(2rem,3.8vw,3.2rem)] leading-none text-brand-espresso">
            {isArabic ? 'خدمة واضحة، بسيطة، وراقية' : 'Un service clair, simple et élégant'}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {commitments.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-[26px] border border-brand-sand bg-white/85 p-6 shadow-[0_14px_34px_rgba(45,34,27,0.06)]">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-espresso text-brand-cream">
                  <Icon size={21} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-brand-espresso">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-brand-gray-text">
                    {description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
