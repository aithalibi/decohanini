'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import { localizeCategoryName } from '@/lib/catalog-i18n';
import type { Category } from '@/types/product';

export default function Categories({ categories }: { categories: Category[] }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  return (
    <section id="categories-section" className="w-full bg-brand-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-9 text-center">
          <h2 className="text-xl font-bold uppercase tracking-[0.08em] text-brand-espresso md:text-2xl">{t.ourCategories}</h2>
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-brand-caramel" />
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-5">
          {categories.slice(0, 5).map((category) => (
            <Link key={category.id} href={`/categorie/${category.slug}`} className="group min-w-0 text-center">
              <div className="relative mx-auto aspect-square w-full max-w-[190px] overflow-hidden rounded-full bg-brand-sand ring-1 ring-brand-sand transition-shadow duration-300 group-hover:shadow-[0_15px_35px_rgba(68,47,35,0.16)]">
                {category.image ? <Image src={category.image} alt={localizeCategoryName(category.slug, category.name, language)} fill sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 190px" className="object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-xs text-brand-brown">{language === 'AR' ? 'ستضاف الصورة قريباً' : 'Photo à ajouter'}</div>}
              </div>
              <h3 className="mt-4 truncate text-[10px] font-bold uppercase tracking-[0.08em] text-brand-espresso sm:text-xs">{localizeCategoryName(category.slug, category.name, language)}</h3>
              <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-[0.16em] text-brand-caramel">{t.viewMore}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
