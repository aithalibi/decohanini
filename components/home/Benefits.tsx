'use client';

import { Award, Phone, Truck, Wallet } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';

export default function Benefits() {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const benefits = [
    { icon: Truck, title: t.deliveryTitle, description: t.deliveryDesc },
    { icon: Wallet, title: t.paymentTitle, description: t.paymentDesc },
    { icon: Award, title: t.qualityTitle, description: t.qualityDesc },
    { icon: Phone, title: t.supportTitle, description: '07 14 51 64 93' },
  ];

  return (
    <section className="border-b border-brand-sand bg-brand-white py-4 md:py-0">
      <div className="container mx-auto grid grid-cols-2 px-3 sm:px-5 md:grid-cols-4 lg:px-8">
        {benefits.map(({ icon: Icon, title, description }, index) => (
          <div key={title} className={`flex min-w-0 items-center justify-center gap-3 px-2 py-4 sm:px-4 md:py-6 ${index > 0 ? 'md:border-l md:border-brand-sand' : ''}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center text-brand-caramel"><Icon size={23} strokeWidth={1.45} /></span>
            <div className="min-w-0">
              <h3 className="text-[8px] font-bold uppercase leading-3 tracking-[0.08em] text-brand-espresso sm:text-[10px]">{title}</h3>
              <p className="mt-1 truncate text-[9px] text-brand-gray-text sm:text-[11px]">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
