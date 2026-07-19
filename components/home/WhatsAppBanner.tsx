'use client';

import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@prisma/client';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';

export default function WhatsAppBanner({ settings }: { settings?: SiteSettings }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const whatsappUrl = `https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '212777422673'}`;
  const phone = settings?.whatsappNumber ? settings.whatsappNumber.replace(/^212/, '0').replace(/(\d{4})(\d{6})/, '$1 $2') : '0777 422673';

  return (
    <section className="bg-brand-white px-3 pb-0 sm:px-5 lg:px-10">
      <div className="container mx-auto grid min-h-[180px] overflow-hidden bg-brand-beige md:grid-cols-[46%_54%]">
        <div className="flex flex-col items-start justify-center px-7 py-8 text-brand-espresso sm:px-10 md:px-14">
          <h2 className="text-xl font-bold uppercase tracking-[0.05em] md:text-2xl">{t.needHelp}</h2>
          <p className="mt-2 text-sm text-brand-gray-text">{t.contactWhatsapp}</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center gap-2 rounded-full bg-brand-espresso px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-brown">
            <MessageCircle size={17} />{phone}
          </a>
        </div>
        <div className="relative min-h-[190px] md:min-h-[220px]">
          <Image src={settings?.heroImageUrl || '/images/hero/hero-panorama-v2.png'} alt="Salon Déco Hanini" fill className="object-cover object-[70%_center]" sizes="(max-width: 767px) 100vw, 54vw" />
        </div>
      </div>
    </section>
  );
}
