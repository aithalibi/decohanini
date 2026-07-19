import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import CustomerLoginView from '@/components/auth/CustomerLoginView';

export const metadata = { title: 'Connexion client | Déco Hanini' };

export default async function CustomerLoginPage({ searchParams }: PageProps<'/connexion'>) {
  const session = await auth();
  if (session?.user?.role === 'ADMIN') redirect('/admin');
  if (session?.user) redirect('/account');

  const params = await searchParams;
  const requestedCallback = typeof params.callbackUrl === 'string' ? params.callbackUrl : '/account';
  const callbackUrl = requestedCallback.startsWith('/') && !requestedCallback.startsWith('//') ? requestedCallback : '/account';

  return <CustomerLoginView callbackUrl={callbackUrl} />;
}
