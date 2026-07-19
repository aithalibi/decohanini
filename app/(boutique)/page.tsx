import HomeClient from '@/components/home/HomeClient';
import { getSettings } from '@/actions/settings';
import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import { toStoreProduct } from '@/lib/storefront';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [settings, categories, products] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ isVisible: true }),
  ]);

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
