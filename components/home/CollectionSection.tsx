'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

export default function CollectionSection() {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  return (
    <section className="w-full bg-[linear-gradient(180deg,#fffdfa_0%,#f4ecdf_100%)] py-6 md:py-8">
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 lg:px-6">
        <div className="grid min-h-[420px] overflow-hidden bg-white lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex items-center px-6 py-10 sm:px-10 lg:px-12">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-brand-caramel">
                {isArabic ? 'مجموعة تحريرية' : 'Collection editoriale'}
              </p>
              <h2 className="font-display italic mt-4 max-w-md text-[clamp(2rem,4vw,3rem)] leading-[0.96] text-brand-espresso">
                {isArabic ? 'قطعة قوية، بلا ازدحام' : 'Une piece forte, sans surcharge'}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-brand-gray-text">
                {isArabic
                  ? 'صورة واحدة واضحة، رسالة واحدة بسيطة، وحضور راقٍ يترك الصفحة تتنفس.'
                  : 'Une image claire, un message simple et une presence elegante qui laisse respirer la page.'}
              </p>
              <Link
                href="/boutique"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-espresso px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-cream transition-colors hover:bg-brand-brown"
              >
                {isArabic ? 'عرض المجموعة' : 'Voir la selection'}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-[420px]">
            <Image
              src="/images/hero/collection-editorial.png"
              alt={isArabic ? 'مجموعة تحريرية' : 'Collection editoriale'}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,13,10,0.08)_0%,rgba(20,13,10,0.16)_100%)]" />
            <div className="absolute bottom-5 left-5 max-w-xs rounded-[22px] bg-black/22 px-4 py-4 text-white backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.22em] text-brand-sand/90">
                {isArabic ? 'اختيار اليوم' : 'Selection du jour'}
              </p>
              <p className="font-display italic mt-2 text-[1.7rem] leading-tight">
                {isArabic ? 'اناقة هادئة تترك الاثر' : 'Une elegance calme qui marque'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
