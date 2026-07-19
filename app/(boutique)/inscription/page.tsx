import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import CustomerRegisterView from '@/components/auth/CustomerRegisterView';

export const metadata = { title: 'Créer un compte | Déco Hanini' };

export default async function CustomerRegisterPage({ searchParams }: PageProps<'/inscription'>) {
  const session = await auth();
  if (session?.user?.role === 'ADMIN') redirect('/admin');
  if (session?.user) redirect('/account');

  const params = await searchParams;
  const requestedCallback = typeof params.callbackUrl === 'string' ? params.callbackUrl : '/account';
  const callbackUrl = requestedCallback.startsWith('/') && !requestedCallback.startsWith('//') ? requestedCallback : '/account';
  return <CustomerRegisterView callbackUrl={callbackUrl} />;
}
