'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import type { SiteSettings } from '@prisma/client';

export default function Hero({ settings }: { settings?: SiteSettings }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const isArabic = language === 'AR';
  const heroTitle = isArabic ? t.heroTitle1 : settings?.heroTitle || "L'élégance dans chaque détail";
  const heroSubtitle = isArabic ? t.heroDesc1 : settings?.heroSubtitle || 'Découvrez notre sélection unique de décoration pour un intérieur qui vous ressemble.';
  const heroImageUrl = settings?.heroImageUrl || '/images/hero/hero-panorama-v2.png';

  return (
    <section className="relative min-h-[440px] overflow-hidden bg-brand-brown md:min-h-[500px] lg:min-h-[540px]" dir={isArabic ? 'rtl' : 'ltr'}>
      <Image src={heroImageUrl} alt="Salon Déco Hanini" fill priority sizes="(max-width: 1480px) 100vw, 1480px" className="object-cover object-[62%_center] md:object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,24,17,0.82)_0%,rgba(45,31,22,0.63)_32%,rgba(45,31,22,0.12)_68%,rgba(45,31,22,0.04)_100%)] rtl:bg-[linear-gradient(270deg,rgba(35,24,17,0.82)_0%,rgba(45,31,22,0.63)_32%,rgba(45,31,22,0.12)_68%,rgba(45,31,22,0.04)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-espresso/25 to-transparent" />

      <div className="container relative mx-auto flex min-h-[440px] items-center px-6 sm:px-10 md:min-h-[500px] lg:min-h-[540px] lg:px-14">
        <div className="max-w-[570px] text-brand-cream">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-sand">Déco Hanini</p>
          <h1 className="max-w-xl font-serif text-[clamp(2.65rem,6vw,4.7rem)] font-medium leading-[1.02] tracking-[-0.025em] text-white">{heroTitle}</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-brand-cream/88 md:text-base">{heroSubtitle}</p>
          <Link href="/boutique" className="mt-7 inline-flex items-center gap-3 bg-brand-caramel px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition-colors hover:bg-brand-gold-dark">
            {t.discoverShop}<ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white" />
        <span className="h-2 w-2 rounded-full border border-white/80 bg-white/35" />
        <span className="h-2 w-2 rounded-full border border-white/80 bg-white/35" />
      </div>
    </section>
  );
}
