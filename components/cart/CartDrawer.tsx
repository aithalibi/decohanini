'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import CartItem from './CartItem';
import { formatPrice } from '@/lib/utils';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const [isMounted, setIsMounted] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isMounted) return null;
  const totalItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.variant?.price ?? item.product.price) * item.quantity, 0);

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-brand-espresso/65 transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => toggleCart(false)} />
      <div className={`fixed right-0 top-0 z-50 flex h-full w-full transform flex-col bg-brand-cream shadow-2xl transition-transform duration-300 ease-in-out sm:w-[450px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} dir={language === 'AR' ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between border-b border-brand-sand p-3 sm:p-5">
          <div className="flex min-w-0 items-center gap-2"><ShoppingBag size={18} className="shrink-0 text-brand-caramel" /><h3 className="truncate font-serif text-lg text-brand-espresso sm:text-xl">{t.myCart} ({totalItemsCount})</h3></div>
          <button onClick={() => toggleCart(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-sand/60 text-brand-espresso" aria-label="Fermer le panier"><X size={18} /></button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-3 sm:p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-5 text-center">
              <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-brand-sand"><ShoppingBag size={30} className="text-brand-brown" /></span>
              <h4 className="font-serif text-xl text-brand-espresso sm:text-2xl">{t.emptyCart}</h4>
              <p className="mt-2 text-sm text-brand-gray-text">{t.emptyCartDesc}</p>
              <button onClick={() => toggleCart(false)} className="mt-6 rounded-full bg-brand-espresso px-5 py-3 text-xs font-bold uppercase tracking-wider text-brand-cream">{t.continueShopping}</button>
            </div>
          ) : (
            <div className="flex flex-col">{items.map((item) => <CartItem key={`${item.product.id}-${item.variant?.id ?? item.color ?? 'simple'}`} item={item} />)}</div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-brand-sand bg-brand-beige p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between text-sm"><span>{t.totalItems}</span><strong>{totalItemsCount}</strong></div>
            <div className="mb-4 flex items-center justify-between"><strong>{t.subtotal}</strong><strong className="text-lg text-brand-brown">{formatPrice(subtotal)}</strong></div>
            <div className="flex flex-col gap-3">
              <Link href="/commande" onClick={() => toggleCart(false)} className="flex w-full items-center justify-center rounded-full bg-brand-espresso py-3 text-center text-xs font-bold uppercase tracking-wider text-brand-cream hover:bg-brand-brown">{t.checkoutWhatsapp}</Link>
              <Link href="/panier" onClick={() => toggleCart(false)} className="w-full rounded-full border border-brand-brown bg-brand-cream py-3 text-center text-xs font-bold uppercase tracking-wider text-brand-brown hover:bg-brand-sand">{t.viewCart}</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
