'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import { localizeCategoryName, localizeProductDescription, localizeProductName, localizeVariantName } from '@/lib/catalog-i18n';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/product';

type ProductDetailsProps = {
  product: Product;
  images: string[];
  description: string | null;
  dimensions: string | null;
  whatsappNumber: string;
};

export default function ProductDetails({ product, images, description, dimensions, whatsappNumber }: ProductDetailsProps) {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const isArabic = language === 'AR';
  const localizedName = localizeProductName(product.slug, product.name, language);
  const localizedCategory = localizeCategoryName(product.categorySlug, product.category, language);
  const localizedDescription = localizeProductDescription(product.slug, description || product.shortDescription, language);
  const localizedDimensions = isArabic ? dimensions?.replace('Hauteur:', 'الارتفاع:').replace('Grande + moyenne + petite', 'كبير + متوسط + صغير') : dimensions;
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(() => product.variants?.find((variant) => variant.stock > 0)?.id ?? product.variants?.[0]?.id ?? '');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId);
  const activePrice = selectedVariant?.price ?? product.price;
  const activeOldPrice = selectedVariant?.oldPrice ?? product.oldPrice;
  const availableStock = selectedVariant?.stock ?? product.stock ?? 0;
  const isOutOfStock = availableStock <= 0;
  const isPriceOnRequest = activePrice <= 0;
  const whatsappMessage = isArabic ? `السلام عليكم، أريد معرفة ثمن ${localizedName}.` : `Bonjour, je souhaite connaître le prix de ${localizedName}.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '') || '212777422673'}?text=${encodeURIComponent(whatsappMessage)}`;

  const addToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };
  const orderNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    router.push('/commande');
  };

  return (
    <div className="grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
      <div className="grid gap-3 sm:grid-cols-[82px_1fr]">
        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
          {images.map((image) => (
            <button key={image} type="button" onClick={() => setSelectedImage(image)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-brand-beige ${selectedImage === image ? 'border-brand-caramel' : 'border-transparent'}`}>
              <Image src={image} alt={localizedName} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="relative order-1 aspect-square overflow-hidden rounded-[24px] bg-brand-beige sm:order-2 md:rounded-[30px]">
          {selectedImage ? <Image src={selectedImage} alt={localizedName} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-brand-gray-text">{isArabic ? 'الصورة متوفرة قريباً' : 'Photo bientôt disponible'}</div>}
        </div>
      </div>

      <div className="py-2 lg:py-6">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel">{localizedCategory}</p>
        <h1 className="font-serif text-3xl leading-tight text-brand-espresso md:text-5xl">{localizedName}</h1>
        <div className="mt-5 flex items-baseline gap-3 border-b border-brand-sand pb-6">
          <span className="text-2xl font-bold text-brand-brown">{isPriceOnRequest ? t.priceOnRequest : formatPrice(activePrice)}</span>
          {!isPriceOnRequest && activeOldPrice && activeOldPrice > activePrice && <span className="text-base text-brand-gray-text line-through">{formatPrice(activeOldPrice)}</span>}
        </div>
        <p className="mt-6 text-sm leading-7 text-brand-gray-text">{localizedDescription}</p>
        {localizedDimensions && <div className="mt-5 border-y border-brand-sand py-4 text-sm"><span className="font-bold text-brand-espresso">{t.dimensionLabel} : </span><span className="text-brand-gray-text">{localizedDimensions}</span></div>}

        {product.variants && product.variants.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.12em] text-brand-brown">{t.chooseSize}</span><span className="text-xs text-brand-gray-text">{availableStock > 0 ? `${availableStock} ${t.inStock.toLocaleLowerCase(language === 'AR' ? 'ar' : 'fr-FR')}` : t.outOfStock}</span></div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button key={variant.id} type="button" disabled={variant.stock <= 0} onClick={() => { setSelectedVariantId(variant.id); setQuantity(1); }} className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors ${selectedVariantId === variant.id ? 'border-brand-espresso bg-brand-espresso text-brand-cream' : 'border-brand-taupe bg-brand-white text-brand-brown'} disabled:cursor-not-allowed disabled:opacity-40`}>
                  {localizeVariantName(variant.name, language)} · {variant.price <= 0 ? t.priceOnRequest : formatPrice(variant.price)}
                </button>
              ))}
            </div>
          </div>
        )}

        {(!product.variants || product.variants.length === 0) && <p className={`mt-5 text-xs font-semibold ${isOutOfStock ? 'text-red-700' : 'text-green-700'}`}>{isOutOfStock ? t.outOfStock : `${availableStock} ${t.inStock.toLocaleLowerCase(language === 'AR' ? 'ar' : 'fr-FR')}`}</p>}

        {isPriceOnRequest ? (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#159A55] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#117A44]">
            <MessageCircle size={18} /> {t.requestPriceWhatsapp}
          </a>
        ) : (
          <>
            <div className="mt-7 flex gap-2 sm:gap-3">
              <div className="flex h-12 shrink-0 items-center rounded-full border border-brand-taupe bg-brand-white">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-full px-3" aria-label="Diminuer la quantité"><Minus size={15} /></button>
                <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => Math.min(20, availableStock, value + 1))} className="h-full px-3" aria-label="Augmenter la quantité"><Plus size={15} /></button>
              </div>
              <button type="button" onClick={addToCart} disabled={isOutOfStock} className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-brand-caramel px-3 text-[9px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-45 sm:px-5 sm:text-xs">
                {added ? <Check size={17} /> : <ShoppingBag size={17} />}{added ? t.added : t.addToCart}
              </button>
            </div>
            <button type="button" onClick={orderNow} disabled={isOutOfStock} className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-brand-espresso px-5 text-xs font-bold uppercase tracking-[0.12em] text-brand-cream transition-colors hover:bg-brand-brown disabled:cursor-not-allowed disabled:opacity-45">{t.orderNow}</button>
          </>
        )}

        <div className="mt-7 grid gap-3 border-t border-brand-sand pt-6 text-xs text-brand-gray-text sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-brand-sand/45 p-3"><Truck className="text-brand-caramel" size={22} /><span><strong className="block text-brand-espresso">{t.deliveryMorocco}</strong>{t.deliveryTracking}</span></div>
          <div className="flex items-center gap-3 rounded-2xl bg-brand-sand/45 p-3"><ShieldCheck className="text-brand-caramel" size={22} /><span><strong className="block text-brand-espresso">{t.simplePayment}</strong>{t.codOnly}</span></div>
        </div>
      </div>
    </div>
  );
}
