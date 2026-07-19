'use client';

import Hero from './Hero';
import Benefits from './Benefits';
import Categories from './Categories';
import ProductSection from './ProductSection';
import WhatsAppBanner from './WhatsAppBanner';
import type { SiteSettings, Category as PrismaCategory } from '@prisma/client';
import type { Product, Category } from '@/types/product';

interface HomeClientProps {
  settings: SiteSettings;
  categories: (PrismaCategory & { _count?: { products: number } })[];
  products: Product[];
}

export default function HomeClient({ settings, categories, products }: HomeClientProps) {
  const mappedCategories: Category[] = (categories ?? []).map((category) => ({
    id: String(category.id),
    name: category.name,
    image: category.imageUrl || null,
    slug: category.slug,
  }));

  return (
    <div className="flex min-h-screen w-full flex-col bg-brand-white">
      <Hero settings={settings} />
      <Benefits />
      <Categories categories={mappedCategories} />
      <ProductSection products={products} />
      <WhatsAppBanner settings={settings} />
    </div>
  );
}
