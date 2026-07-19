import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { auth } from '@/lib/auth';

export const metadata: Metadata = { title: 'Finaliser ma commande | Déco Hanini' };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect('/connexion?callbackUrl=/commande');
  if (session.user.role === 'ADMIN') redirect('/admin');
  return <CheckoutForm defaultName={session?.user?.name ?? ''} />;
}
