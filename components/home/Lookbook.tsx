'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

const lookbookItems = [
  { src: '/lookbook/lookbook-01.jpeg', fr: 'Art de la table', ar: 'أناقة المائدة', className: 'lg:col-span-5 lg:row-span-2' },
  { src: '/lookbook/lookbook-02.jpeg', fr: 'Mur signature', ar: 'لمسة جدارية', className: 'lg:col-span-4 lg:row-span-1' },
  { src: '/lookbook/lookbook-03.jpeg', fr: 'Elegance cachée', ar: 'أناقة مخفية', className: 'lg:col-span-3 lg:row-span-1' },
  { src: '/lookbook/lookbook-04.jpeg', fr: 'Detail premium', ar: 'تفاصيل فخمة', className: 'lg:col-span-3 lg:row-span-1' },
  { src: '/lookbook/lookbook-05.jpeg', fr: 'Texture chaude', ar: 'ملمس دافئ', className: 'lg:col-span-3 lg:row-span-1' },
  { src: '/lookbook/lookbook-06.jpeg', fr: 'Ligne signature', ar: 'خط مميز', className: 'lg:col-span-4 lg:row-span-1' },
  { src: '/lookbook/lookbook-07.jpeg', fr: 'Lumiere douce', ar: 'إضاءة ناعمة', className: 'lg:col-span-4 lg:row-span-1' },
  { src: '/lookbook/lookbook-08.jpeg', fr: 'Maison chic', ar: 'بيت أنيق', className: 'lg:col-span-3 lg:row-span-1' },
  { src: '/lookbook/lookbook-09.jpeg', fr: 'Style durable', ar: 'ستايل يدوم', className: 'lg:col-span-5 lg:row-span-1' },
];

export default function Lookbook() {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  return (
    <section className="bg-brand-white px-3 pb-12 pt-4 sm:px-5 lg:px-10">
      <div className="container mx-auto rounded-[30px] border border-brand-sand bg-brand-espresso px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-brand-sand/80">
              {isArabic ? 'كتالوج ملهم' : 'Catalogue inspire'}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
              {isArabic ? 'اختيارات ترفع مستوى الصفحة' : 'Une selection qui donne du relief'}
            </h2>
          </div>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
          >
            {isArabic ? 'رؤية الكتالوج' : 'Voir le catalogue'}
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:auto-rows-[220px] lg:grid-cols-12 lg:gap-4">
          {lookbookItems.map((item, index) => (
            <div key={item.src} className={`group relative overflow-hidden rounded-[24px] bg-[#1f1712] ${item.className}`}>
              <Image
                src={item.src}
                alt={isArabic ? item.ar : item.fr}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,11,8,0.12)_0%,rgba(17,11,8,0.55)_100%)]" />
              <div className="absolute left-0 top-0 p-3">
                <span className="inline-flex rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  0{index + 1}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-[10px] uppercase tracking-[0.22em] text-brand-sand/90">
                  {index % 2 === 0 ? (isArabic ? 'إلهام' : 'Inspiration') : (isArabic ? 'ديكور' : 'Decor')}
                </p>
                <h3 className="mt-1 max-w-[14ch] font-serif text-xl leading-tight">
                  {isArabic ? item.ar : item.fr}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
