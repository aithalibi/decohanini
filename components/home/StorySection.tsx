'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/store/language-store';

export default function StorySection() {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="container mx-auto px-3 sm:px-5 lg:px-10">
        <div className="grid gap-0 overflow-hidden rounded-[32px] border border-brand-sand bg-[linear-gradient(135deg,#fffdfa_0%,#f8f2e8_100%)] shadow-[0_18px_45px_rgba(45,34,27,0.06)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-6 sm:p-8 lg:p-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-brand-caramel">
              {isArabic ? 'قصتنا' : 'Notre histoire'}
            </p>
            <h2 className="font-display italic mt-4 max-w-md text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] text-brand-espresso">
              {isArabic ? 'ديكور يغيّر الشعور قبل أن يغيّر الشكل' : 'Le décor qui change l’atmosphère avant la forme'}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-brand-gray-text sm:text-base">
              {isArabic
                ? 'في Déco Hanini نختار القطع التي تضيف دفئاً، توازناً، ولمسة فنية حقيقية إلى المكان. هدفنا ليس فقط البيع، بل بناء عالم بصري يشعر بالهدوء والفخامة.'
                : 'Chez Déco Hanini, nous sélectionnons des pièces qui apportent chaleur, équilibre et une vraie présence visuelle. Notre objectif: créer un univers qui inspire le calme et la sophistication.'}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                isArabic ? 'توازن بصري' : 'Équilibre visuel',
                isArabic ? 'مواد جميلة' : 'Matières nobles',
                isArabic ? 'أسلوب خالد' : 'Style durable',
              ].map((item) => (
                <div key={item} className="rounded-full border border-brand-sand bg-white/70 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-brand-brown">
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/boutique"
              className="mt-8 inline-flex items-center rounded-full border border-brand-brown px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-brown transition-colors hover:bg-brand-brown hover:text-white"
            >
              {isArabic ? 'اكتشف المتجر' : 'Découvrir la boutique'}
            </Link>
          </div>

          <div className="relative min-h-[320px] bg-brand-espresso sm:min-h-[420px] lg:min-h-[560px]">
            <Image
              src="/lookbook/lookbook-06.jpeg"
              alt={isArabic ? 'زاوية ديكور أنيقة' : 'Coin décor élégant'}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,11,8,0.08)_0%,rgba(16,11,8,0.46)_100%)]" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/12 bg-black/25 p-5 text-white backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.22em] text-brand-sand/85">
                {isArabic ? 'اختيار منسق' : 'Sélection curatée'}
              </p>
              <p className="font-display italic mt-2 max-w-md text-2xl leading-tight">
                {isArabic ? 'كل صورة هنا تحكي عن بيت يبدو أكثر دفئاً وأكثر أناقة' : 'Chaque image ici raconte une maison plus chaleureuse et plus raffinée'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
