'use client';

import { MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@prisma/client';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';

export default function WhatsAppBanner({ settings }: { settings?: SiteSettings }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const whatsappUrl = `https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '212714516493'}`;
  const phone = settings?.whatsappNumber ? settings.whatsappNumber.replace(/^212/, '0').replace(/(\d{4})(\d{6})/, '$1 $2') : '0777 422673';

  return (
    <section className="w-full px-4 py-8 sm:px-5 lg:px-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1400px] border border-brand-sand bg-[linear-gradient(135deg,#fffdf9_0%,#f7efe3_55%,#efe4d4_100%)] px-6 py-6 sm:px-8 lg:flex lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold uppercase tracking-[0.08em] text-brand-espresso md:text-xl">
            {t.needHelp}
          </h2>
          <p className="mt-2 text-sm text-brand-gray-text">
            {t.contactWhatsapp}
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-espresso px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-brand-brown lg:mt-0"
        >
          <MessageCircle size={17} />
          {phone}
        </a>
      </div>
    </section>
  );
}
