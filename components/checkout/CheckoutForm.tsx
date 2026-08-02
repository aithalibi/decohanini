'use client';

import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Banknote, CheckCircle2, MapPin, PackageCheck, Phone, ShieldCheck } from 'lucide-react';
import { createOrder, type CheckoutState } from '@/actions/orders';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { localizeCategoryName, localizeProductName, localizeVariantName } from '@/lib/catalog-i18n';
import { flattenCartItems } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

const initialState: CheckoutState = { success: false };
const cities = ['Agadir', 'Casablanca', 'Fès', 'Kénitra', 'Marrakech', 'Meknès', 'Mohammédia', 'Oujda', 'Rabat', 'Salé', 'Tanger', 'Tétouan', 'Autre ville'];
const fieldClass = 'h-12 w-full rounded-xl border border-brand-sand bg-brand-cream/60 px-4 text-sm text-brand-espresso outline-none transition-colors focus:border-brand-caramel';
const labelClass = 'mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-brand-brown';

export default function CheckoutForm({ defaultName = '' }: { defaultName?: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const [state, formAction, isPending] = useActionState(createOrder, initialState);
  const copy = isArabic ? {
    empty: 'لا توجد منتجات لإتمام الطلب',
    emptyDescription: 'أضف منتجاً إلى سلة التسوق أولاً.',
    backToShop: 'العودة إلى المتجر',
    lastStep: 'الخطوة الأخيرة',
    title: 'إتمام طلبي',
    paymentNotice: 'لا يوجد دفع إلكتروني. ستدفع عند استلام الطلب.',
    deliveryInfo: 'معلومات التوصيل',
    fullName: 'الاسم الكامل *',
    fullNamePlaceholder: 'الاسم والنسب',
    phone: 'رقم الهاتف *',
    city: 'المدينة *',
    chooseCity: 'اختر مدينة',
    otherCity: 'مدينة أخرى',
    address: 'العنوان الكامل *',
    addressPlaceholder: 'الحي، الشارع، الرقم، الشقة...',
    note: 'ملاحظة (اختياري)',
    notePlaceholder: 'تفاصيل إضافية للتوصيل',
    cashOnDelivery: 'الدفع عند الاستلام',
    cashDescription: 'ادفع نقداً عند استلام طلبك. لا نطلب أي بطاقة بنكية على الموقع.',
    yourOrder: 'طلبك',
    size: 'المقاس',
    color: 'اللون',
    subtotal: 'المجموع الفرعي',
    delivery: 'التوصيل',
    toConfirm: 'يؤكد عبر الهاتف',
    productsTotal: 'مجموع المنتجات',
    saving: 'جاري تسجيل الطلب...',
    confirm: 'تأكيد طلبي',
    confirmationNotice: 'عند التأكيد، سيصل طلبك إلى ديكو حنيني وسيتواصل معك فريقنا لتأكيد العنوان والتوصيل.',
  } : {
    empty: 'Aucun article à commander',
    emptyDescription: 'Ajoutez d’abord un produit à votre panier.',
    backToShop: 'Retour à la boutique',
    lastStep: 'Dernière étape',
    title: 'Finaliser ma commande',
    paymentNotice: 'Aucun paiement en ligne. Vous payez au moment de la livraison.',
    deliveryInfo: 'Informations de livraison',
    fullName: 'Nom complet *',
    fullNamePlaceholder: 'Votre nom et prénom',
    phone: 'Téléphone *',
    city: 'Ville *',
    chooseCity: 'Choisir une ville',
    otherCity: 'Autre ville',
    address: 'Adresse complète *',
    addressPlaceholder: 'Quartier, rue, numéro, appartement...',
    note: 'Note (facultatif)',
    notePlaceholder: 'Précisions pour la livraison',
    cashOnDelivery: 'Paiement à la livraison',
    cashDescription: 'Payez en espèces à la réception de votre colis. Aucune carte bancaire n’est demandée sur le site.',
    yourOrder: 'Votre commande',
    size: 'Taille',
    color: 'Couleur',
    subtotal: 'Sous-total',
    delivery: 'Livraison',
    toConfirm: 'À confirmer',
    productsTotal: 'Total produits',
    saving: 'Enregistrement...',
    confirm: 'Confirmer ma commande',
    confirmationNotice: 'En confirmant, votre commande est envoyée à Déco Hanini. Notre équipe vous contactera pour confirmer la livraison.',
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (state.success && state.orderNumber) {
      clearCart();
      router.push(`/commande/confirmee?numero=${encodeURIComponent(state.orderNumber)}`);
    }
  }, [state, clearCart, router]);

  if (!mounted) return <div className="min-h-[520px] animate-pulse bg-brand-light-gray" />;
  if (items.length === 0 && !state.success) {
    return (
      <div className="container mx-auto flex min-h-[520px] flex-col items-center justify-center px-4 text-center">
        <PackageCheck size={52} className="mb-5 text-brand-taupe" />
        <h1 className="font-serif text-3xl">{copy.empty}</h1>
        <p className="mt-2 text-sm text-brand-gray-text">{copy.emptyDescription}</p>
        <Link href="/boutique" className="mt-7 rounded-full bg-brand-espresso px-7 py-3 text-xs font-bold uppercase tracking-wider text-brand-cream">{copy.backToShop}</Link>
      </div>
    );
  }

  const checkoutItems = flattenCartItems(items);
  const subtotal = checkoutItems.reduce((total, item) => {
    const sourceItem = items.find((entry) => Number(entry.product.id) === item.productId && Number(entry.variant?.id ?? 0) === Number(item.variantId ?? 0));
    const unitPrice = sourceItem?.variant?.price ?? sourceItem?.product.price ?? 0;
    return total + unitPrice * item.quantity;
  }, 0);
  const serializedItems = JSON.stringify(checkoutItems);

  return (
    <section dir={isArabic ? 'rtl' : 'ltr'} className="bg-brand-light-gray py-8 sm:py-10 lg:py-14">
      <div className="container mx-auto px-3 sm:px-5 lg:px-8">
        <div className="mb-7 text-center sm:mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel">{copy.lastStep}</p>
          <h1 className="mt-2 font-serif text-2xl md:text-4xl">{copy.title}</h1>
          <p className="mt-2 text-sm text-brand-gray-text">{copy.paymentNotice}</p>
        </div>
        <form action={formAction} className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_430px] lg:gap-7">
          <input type="hidden" name="items" value={serializedItems} />
          <div className="space-y-4 sm:space-y-5">
            <div className="rounded-[22px] border border-brand-sand bg-brand-white p-4 sm:p-7">
              <div className="mb-5 flex items-center gap-3 sm:mb-6"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-caramel text-sm font-bold text-white">1</span><h2 className="font-serif text-lg sm:text-xl">{copy.deliveryInfo}</h2></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className={labelClass}>{copy.fullName}</span><input name="customerName" required autoComplete="name" defaultValue={defaultName} className={fieldClass} placeholder={copy.fullNamePlaceholder} /></label>
                <label><span className={labelClass}>{copy.phone}</span><div className="relative"><Phone size={17} className={`absolute top-1/2 -translate-y-1/2 text-brand-caramel ${isArabic ? 'right-4' : 'left-4'}`} /><input name="phone" required type="tel" autoComplete="tel" dir="ltr" className={`${fieldClass} ${isArabic ? 'pr-11 text-right' : 'pl-11'}`} placeholder="06 00 00 00 00" /></div></label>
                <label><span className={labelClass}>{copy.city}</span><select name="city" required defaultValue="" className={fieldClass}><option value="" disabled>{copy.chooseCity}</option>{cities.map((city) => <option key={city} value={city}>{city === 'Autre ville' ? copy.otherCity : city}</option>)}</select></label>
                <label className="sm:col-span-2"><span className={labelClass}>{copy.address}</span><div className="relative"><MapPin size={17} className={`absolute top-4 text-brand-caramel ${isArabic ? 'right-4' : 'left-4'}`} /><textarea name="address" required autoComplete="street-address" rows={3} className={`w-full resize-none rounded-xl border border-brand-sand bg-brand-cream/60 py-3 text-sm outline-none focus:border-brand-caramel ${isArabic ? 'pl-4 pr-11' : 'pl-11 pr-4'}`} placeholder={copy.addressPlaceholder} /></div></label>
                <label className="sm:col-span-2"><span className={labelClass}>{copy.note}</span><textarea name="notes" rows={2} className="w-full resize-none rounded-xl border border-brand-sand bg-brand-cream/60 p-4 text-sm outline-none focus:border-brand-caramel" placeholder={copy.notePlaceholder} /></label>
              </div>
            </div>
            <div className="rounded-[22px] border-2 border-brand-taupe bg-brand-beige p-4 sm:p-7">
              <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-caramel"><Banknote size={24} /></span><div><div className="flex items-center gap-2"><h2 className="font-bold">{copy.cashOnDelivery}</h2><CheckCircle2 size={17} className="text-green-700" /></div><p className="mt-1 text-sm leading-6 text-brand-gray-text">{copy.cashDescription}</p></div></div>
            </div>
          </div>

          <aside className="h-fit rounded-[22px] border border-brand-sand bg-brand-white p-4 sm:p-6 lg:sticky lg:top-5">
            <h2 className="border-b border-brand-sand pb-4 font-serif text-lg sm:text-xl">{copy.yourOrder}</h2>
            <div className="max-h-[280px] space-y-4 overflow-y-auto py-4 sm:max-h-[310px] sm:py-5">
              {checkoutItems.map((item) => {
                const sourceItem = items.find((entry) => Number(entry.product.id) === item.productId && Number(entry.variant?.id ?? 0) === Number(item.variantId ?? 0));
                return (
                <div key={`${item.productId}-${item.variantId ?? 'simple'}-${item.color ?? 'default'}`} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-beige">{sourceItem?.product.image && <Image src={sourceItem.product.image} alt={localizeProductName(sourceItem.product.slug, sourceItem.product.name, language)} fill sizes="64px" className="object-cover" />}<span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-brand-espresso px-1 text-[9px] font-bold text-white">{item.quantity}</span></div>
                  <div className="min-w-0 flex-1"><p className="line-clamp-2 text-xs font-semibold leading-5">{sourceItem ? localizeProductName(sourceItem.product.slug, sourceItem.product.name, language) : ''}</p><p className="mt-1 text-xs text-brand-gray-text">{sourceItem?.variant ? `${copy.size}: ${localizeVariantName(sourceItem.variant.name, language)}` : item.color ? `${copy.color}: ${localizeVariantName(item.color, language)}` : sourceItem ? localizeCategoryName(sourceItem.product.categorySlug, sourceItem.product.category, language) : ''}</p></div>
                  <strong className="shrink-0 text-xs">{formatPrice((sourceItem?.variant?.price ?? sourceItem?.product.price ?? 0) * item.quantity)}</strong>
                </div>
                );
              })}
            </div>
            <div className="space-y-3 border-y border-brand-sand py-4 text-sm sm:py-5"><div className="flex justify-between"><span>{copy.subtotal}</span><strong>{formatPrice(subtotal)}</strong></div><div className="flex justify-between"><span>{copy.delivery}</span><span className="text-brand-gray-text">{copy.toConfirm}</span></div></div>
            <div className="flex items-center justify-between py-5 text-base sm:py-6 sm:text-lg"><strong>{copy.productsTotal}</strong><strong className="text-brand-brown">{formatPrice(subtotal)}</strong></div>
            {state.error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">{state.error}</p>}
            <button type="submit" disabled={isPending} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-espresso px-4 text-xs font-bold uppercase tracking-[0.12em] text-brand-cream transition-colors hover:bg-brand-brown disabled:cursor-wait disabled:opacity-60">
              {isPending ? copy.saving : copy.confirm}
            </button>
            <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-brand-gray-text"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-green-700" />{copy.confirmationNotice}</p>
          </aside>
        </form>
      </div>
    </section>
  );
}
