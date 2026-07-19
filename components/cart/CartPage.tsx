'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, ShoppingBag, Truck, UserRound } from 'lucide-react';
import CartItem from './CartItem';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { formatPrice } from '@/lib/utils';

export default function CartPage({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const copy = isArabic ? {
    empty: 'سلة التسوق فارغة', emptyDesc: 'اكتشف مجموعاتنا وأضف منتجاتك المفضلة.', discover: 'اكتشف المتجر', selection: 'اختياراتك', cart: 'سلتي', items: 'قطعة', summary: 'ملخص الطلب', subtotal: 'المجموع الفرعي', delivery: 'التوصيل', phoneConfirmation: 'يؤكد عبر الهاتف', total: 'المجموع', checkout: 'إتمام الطلب', accountRequired: 'يجب تسجيل الدخول', accountDesc: 'سجل الدخول أو أنشئ حساباً مجانياً لإتمام طلبك ومتابعته.', login: 'تسجيل الدخول', register: 'إنشاء حساب', cod: 'الدفع عند الاستلام فقط', deliveryMorocco: 'التوصيل إلى جميع مدن المغرب', continue: 'متابعة التسوق',
  } : {
    empty: 'Votre panier est vide', emptyDesc: 'Découvrez nos collections et ajoutez vos articles préférés.', discover: 'Découvrir la boutique', selection: 'Votre sélection', cart: 'Mon panier', items: 'article(s)', summary: 'Résumé de la commande', subtotal: 'Sous-total', delivery: 'Livraison', phoneConfirmation: 'Confirmée par téléphone', total: 'Total', checkout: 'Finaliser la commande', accountRequired: 'Un compte client est nécessaire', accountDesc: 'Connectez-vous ou créez gratuitement un compte pour terminer et suivre votre commande.', login: 'Connexion', register: 'Inscription', cod: 'Paiement à la livraison uniquement', deliveryMorocco: 'Livraison partout au Maroc', continue: 'Continuer mes achats',
  };
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return <div className="min-h-[420px] animate-pulse bg-brand-light-gray" />;
  const subtotal = items.reduce((total, item) => total + (item.variant?.price ?? item.product.price) * item.quantity, 0);
  if (items.length === 0) {
    return (
      <section className="container mx-auto flex min-h-[520px] flex-col items-center justify-center px-4 text-center">
        <span className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-brand-sand"><ShoppingBag size={36} className="text-brand-brown" /></span>
        <h1 className="font-serif text-3xl">{copy.empty}</h1>
        <p className="mt-2 text-sm text-brand-gray-text">{copy.emptyDesc}</p>
        <Link href="/boutique" className="mt-7 rounded-full bg-brand-espresso px-7 py-3 text-xs font-bold uppercase tracking-wider text-brand-cream">{copy.discover}</Link>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 lg:px-8 lg:py-14">
      <div className="mb-9 flex items-end justify-between border-b border-brand-sand pb-5">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel">{copy.selection}</p><h1 className="mt-2 font-serif text-3xl md:text-4xl">{copy.cart}</h1></div>
        <span className="text-xs text-brand-gray-text">{items.reduce((sum, item) => sum + item.quantity, 0)} {copy.items}</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_390px] lg:gap-8">
        <div className="rounded-[24px] border border-brand-sand bg-brand-white px-4 sm:px-6">{items.map((item) => <CartItem key={`${item.product.id}-${item.variant?.id ?? 'simple'}`} item={item} />)}</div>
        <aside className="h-fit rounded-[24px] bg-brand-beige p-6 lg:sticky lg:top-5">
          <h2 className="font-serif text-2xl">{copy.summary}</h2>
          <div className="mt-6 flex justify-between border-b border-brand-taupe/50 pb-5 text-sm"><span>{copy.subtotal}</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="flex justify-between border-b border-brand-taupe/50 py-5 text-sm"><span>{copy.delivery}</span><span>{copy.phoneConfirmation}</span></div>
          <div className="flex justify-between py-6 text-lg"><strong>{copy.total}</strong><strong className="text-brand-brown">{formatPrice(subtotal)}</strong></div>
          <Link href="/commande" className="flex h-12 items-center justify-center rounded-full bg-brand-espresso text-xs font-bold uppercase tracking-wider text-brand-cream hover:bg-brand-brown">{copy.checkout}</Link>
          {!isAuthenticated && <div className="mt-4 rounded-2xl border border-brand-taupe/60 bg-brand-cream p-4"><p className="flex items-center gap-2 text-xs font-bold text-brand-espresso"><UserRound size={17} className="text-brand-caramel" />{copy.accountRequired}</p><p className="mt-1.5 text-[11px] leading-5 text-brand-gray-text">{copy.accountDesc}</p><div className="mt-3 flex gap-2"><Link href="/connexion?callbackUrl=/commande" className="flex-1 rounded-full border border-brand-brown px-3 py-2 text-center text-[10px] font-bold text-brand-brown">{copy.login}</Link><Link href="/inscription?callbackUrl=/commande" className="flex-1 rounded-full bg-brand-caramel px-3 py-2 text-center text-[10px] font-bold text-white">{copy.register}</Link></div></div>}
          <div className="mt-5 space-y-3 text-xs text-brand-gray-text"><p className="flex items-center gap-2"><ShieldCheck size={17} className="text-brand-caramel" />{copy.cod}</p><p className="flex items-center gap-2"><Truck size={17} className="text-brand-caramel" />{copy.deliveryMorocco}</p></div>
        </aside>
      </div>
      <Link href="/boutique" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-brown hover:text-brand-caramel"><ArrowLeft size={16} />{copy.continue}</Link>
    </section>
  );
}
