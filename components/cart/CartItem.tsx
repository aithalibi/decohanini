'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartColorSelection, CartItem as CartItemType } from '@/types/cart';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { localizeCategoryName, localizeProductName, localizeVariantName } from '@/lib/catalog-i18n';
import { formatPrice } from '@/lib/utils';
import { getColorSwatchStyle, isLightColor, normalizeColorKey } from '@/lib/color-swatches';

export default function CartItem({ item }: { item: CartItemType }) {
  const { product, variant } = item;
  const unitPrice = variant?.price ?? product.price;
  const productId = product.id;
  const variantId = variant?.id;
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const localizedName = localizeProductName(product.slug, product.name, language);
  const localizedCategory = localizeCategoryName(product.categorySlug, product.category, language);
  const colorOptions = !variant ? product.colors ?? [] : [];
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const addColorSelection = useCartStore((state) => state.addColorSelection);
  const updateColorSelectionQuantity = useCartStore((state) => state.updateColorSelectionQuantity);
  const removeColorSelection = useCartStore((state) => state.removeColorSelection);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorSelections: CartColorSelection[] = (() => {
    if (Array.isArray(item.colorSelections) && item.colorSelections.length > 0) {
      return item.colorSelections;
    }

    if (item.color) {
      return [{ color: item.color, quantity: item.quantity }];
    }

    return [];
  })();

  const selectedColorKeys = new Set(colorSelections.map((selection) => normalizeColorKey(selection.color)));
  const availableColors = colorOptions.filter((color) => !selectedColorKeys.has(normalizeColorKey(color)));

  return (
    <div className="border-b border-brand-sand py-4 last:border-b-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-beige sm:h-20 sm:w-20">
          {product.image ? (
            <Image src={product.image} alt={localizedName} fill sizes="80px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[9px] text-brand-gray-text">
              {isArabic ? 'لا توجد صورة' : 'Pas d’image'}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-brand-caramel">{localizedCategory}</span>
              <h4 className="mt-0.5 line-clamp-1 font-serif text-sm text-brand-espresso">{localizedName}</h4>
              {variant && (
                <p className="mt-0.5 text-[11px] text-brand-gray-text">
                  {isArabic ? 'الخيار' : 'Option'}: {localizeVariantName(variant.name, language)}
                </p>
              )}
            </div>
            <button onClick={() => removeItem(productId, variantId)} className="p-1 text-brand-gray-text hover:text-brand-caramel" aria-label="Supprimer le produit">
              <Trash2 size={16} />
            </button>
          </div>
          <p className="mt-1 text-sm font-bold text-brand-brown">{formatPrice(unitPrice)}</p>

          {colorSelections.length > 0 && !variant && (
            <div className="mt-3 space-y-2">
              {colorSelections.map((selection) => {
                const swatch = getColorSwatchStyle(selection.color);
                const isLight = isLightColor(selection.color);
                return (
                  <div key={selection.color} className="flex items-center gap-3 rounded-2xl border border-brand-sand bg-brand-cream p-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border"
                      style={{ background: swatch.background, borderColor: swatch.border ?? '#B38A5D' }}
                    >
                      <span className={`text-[10px] font-bold ${isLight ? 'text-brand-espresso' : 'text-white'}`}>
                        {localizeVariantName(selection.color, language).slice(0, 2)}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand-espresso">{localizeVariantName(selection.color, language)}</p>
                      <p className="text-[11px] text-brand-gray-text">{isArabic ? 'الكمية' : 'Quantité'}: {selection.quantity}</p>
                    </div>
                    <div className="flex items-center rounded-full border border-brand-taupe bg-brand-white">
                      <button
                        type="button"
                        onClick={() => updateColorSelectionQuantity(productId, selection.color, Math.max(1, selection.quantity - 1), variantId)}
                        className="p-1.5"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-2 text-xs font-semibold">{selection.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateColorSelectionQuantity(productId, selection.color, selection.quantity + 1, variantId)}
                        className="p-1.5"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColorSelection(productId, selection.color, variantId)}
                      className="p-1 text-brand-gray-text hover:text-brand-caramel"
                      aria-label="Supprimer la couleur"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {colorOptions.length > 0 && !variant && availableColors.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowColorPicker((open) => !open)}
                className="rounded-full border border-brand-taupe bg-brand-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-brown"
              >
                {isArabic ? 'إضافة لون آخر' : 'Ajouter une couleur'}
              </button>
              {showColorPicker && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const swatch = getColorSwatchStyle(color);
                    const isLight = isLightColor(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          addColorSelection(productId, color, variantId, 1);
                          setShowColorPicker(false);
                        }}
                        className="flex items-center gap-2 rounded-full border border-brand-sand bg-brand-cream px-3 py-2 text-left text-[11px] font-semibold text-brand-brown"
                      >
                        <span className="grid h-5 w-5 place-items-center overflow-hidden rounded-full border" style={{ background: swatch.background, borderColor: swatch.border ?? '#B38A5D' }}>
                          <span className={`text-[8px] font-bold ${isLight ? 'text-brand-espresso' : 'text-white'}`}>
                            {localizeVariantName(color, language).slice(0, 1)}
                          </span>
                        </span>
                        <span>{localizeVariantName(color, language)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!colorSelections.length && !variant && colorOptions.length === 0 && (
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex items-center rounded-full border border-brand-taupe bg-brand-white">
                <button onClick={() => updateQuantity(productId, item.quantity - 1, variantId)} className="p-1.5" aria-label="Diminuer la quantité">
                  <Minus size={13} />
                </button>
                <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(productId, item.quantity + 1, variantId)} className="p-1.5" aria-label="Augmenter la quantité">
                  <Plus size={13} />
                </button>
              </div>
            </div>
          )}

          {variant && (
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex items-center rounded-full border border-brand-taupe bg-brand-white">
                <button onClick={() => updateQuantity(productId, item.quantity - 1, variantId, item.color)} className="p-1.5" aria-label="Diminuer la quantité">
                  <Minus size={13} />
                </button>
                <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(productId, item.quantity + 1, variantId, item.color)} className="p-1.5" aria-label="Augmenter la quantité">
                  <Plus size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!variant && !colorSelections.length && colorOptions.length > 0 && (
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-full border border-brand-taupe bg-brand-white">
            <button onClick={() => updateQuantity(productId, item.quantity - 1, variantId)} className="p-1.5" aria-label="Diminuer la quantité">
              <Minus size={13} />
            </button>
            <span className="px-2 text-xs font-semibold">{item.quantity}</span>
            <button onClick={() => updateQuantity(productId, item.quantity + 1, variantId)} className="p-1.5" aria-label="Augmenter la quantité">
              <Plus size={13} />
            </button>
          </div>
          <button onClick={() => removeItem(productId, variantId)} className="p-1 text-brand-gray-text hover:text-brand-caramel" aria-label="Supprimer le produit">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
