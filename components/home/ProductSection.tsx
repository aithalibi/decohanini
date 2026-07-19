'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import type { Product } from '@/types/product';

export default function ProductSection({ products }: { products: Product[] }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const featured = products.filter((product) => product.isFeatured);
  const prioritized = [...featured, ...products.filter((product) => !product.isFeatured)];
  const displayedProducts: Product[] = [];
  const selectedIds = new Set<string>();
  const selectedCategories = new Set<string>();

  // Diversify the home selection before filling any remaining slots.
  for (const product of prioritized) {
    const categoryKey = product.categorySlug || product.category;
    if (displayedProducts.length >= 4) break;
    if (selectedCategories.has(categoryKey)) continue;
    displayedProducts.push(product);
    selectedIds.add(product.id);
    selectedCategories.add(categoryKey);
  }

  for (const product of prioritized) {
    if (displayedProducts.length >= 4) break;
    if (selectedIds.has(product.id)) continue;
    displayedProducts.push(product);
    selectedIds.add(product.id);
  }

  return (
    <section id="products-section" className="w-full bg-brand-white pb-14 pt-8 md:pb-18 md:pt-10">
      <div className="container mx-auto px-3 sm:px-5 lg:px-10">
        <div className="mb-9 text-center">
          <h2 className="text-xl font-bold uppercase tracking-[0.08em] text-brand-espresso md:text-2xl">{t.popularProducts}</h2>
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-brand-caramel" />
        </div>

        {displayedProducts.length > 0 ? (
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
            {displayedProducts.map((product) => <ProductCard key={product.id} product={product} compact />)}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-brand-taupe py-14 text-center text-sm text-brand-gray-text">{t.noProducts}</p>
        )}
        <div className="mt-9 text-center">
          <Link href="/boutique" className="inline-flex items-center gap-3 border-b border-brand-brown pb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-brand-brown hover:text-brand-caramel">
            {t.viewAllProducts}<ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
