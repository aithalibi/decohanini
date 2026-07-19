import Link from 'next/link';
import { Check, MessageCircle, PackageCheck } from 'lucide-react';
import { LocalizedText } from '@/components/i18n/LocalizedText';

export default async function OrderConfirmedPage({ searchParams }: PageProps<'/commande/confirmee'>) {
  const { numero } = await searchParams;
  const orderNumber = typeof numero === 'string' ? numero : '';

  return (
    <section className="container mx-auto flex min-h-[620px] items-center justify-center px-4 py-14">
      <div className="w-full max-w-2xl rounded-[28px] border border-brand-sand bg-brand-white p-7 text-center shadow-[0_20px_60px_rgba(68,47,35,0.12)] sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-sand text-brand-brown"><Check size={38} /></div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel"><LocalizedText fr="Commande enregistrée" ar="تم تسجيل الطلب" /></p>
        <h1 className="mt-3 font-serif text-3xl md:text-4xl"><LocalizedText fr="Merci pour votre commande" ar="شكراً لطلبك" /></h1>
        {orderNumber && <p className="mx-auto mt-5 w-fit rounded-xl border border-dashed border-brand-taupe bg-brand-cream px-5 py-3 text-sm"><LocalizedText fr="Référence :" ar="رقم الطلب:" /> <strong>{orderNumber}</strong></p>}
        <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-brand-gray-text"><LocalizedText fr="Votre commande apparaît maintenant dans notre panneau d’administration. Notre équipe vous appellera pour confirmer l’adresse et la livraison. Le paiement se fera à la réception." ar="ظهر طلبك الآن في لوحة الإدارة. سيتصل بك فريقنا لتأكيد العنوان والتوصيل، وسيتم الدفع عند الاستلام." /></p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-2xl bg-brand-beige p-4 text-start text-xs"><PackageCheck size={24} className="shrink-0 text-brand-caramel" /><span><strong className="block text-sm"><LocalizedText fr="Préparation" ar="تحضير الطلب" /></strong><LocalizedText fr="Après confirmation téléphonique" ar="بعد التأكيد عبر الهاتف" /></span></div><div className="flex items-center gap-3 rounded-2xl bg-brand-beige p-4 text-start text-xs"><MessageCircle size={24} className="shrink-0 text-brand-caramel" /><span><strong className="block text-sm"><LocalizedText fr="Besoin d’aide ?" ar="هل تحتاج المساعدة؟" /></strong><LocalizedText fr="Contactez-nous sur WhatsApp" ar="تواصل معنا عبر واتساب" /></span></div></div>
        <Link href="/boutique" className="mt-8 inline-flex rounded-full bg-brand-espresso px-8 py-3 text-xs font-bold uppercase tracking-wider text-brand-cream"><LocalizedText fr="Continuer mes achats" ar="متابعة التسوق" /></Link>
      </div>
    </section>
  );
}
