'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/store/language-store';
import { localizeCategoryName } from '@/lib/catalog-i18n';
import type { Category } from '@/types/product';

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  return (
    <section id="categories-section" className="w-full bg-[linear-gradient(180deg,#fffdfa_0%,#f8f2e9_100%)] py-6 md:py-8">
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 lg:px-6">
        <div className="mx-auto mb-5 max-w-xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-brand-caramel">
            {isArabic ? 'عوالم الديكور' : 'Collections'}
          </p>
          <h2 className="font-display italic mt-3 text-[clamp(2rem,3.8vw,3.3rem)] leading-none text-brand-espresso">
            {isArabic ? 'عوالم ديكور' : 'Nos univers deco'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => {
            const visual = category.image;

            return (
              <Link key={category.id} href={`/categorie/${category.slug}`} className="group">
                <article className="overflow-hidden bg-white transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="relative aspect-[4/5]">
                    {visual ? (
                      <Image
                        src={visual}
                        alt={localizeCategoryName(category.slug, category.name, language)}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-brand-beige text-sm text-brand-brown">
                        {isArabic ? 'أضف صورة' : 'Photo a ajouter'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.02)_0%,rgba(12,8,6,0.08)_75%,rgba(12,8,6,0.22)_100%)]" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/88 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-brown backdrop-blur-md">
                      {localizeCategoryName(category.slug, category.name, language)}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
