import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock3, PackageCheck } from 'lucide-react';
import { auth } from '@/lib/auth';
import { getCustomerOrderById } from '@/actions/orders';
import { formatPrice } from '@/lib/utils';
import { LocalizedProductName, LocalizedText, LocalizedVariantName } from '@/components/i18n/LocalizedText';

const statusLabels: Record<string, { fr: string; ar: string }> = {
  NEW: { fr: 'Commande reçue', ar: 'تم استلام الطلب' },
  CONFIRMED: { fr: 'Commande confirmée', ar: 'تم تأكيد الطلب' },
  PREPARING: { fr: 'En préparation', ar: 'قيد التحضير' },
  SHIPPED: { fr: 'Expédiée', ar: 'تم الشحن' },
  DELIVERED: { fr: 'Livrée', ar: 'تم التوصيل' },
  CANCELLED: { fr: 'Annulée', ar: 'ملغاة' },
};

export default async function CustomerOrderPage({ params }: PageProps<'/account/commandes/[id]'>) {
  const session = await auth();
  if (!session?.user) redirect('/connexion?callbackUrl=/account');
  const { id } = await params;
  const order = await getCustomerOrderById(Number(id));
  if (!order) notFound();

  return (
    <section className="bg-brand-cream py-10 md:py-14">
      <div className="container mx-auto max-w-4xl px-4">
        <Link href="/account" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-brown"><ArrowLeft size={16} /><LocalizedText fr="Retour à mon compte" ar="العودة إلى حسابي" /></Link>
        <div className="rounded-[26px] border border-brand-sand bg-brand-white p-5 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-brand-sand pb-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-caramel"><LocalizedText fr="Suivi de commande" ar="تتبع الطلب" /></p><h1 className="mt-2 font-serif text-3xl">#{order.orderNumber}</h1><p className="mt-1 text-xs text-brand-gray-text"><LocalizedText fr="Passée le" ar="تاريخ الطلب" /> {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p></div><span className="w-fit rounded-full bg-brand-beige px-4 py-2 text-xs font-bold text-brand-brown"><LocalizedText {...(statusLabels[order.status] ?? { fr: order.status, ar: order.status })} /></span></div>
          <div className="mt-6 space-y-3">{order.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-brand-cream p-4"><div><strong className="text-sm">{item.product ? <LocalizedProductName slug={item.product.slug} fallback={item.productName} /> : item.productName}</strong>{item.variantName && <p className="mt-1 text-xs text-brand-gray-text"><LocalizedText fr="Taille:" ar="المقاس:" /> <LocalizedVariantName name={item.variantName} /></p>}<p className="mt-1 text-xs text-brand-gray-text"><LocalizedText fr="Quantité:" ar="الكمية:" /> {item.quantity}</p></div><strong className="text-sm text-brand-brown">{formatPrice(Number(item.unitPrice) * item.quantity)}</strong></div>)}</div>
          <div className="mt-6 flex justify-between border-t border-brand-sand pt-5 text-lg"><strong><LocalizedText fr="Total" ar="المجموع" /></strong><strong className="text-brand-brown">{formatPrice(Number(order.total))}</strong></div>
          <div className="mt-8"><h2 className="font-serif text-xl"><LocalizedText fr="Progression" ar="مراحل الطلب" /></h2><div className="mt-4 space-y-4">{order.statusHistory.map((history, index) => <div key={history.id} className="flex gap-3"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-beige text-brand-caramel">{index === order.statusHistory.length - 1 ? <PackageCheck size={15} /> : <CheckCircle2 size={15} />}</span><div><p className="text-sm font-semibold"><LocalizedText {...(statusLabels[history.status] ?? { fr: history.status, ar: history.status })} /></p><p className="mt-0.5 text-xs text-brand-gray-text">{history.note || new Date(history.createdAt).toLocaleString('fr-FR')}</p></div></div>)}</div></div>
          <p className="mt-8 flex items-start gap-2 rounded-2xl bg-brand-beige p-4 text-xs leading-5 text-brand-gray-text"><Clock3 size={17} className="mt-0.5 shrink-0 text-brand-caramel" /><LocalizedText fr="Le paiement se fait uniquement à la livraison. Notre équipe vous contacte avant l’envoi." ar="يتم الدفع عند الاستلام فقط. سيتواصل معك فريقنا قبل إرسال الطلب." /></p>
        </div>
      </div>
    </section>
  );
}
