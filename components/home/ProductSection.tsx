'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import type { Product } from '@/types/product';

interface ProductSectionProps {
  products: Product[];
}

export default function ProductSection({ products }: ProductSectionProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const featured = products.filter((product) => product.isFeatured);
  const fallback = products.filter((product) => !product.isFeatured);
  const source = featured.length > 0 ? featured : fallback;
  const displayedProducts = source.slice(0, 4);

  return (
    <section id="best-sellers-section" className="w-full bg-[linear-gradient(180deg,#f5ecdf_0%,#fffdfa_100%)] py-6 md:py-8">
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 lg:px-6">
        <div className="mx-auto mb-5 max-w-xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-brand-caramel">
            {language === 'AR' ? 'اختياراتنا' : 'Sélection boutique'}
          </p>
          <h2 className="font-display italic mt-3 text-[clamp(2rem,3.8vw,3.3rem)] leading-none text-brand-espresso">
            {language === 'AR' ? 'قطع مميزة مختارة لك' : 'Nos pièces phares'}
          </h2>
        </div>

        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-brand-taupe py-14 text-center text-sm text-brand-gray-text">
            {t.noProducts}
          </p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-3 rounded-full border border-brand-brown px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-brown transition-colors hover:bg-brand-brown hover:text-white"
          >
            {t.viewAllProducts}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
