'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useFavoriteStore } from '@/store/favorite-store';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import type { Product } from '@/types/product';

export default function FavoritesClient({ products }: { products: Product[] }) {
  const [mounted, setMounted] = useState(false);
  const favorites = useFavoriteStore((state) => state.favorites);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!mounted) return <div className="min-h-[420px] animate-pulse bg-brand-light-gray" />;
  const savedProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <section className="bg-brand-cream py-10 md:py-14">
      <div className="container mx-auto px-3 sm:px-5 lg:px-8">
        <div className="mb-8 border-b border-brand-sand pb-5"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-caramel"><Heart size={14} />{t.yourSelection}</p><h1 className="mt-2 font-serif text-4xl">{t.myFavorites}</h1><p className="mt-2 text-sm text-brand-gray-text">{t.favoritesDescription}</p></div>
        {savedProducts.length > 0 ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-11 md:grid-cols-3 lg:grid-cols-4">{savedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-[24px] border border-dashed border-brand-taupe py-16 text-center"><Heart className="mx-auto text-brand-taupe" size={38} /><h2 className="mt-4 font-serif text-2xl">{t.noFavorites}</h2><Link href="/boutique" className="mt-6 inline-block rounded-full bg-brand-espresso px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-cream">{t.discoverShop}</Link></div>}
      </div>
    </section>
  );
}
