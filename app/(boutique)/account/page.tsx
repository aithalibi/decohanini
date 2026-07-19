import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, PackageSearch, Sparkles, UserRound } from 'lucide-react';
import { auth } from '@/lib/auth';
import { getProducts } from '@/actions/products';
import { toStoreProduct } from '@/lib/storefront';
import ProductCard from '@/components/product/ProductCard';
import CustomerSignOutButton from '@/components/auth/CustomerSignOutButton';
import { getCustomerOrders } from '@/actions/orders';
import { formatPrice } from '@/lib/utils';
import { LocalizedText } from '@/components/i18n/LocalizedText';

export const metadata = { title: 'Mon compte | Déco Hanini' };

const orderStatusLabels: Record<string, { fr: string; ar: string }> = {
  NEW: { fr: 'À confirmer', ar: 'في انتظار التأكيد' },
  CONFIRMED: { fr: 'Confirmée', ar: 'تم التأكيد' },
  PREPARING: { fr: 'En préparation', ar: 'قيد التحضير' },
  SHIPPED: { fr: 'Expédiée', ar: 'تم الشحن' },
  DELIVERED: { fr: 'Livrée', ar: 'تم التوصيل' },
  CANCELLED: { fr: 'Annulée', ar: 'ملغاة' },
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect('/connexion?callbackUrl=/account');
  if (session.user.role === 'ADMIN') redirect('/admin');

  const [products, orders] = await Promise.all([
    getProducts({ isVisible: true }),
    getCustomerOrders(),
  ]);
  const markedAsNew = products.filter((product) => product.isNew);
  const newestProducts = (markedAsNew.length > 0 ? markedAsNew : products).slice(0, 4).map(toStoreProduct);
  const initial = (session.user.name || session.user.email || 'C').charAt(0).toUpperCase();

  return (
    <section className="bg-brand-cream py-10 md:py-16">
      <div className="container mx-auto px-3 sm:px-5 lg:px-8">
        <div className="warm-speckle flex flex-col gap-6 rounded-[28px] border border-brand-sand p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-brown font-serif text-2xl text-brand-cream">{initial}</span><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-caramel"><LocalizedText fr="Espace client" ar="فضاء الزبون" /></p><h1 className="mt-1 font-serif text-3xl text-brand-espresso"><LocalizedText fr="Bonjour" ar="مرحباً" /> {session.user.name || <LocalizedText fr="et bienvenue" ar="بك" />}</h1><p className="mt-1 text-sm text-brand-gray-text">{session.user.email}</p></div></div>
          <CustomerSignOutButton />
        </div>

        <div className="mt-10">
          <div className="mb-5 flex items-end justify-between border-b border-brand-sand pb-4">
            <div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-caramel"><PackageSearch size={14} /><LocalizedText fr="Suivi" ar="التتبع" /></p><h2 className="mt-2 font-serif text-3xl text-brand-espresso"><LocalizedText fr="Mes commandes" ar="طلباتي" /></h2></div>
            <span className="text-xs text-brand-gray-text">{orders.length} <LocalizedText fr="commande(s)" ar="طلب" /></span>
          </div>
          {orders.length > 0 ? (
            <div className="grid gap-3">
              {orders.map((order) => (
                <Link key={order.id} href={`/account/commandes/${order.id}`} className="flex flex-col gap-4 rounded-[20px] border border-brand-sand bg-brand-white p-4 transition-colors hover:border-brand-caramel sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-xs font-bold text-brand-espresso"><LocalizedText fr="Commande" ar="الطلب" /> #{order.orderNumber}</p><p className="mt-1 text-[11px] text-brand-gray-text">{new Date(order.createdAt).toLocaleDateString('fr-FR')} · {order.items.reduce((total, item) => total + item.quantity, 0)} <LocalizedText fr="article(s)" ar="منتج" /></p></div>
                  <div className="flex items-center justify-between gap-5 sm:justify-end"><span className="rounded-full bg-brand-beige px-3 py-1.5 text-[10px] font-bold uppercase text-brand-brown"><LocalizedText {...(orderStatusLabels[order.status] ?? { fr: order.status, ar: order.status })} /></span><strong className="text-sm text-brand-brown">{formatPrice(Number(order.total))}</strong><ChevronRight size={17} /></div>
                </Link>
              ))}
            </div>
          ) : <p className="rounded-[20px] border border-dashed border-brand-taupe py-10 text-center text-sm text-brand-gray-text"><LocalizedText fr="Vos prochaines commandes apparaîtront ici." ar="ستظهر طلباتك القادمة هنا." /></p>}
        </div>

        <div className="mt-12 flex items-end justify-between border-b border-brand-sand pb-5">
          <div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-caramel"><Sparkles size={14} /><LocalizedText fr="Sélection récente" ar="أحدث الاختيارات" /></p><h2 className="mt-2 font-serif text-3xl text-brand-espresso"><LocalizedText fr="Les nouveautés pour vous" ar="الجديد من أجلك" /></h2></div>
          <UserRound className="hidden text-brand-taupe sm:block" size={28} />
        </div>
        {newestProducts.length > 0 ? <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{newestProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="mt-7 rounded-[24px] border border-dashed border-brand-taupe py-14 text-center text-sm text-brand-gray-text"><LocalizedText fr="Les prochaines nouveautés apparaîtront ici." ar="ستظهر المنتجات الجديدة هنا قريباً." /></p>}
      </div>
    </section>
  );
}
