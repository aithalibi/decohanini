import HomeClient from '@/components/home/HomeClient';
import { getSettings } from '@/actions/settings';
import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import { toStoreProduct } from '@/lib/storefront';
import type { SiteSettings } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const fallbackSettings: SiteSettings = {
    id: 1,
    storeName: 'Déco Hanini',
    whatsappNumber: '212714516493',
    phone: null,
    email: null,
    address: null,
    heroTitle: null,
    heroSubtitle: null,
    heroImageUrl: null,
    instagramUrl: null,
    facebookUrl: null,
    deliveryText: null,
    paymentText: null,
    updatedAt: new Date(),
  };

  const [settingsResult, categoriesResult, productsResult] = await Promise.allSettled([
    getSettings(),
    getCategories(),
    getProducts({ isVisible: true }),
  ]);

  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : fallbackSettings;
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const products = productsResult.status === 'fulfilled' ? productsResult.value : [];

  const visibleCategories = categories.filter((category) => category.isVisible);
  const storeProducts = products.map(toStoreProduct);

  return (
    <HomeClient
      settings={settings}
      categories={visibleCategories}
      products={storeProducts}
    />
  );
}
