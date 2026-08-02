'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import { localizeCategoryName, localizeProductDescription, localizeProductName, localizeVariantName } from '@/lib/catalog-i18n';
import { getColorSwatchStyle, isLightColor } from '@/lib/color-swatches';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/product';

type ProductDetailsProps = {
  product: Product;
  images: string[];
  description: string | null;
  dimensions: string | null;
  whatsappNumber: string;
};

type GalleryItem = {
  key: string;
  url: string;
  label?: string;
  variantId?: string;
  price?: number;
};

type SwatchStyle = {
  background: string;
  border?: string;
  accent?: string;
};

const colorSwatches: Record<string, SwatchStyle> = {
  jaune: { background: 'linear-gradient(135deg, #F7D84C 0%, #DFAE00 100%)', border: '#D3A800', accent: '#6A5200' },
  rouge: { background: 'linear-gradient(135deg, #F26A6A 0%, #C62828 100%)', border: '#B91C1C' },
  gris: { background: 'linear-gradient(135deg, #D7D9DE 0%, #7E8693 100%)', border: '#7E8693' },
  gray: { background: 'linear-gradient(135deg, #D7D9DE 0%, #7E8693 100%)', border: '#7E8693' },
  grey: { background: 'linear-gradient(135deg, #D7D9DE 0%, #7E8693 100%)', border: '#7E8693' },
  blanc: { background: 'linear-gradient(135deg, #FFFFFF 0%, #F0EADF 100%)', border: '#CBB89E', accent: '#8B6B4F' },
  blanche: { background: 'linear-gradient(135deg, #FFFFFF 0%, #F0EADF 100%)', border: '#CBB89E', accent: '#8B6B4F' },
  'blanc casse': { background: 'linear-gradient(135deg, #FBF7F0 0%, #E7D8C6 100%)', border: '#D7BE9A', accent: '#8B6B4F' },
  noir: { background: 'linear-gradient(135deg, #4B4B4B 0%, #151515 100%)', border: '#1D1D1D' },
  bleu: { background: 'linear-gradient(135deg, #7BAAF7 0%, #1E5FD7 100%)', border: '#1E5FD7' },
  'bleu marine': { background: 'linear-gradient(135deg, #6A82C7 0%, #122B5C 100%)', border: '#122B5C' },
  'bleu royal': { background: 'linear-gradient(135deg, #79A8FF 0%, #1F53D1 100%)', border: '#1F53D1' },
  vert: { background: 'linear-gradient(135deg, #8FD3A8 0%, #2F8F57 100%)', border: '#2F8F57' },
  verte: { background: 'linear-gradient(135deg, #8FD3A8 0%, #2F8F57 100%)', border: '#2F8F57' },
  beige: { background: 'linear-gradient(135deg, #F1E3CC 0%, #C9AC84 100%)', border: '#B08C5A' },
  marron: { background: 'linear-gradient(135deg, #BA8B64 0%, #6F482F 100%)', border: '#6F482F' },
  bordeaux: { background: 'linear-gradient(135deg, #D97A89 0%, #7A1730 100%)', border: '#7A1730' },
  orange: { background: 'linear-gradient(135deg, #F8C57A 0%, #ED7A24 100%)', border: '#ED7A24' },
  rose: { background: 'linear-gradient(135deg, #FFB8CF 0%, #E75B8B 100%)', border: '#E75B8B' },
  'rose fuchsia': { background: 'linear-gradient(135deg, #FF96C8 0%, #D93BAA 100%)', border: '#D93BAA' },
  mauve: { background: 'linear-gradient(135deg, #D3A7F2 0%, #8B4FD6 100%)', border: '#8B4FD6' },
  'mauve clair': { background: 'linear-gradient(135deg, #E3D0FA 0%, #B78BE9 100%)', border: '#B78BE9' },
  'bleu clair': { background: 'linear-gradient(135deg, #B8D7FF 0%, #6EA5F2 100%)', border: '#6EA5F2' },
  'أصفر': { background: 'linear-gradient(135deg, #F7D84C 0%, #DFAE00 100%)', border: '#D3A800', accent: '#6A5200' },
  'أحمر': { background: 'linear-gradient(135deg, #F26A6A 0%, #C62828 100%)', border: '#B91C1C' },
  'رمادي': { background: 'linear-gradient(135deg, #D7D9DE 0%, #7E8693 100%)', border: '#7E8693' },
  'أبيض': { background: 'linear-gradient(135deg, #FFFFFF 0%, #F0EADF 100%)', border: '#CBB89E', accent: '#8B6B4F' },
  'أسود': { background: 'linear-gradient(135deg, #4B4B4B 0%, #151515 100%)', border: '#1D1D1D' },
  'أزرق': { background: 'linear-gradient(135deg, #7BAAF7 0%, #1E5FD7 100%)', border: '#1E5FD7' },
  'أخضر': { background: 'linear-gradient(135deg, #8FD3A8 0%, #2F8F57 100%)', border: '#2F8F57' },
  'بيج': { background: 'linear-gradient(135deg, #F1E3CC 0%, #C9AC84 100%)', border: '#B08C5A' },
  'بني': { background: 'linear-gradient(135deg, #BA8B64 0%, #6F482F 100%)', border: '#6F482F' },
  'وردي': { background: 'linear-gradient(135deg, #FFB8CF 0%, #E75B8B 100%)', border: '#E75B8B' },
  'بنفسجي': { background: 'linear-gradient(135deg, #D3A7F2 0%, #8B4FD6 100%)', border: '#8B4FD6' },
  'برتقالي': { background: 'linear-gradient(135deg, #F8C57A 0%, #ED7A24 100%)', border: '#ED7A24' },
  'ذهبي': { background: 'linear-gradient(135deg, #F7D84C 0%, #C98A1A 100%)', border: '#C98A1A' },
  'فضي': { background: 'linear-gradient(135deg, #F0F2F4 0%, #8F99A5 100%)', border: '#8F99A5' },
};

function normalizeColorKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getSwatchStyle(color: string): SwatchStyle {
  return colorSwatches[normalizeColorKey(color)] ?? {
    background: 'linear-gradient(135deg, #F2E7D8 0%, #B38A5D 100%)',
    border: '#B38A5D',
    accent: '#4A3024',
  };
}

export default function ProductDetails({ product, images, description, dimensions, whatsappNumber }: ProductDetailsProps) {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const isArabic = language === 'AR';
  const localizedName = localizeProductName(product.slug, product.name, language);
  const localizedCategory = localizeCategoryName(product.categorySlug, product.category, language);
  const localizedDescription = localizeProductDescription(product.slug, description || product.shortDescription, language);
  const localizedDimensions = isArabic
    ? dimensions?.replace('Hauteur:', 'الارتفاع:').replace('Grande + moyenne + petite', 'كبير + متوسط + صغير')
    : dimensions;
  const [quantity, setQuantity] = useState(1);
  const colorOptions = product.colors ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variants?.find((variant) => variant.stock > 0)?.id ?? product.variants?.[0]?.id ?? ''
  );
  const [selectedColor, setSelectedColor] = useState(() => colorOptions[0] ?? '');
  const [selectedFallbackImage, setSelectedFallbackImage] = useState(images[0] || product.image || '');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const variants = product.variants ?? [];
  const hasColorOptions = variants.length === 0 && colorOptions.length > 0;
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);
  const activePrice = selectedVariant?.price ?? product.price;
  const activeOldPrice = selectedVariant?.oldPrice ?? product.oldPrice;
  const availableStock = selectedVariant?.stock ?? product.stock ?? 0;
  const isOutOfStock = availableStock <= 0;
  const isPriceOnRequest = activePrice <= 0;
  const whatsappMessage = isArabic
    ? `السلام عليكم، أريد معرفة ثمن ${localizedName}.`
    : `Bonjour, je souhaite connaitre le prix de ${localizedName}.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '') || '212714516493'}?text=${encodeURIComponent(whatsappMessage)}`;

  const gallery: GalleryItem[] = variants.some((variant) => variant.imageUrl)
    ? variants
        .filter((variant) => variant.imageUrl)
        .map((variant) => ({
          key: variant.id,
          url: variant.imageUrl as string,
          label: variant.name,
          variantId: variant.id,
          price: variant.price,
        }))
    : images.map((url, index) => ({
        key: `${url}-${index}`,
        url,
      }));

  const activeImage = selectedVariant?.imageUrl || selectedFallbackImage || images[0] || product.image || '';

  const selectGalleryItem = (item: GalleryItem) => {
    if (item.variantId) {
      setSelectedVariantId(item.variantId);
    }
    setSelectedFallbackImage(item.url);
  };

  const addToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant, hasColorOptions ? selectedColor : undefined);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const orderNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant, hasColorOptions ? selectedColor : undefined);
    router.push('/commande');
  };

  return (
    <div className="grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
      <div className="grid gap-3 sm:grid-cols-[82px_1fr]">
        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
          {gallery.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => selectGalleryItem(item)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-brand-beige ${
                activeImage === item.url ? 'border-brand-caramel' : 'border-transparent'
              }`}
            >
              <Image src={item.url} alt={localizedName} fill sizes="80px" className="object-cover" />
              {item.price !== undefined && (
                <span className="absolute bottom-1 left-1 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-bold text-white">
                  {item.price <= 0 ? t.priceOnRequest : formatPrice(item.price)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative order-1 aspect-square overflow-hidden rounded-[24px] bg-brand-beige sm:order-2 md:rounded-[30px]">
          {activeImage ? (
            <Image src={activeImage} alt={localizedName} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-brand-gray-text">
              {isArabic ? 'الصورة متوفرة قريباً' : 'Photo bientot disponible'}
            </div>
          )}
        </div>
      </div>

      <div className="py-2 lg:py-6">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel">{localizedCategory}</p>
        <h1 className="font-serif text-2xl leading-tight text-brand-espresso sm:text-3xl md:text-5xl">{localizedName}</h1>

        <div className="mt-5 flex items-baseline gap-3 border-b border-brand-sand pb-6">
          <span className="text-2xl font-bold text-brand-brown">
            {isPriceOnRequest ? t.priceOnRequest : formatPrice(activePrice)}
          </span>
          {!isPriceOnRequest && activeOldPrice && activeOldPrice > activePrice && (
            <span className="text-base text-brand-gray-text line-through">{formatPrice(activeOldPrice)}</span>
          )}
        </div>

        <p className="mt-6 text-sm leading-7 text-brand-gray-text">{localizedDescription}</p>
        {localizedDimensions && (
          <div className="mt-5 border-y border-brand-sand py-4 text-sm">
            <span className="font-bold text-brand-espresso">{t.dimensionLabel} : </span>
            <span className="text-brand-gray-text">{localizedDimensions}</span>
          </div>
        )}

        {variants.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand-brown">{t.chooseSize}</span>
              <span className={`text-xs ${isOutOfStock ? 'text-red-700' : 'text-green-700'}`}>
                {isOutOfStock ? t.outOfStock : t.inStock}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variant.stock <= 0}
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setSelectedFallbackImage(variant.imageUrl || selectedFallbackImage);
                    setQuantity(1);
                  }}
                  className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors ${
                    selectedVariantId === variant.id
                      ? 'border-brand-espresso bg-brand-espresso text-brand-cream'
                      : 'border-brand-taupe bg-brand-white text-brand-brown'
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {localizeVariantName(variant.name, language)} · {variant.price <= 0 ? t.priceOnRequest : formatPrice(variant.price)}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasColorOptions && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand-brown">{t.chooseColor}</span>
              <span className={`text-xs ${isOutOfStock ? 'text-red-700' : 'text-green-700'}`}>
                {isOutOfStock ? t.outOfStock : t.inStock}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setQuantity(1);
                  }}
                  className={`flex min-h-16 items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all ${
                    selectedColor === color
                      ? 'border-brand-espresso bg-brand-cream shadow-[0_10px_24px_rgba(68,47,35,0.10)]'
                      : 'border-brand-sand bg-brand-white hover:border-brand-taupe'
                  }`}
                  aria-pressed={selectedColor === color}
                >
                  {(() => {
                    const swatch = getColorSwatchStyle(color);
                    const normalizedColor = normalizeColorKey(color);
                    const isLight = isLightColor(normalizedColor);
                    return (
                      <>
                        <span
                          className={`relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border`}
                          style={{
                            background: swatch.background,
                            borderColor: swatch.border ?? '#B38A5D',
                            boxShadow: selectedColor === color ? '0 0 0 2px rgba(68,47,35,0.08)' : undefined,
                          }}
                        >
                          {selectedColor === color && (
                            <Check size={14} className={isLight ? 'text-brand-espresso' : 'text-white'} />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-sm font-semibold leading-5 ${selectedColor === color ? 'text-brand-espresso' : 'text-brand-brown'}`}>
                            {localizeVariantName(color, language)}
                          </span>
                          <span className="block text-[10px] uppercase tracking-[0.12em] text-brand-gray-text">
                            {selectedColor === color ? (isArabic ? 'محدد' : 'Sélectionné') : (isArabic ? 'اختر' : 'Choisir')}
                          </span>
                        </span>
                      </>
                    );
                  })()}
                </button>
              ))}
            </div>
          </div>
        )}

        {!variants.length && (
          <p className={`mt-5 text-xs font-semibold ${isOutOfStock ? 'text-red-700' : 'text-green-700'}`}>
            {isOutOfStock ? t.outOfStock : t.inStock}
          </p>
        )}

        {isPriceOnRequest ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#159A55] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#117A44]"
          >
            <MessageCircle size={18} /> {t.requestPriceWhatsapp}
          </a>
        ) : (
          <>
            <div className="mt-7 flex gap-2 sm:gap-3">
              <div className="flex h-12 shrink-0 items-center rounded-full border border-brand-taupe bg-brand-white">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="h-full px-3"
                  aria-label="Diminuer la quantite"
                >
                  <Minus size={15} />
                </button>
                <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(20, availableStock, value + 1))}
                  className="h-full px-3"
                  aria-label="Augmenter la quantite"
                >
                  <Plus size={15} />
                </button>
              </div>
              <button
                type="button"
                onClick={addToCart}
                disabled={isOutOfStock}
                className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-brand-caramel px-3 text-[9px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-45 sm:px-5 sm:text-xs"
              >
                {added ? <Check size={17} /> : <ShoppingBag size={17} />}
                {added ? t.added : t.addToCart}
              </button>
            </div>
            <button
              type="button"
              onClick={orderNow}
              disabled={isOutOfStock}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-brand-espresso px-5 text-xs font-bold uppercase tracking-[0.12em] text-brand-cream transition-colors hover:bg-brand-brown disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t.orderNow}
            </button>
          </>
        )}

        <div className="mt-7 grid gap-3 border-t border-brand-sand pt-6 text-xs text-brand-gray-text sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-brand-sand/45 p-3">
            <Truck className="text-brand-caramel" size={22} />
            <span>
              <strong className="block text-brand-espresso">{t.deliveryMorocco}</strong>
              {t.deliveryTracking}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-brand-sand/45 p-3">
            <ShieldCheck className="text-brand-caramel" size={22} />
            <span>
              <strong className="block text-brand-espresso">{t.simplePayment}</strong>
              {t.codOnly}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
