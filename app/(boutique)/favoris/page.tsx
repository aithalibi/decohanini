import { getProducts } from '@/actions/products';
import FavoritesClient from '@/components/product/FavoritesClient';
import { toStoreProduct } from '@/lib/storefront';

export const metadata = { title: 'Mes favoris | Déco Hanini' };

export default async function FavoritesPage() {
  const products = await getProducts({ isVisible: true });
  return <FavoritesClient products={products.map(toStoreProduct)} />;
}
