import type { Metadata } from 'next';
import CartPage from '@/components/cart/CartPage';
import { auth } from '@/lib/auth';

export const metadata: Metadata = { title: 'Mon panier | Déco Hanini' };

export default async function BasketPage() {
  const session = await auth();
  return <CartPage isAuthenticated={session?.user?.role === 'CUSTOMER'} />;
}
