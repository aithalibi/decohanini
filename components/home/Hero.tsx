'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { SiteSettings } from '@prisma/client';
import { useLanguageStore } from '@/store/language-store';

interface HeroProps {
  settings?: SiteSettings;
  showcaseImages?: string[];
}

export default function Hero({ settings, showcaseImages = [] }: HeroProps) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  const mainImage = settings?.heroImageUrl || showcaseImages[0] || '/lookbook/lookbook-02.jpeg';
  const eyebrow = isArabic ? 'مجموعة جديدة' : 'Nouvelle collection';
  const title = isArabic
    ? 'أناقة هادئة تضيف حضوراً للمكان'
    : settings?.heroTitle || "L'élégance dans chaque détail";
  const description = isArabic
    ? 'اكتشفوا قطع ديكور مختارة بعناية لتمنح منزلكم حضوراً دافئاً وراقياً.'
    : settings?.heroSubtitle || 'Découvrez des pièces décoratives soigneusement sélectionnées pour créer un intérieur élégant, chaleureux et unique.';

  return (
    <section className="w-full px-2 py-2 sm:px-3 lg:px-4 lg:py-3">
      <div
        className="relative mx-auto w-full max-w-[1480px] overflow-hidden bg-[#342115] shadow-[0_20px_60px_rgba(24,16,10,0.12)]"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[760px]">
          <Image
            src={mainImage}
            alt="Déco Hanini"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,14,9,0.88)_0%,rgba(24,14,9,0.62)_32%,rgba(24,14,9,0.18)_60%,rgba(24,14,9,0.04)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(121,87,58,0.18),transparent_35%)]" />

          <div className="relative z-10 flex h-full min-h-[620px] items-center px-5 py-10 sm:min-h-[680px] sm:px-8 lg:min-h-[760px] lg:px-12">
            <div className="max-w-[720px] text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-[#e6c18b]">
                {eyebrow}
              </p>
              <h1 className="font-display italic mt-5 max-w-2xl text-[clamp(3rem,6.4vw,5.6rem)] leading-[0.92] tracking-[-0.05em] text-white">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-8 text-white/90 sm:text-lg">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/boutique"
                  className="inline-flex items-center justify-center rounded-full bg-[#b98958] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#a97845]"
                >
                  {isArabic ? 'اكتشف المجموعة' : 'Découvrir la boutique'}
                </Link>
                <Link
                  href="#categories-section"
                  className="inline-flex items-center justify-center rounded-full border border-white/28 bg-white/8 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-colors hover:bg-white/14"
                >
                  {isArabic ? 'استعراض الفئات' : 'Explorer les catégories'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
