'use client';

import Hero from './Hero';
import Benefits from './Benefits';
import Categories from './Categories';
import ProductSection from './ProductSection';
import CollectionSection from './CollectionSection';
import type { SiteSettings, Category as PrismaCategory } from '@prisma/client';
import type { Product, Category } from '@/types/product';

interface HomeClientProps {
  settings: SiteSettings;
  categories: (PrismaCategory & { _count?: { products: number } })[];
  products: Product[];
}

export default function HomeClient({ settings, categories, products }: HomeClientProps) {
  const showcaseImages = [
    '/images/hero/hero-home-screen-v2.png',
    '/lookbook/lookbook-01.jpeg',
    '/lookbook/lookbook-02.jpeg',
    '/lookbook/lookbook-03.jpeg',
    '/lookbook/lookbook-04.jpeg',
    '/lookbook/lookbook-05.jpeg',
    '/lookbook/lookbook-06.jpeg',
    '/lookbook/lookbook-07.jpeg',
    '/lookbook/lookbook-08.jpeg',
    '/lookbook/lookbook-09.jpeg',
  ];

  const mappedCategories: Category[] = (categories ?? []).map((category) => ({
    id: String(category.id),
    name: category.name,
    image: category.imageUrl || null,
    slug: category.slug,
  }));

  return (
    <div className="flex min-h-screen w-full flex-col bg-brand-white">
      <Hero settings={settings} showcaseImages={showcaseImages.slice(0, 1)} />
      <Benefits />
      <Categories categories={mappedCategories} />
      <ProductSection products={products} />
      <CollectionSection />
    </div>
  );
}
