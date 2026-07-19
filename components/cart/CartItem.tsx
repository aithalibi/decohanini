'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types/cart';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { localizeCategoryName, localizeProductName, localizeVariantName } from '@/lib/catalog-i18n';
import { formatPrice } from '@/lib/utils';

export default function CartItem({ item }: { item: CartItemType }) {
  const { product, variant, quantity } = item;
  const unitPrice = variant?.price ?? product.price;
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const localizedName = localizeProductName(product.slug, product.name, language);
  const localizedCategory = localizeCategoryName(product.categorySlug, product.category, language);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-3 border-b border-brand-sand py-4 sm:gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-beige">
        {product.image ? <Image src={product.image} alt={localizedName} fill sizes="80px" className="object-cover" /> : <div className="flex h-full items-center justify-center text-[9px] text-brand-gray-text">{isArabic ? 'لا توجد صورة' : 'Pas d’image'}</div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div><span className="text-[9px] font-bold uppercase tracking-[0.13em] text-brand-caramel">{localizedCategory}</span><h4 className="mt-0.5 line-clamp-1 font-serif text-sm text-brand-espresso">{localizedName}</h4>{variant && <p className="mt-0.5 text-[11px] text-brand-gray-text">{isArabic ? 'الخيار' : 'Option'}: {localizeVariantName(variant.name, language)}</p>}<p className="mt-1 text-sm font-bold text-brand-brown">{formatPrice(unitPrice)}</p></div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-brand-taupe bg-brand-white"><button onClick={() => updateQuantity(product.id, quantity - 1, variant?.id)} className="p-1.5" aria-label="Diminuer la quantité"><Minus size={13} /></button><span className="px-2 text-xs font-semibold">{quantity}</span><button onClick={() => updateQuantity(product.id, quantity + 1, variant?.id)} className="p-1.5" aria-label="Augmenter la quantité"><Plus size={13} /></button></div>
          <button onClick={() => removeItem(product.id, variant?.id)} className="p-1 text-brand-gray-text hover:text-brand-caramel" aria-label="Supprimer le produit"><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
}
