'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useFavoriteStore } from '@/store/favorite-store';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import { formatPrice } from '@/lib/utils';
import { localizeCategoryName, localizeProductName } from '@/lib/catalog-i18n';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  imageOverride?: string | null;
  hoverImageOverride?: string | null;
}

type MediaItem = {
  url: string;
  price: number;
  oldPrice: number | null;
  label?: string;
  variantId?: string;
};

export default function ProductCard({
  product,
  compact = false,
  imageOverride = null,
  hoverImageOverride = null,
}: ProductCardProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const favorites = useFavoriteStore((state) => state.favorites);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const isArabic = language === 'AR';
  const localizedName = localizeProductName(product.slug, product.name, language);
  const localizedCategory = localizeCategoryName(product.categorySlug, product.category, language);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;
  const hasColorOptions = !hasVariants && (product.colors?.length ?? 0) > 0;
  const requiresOptionChoice = hasVariants || hasColorOptions;
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const isFavorite = isMounted && favorites.includes(product.id);
  const productHref = `/produit/${product.slug}`;

  const media = useMemo<MediaItem[]>(() => {
    if (hasVariants) {
      const variantMedia = variants
        .filter((variant) => Boolean(variant.imageUrl))
        .map((variant) => ({
          url: variant.imageUrl as string,
          price: variant.price,
          oldPrice: variant.oldPrice ?? null,
          label: variant.name,
          variantId: variant.id,
        }));

      if (variantMedia.length > 0) {
        return variantMedia;
      }
    }

    const gallery = Array.from(
      new Set([
        imageOverride || product.image,
        hoverImageOverride || product.hoverImage,
        ...(product.galleryImages || []),
      ].filter((url): url is string => Boolean(url)))
    );

    return gallery.map((url) => ({
      url,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
    }));
  }, [hasVariants, hoverImageOverride, imageOverride, product.galleryImages, product.hoverImage, product.image, product.oldPrice, product.price, variants]);

  const safeMedia = media.length > 0 ? media : [];
  const activeMedia = safeMedia[activeIndex] || safeMedia[0];
  const activePrice = activeMedia?.price ?? product.price;
  const activeOldPrice = activeMedia?.oldPrice ?? product.oldPrice ?? null;
  const isPriceOnRequest = activePrice <= 0;
  const discountPercent = activeOldPrice && activeOldPrice > activePrice
    ? Math.round((1 - activePrice / activeOldPrice) * 100)
    : null;

  const badgeLabel =
    product.badge === 'Nouveau' && isArabic
      ? 'جديد'
      : product.badge || (product.isFeatured ? 'PREMIUM' : null);

  const actionLabel = isPriceOnRequest
    ? t.viewProduct
    : isOutOfStock
      ? (isArabic ? 'غير متوفر' : 'Epuisé')
      : requiresOptionChoice
        ? (isArabic ? 'اختر الخيارات' : 'Choisir les options')
        : t.addToCart;

  const handleAddToCart = () => {
    if (isPriceOnRequest || requiresOptionChoice) {
      router.push(productHref);
      return;
    }
    if (isOutOfStock) return;
    setIsAdding(true);
    addItem(product);
    window.setTimeout(() => setIsAdding(false), 900);
  };

  const imageArea = (
    <div className="relative aspect-[4/5] overflow-hidden bg-brand-beige">
      {badgeLabel && (
        <span className="absolute left-3 top-3 z-20 rounded-full border border-white/45 bg-brand-cream/95 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-brand-brown shadow-sm backdrop-blur-md">
          {badgeLabel}
        </span>
      )}

      <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-brand-cream/95 text-brand-brown shadow-sm backdrop-blur-md transition-all hover:bg-brand-espresso hover:text-brand-cream"
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={16} strokeWidth={1.7} className={isFavorite ? 'fill-brand-caramel text-brand-caramel' : ''} />
        </button>
        <Link
          href={productHref}
          className="hidden h-9 w-9 place-items-center rounded-full border border-white/50 bg-brand-cream/95 text-brand-brown opacity-0 shadow-sm backdrop-blur-md transition-all hover:bg-brand-espresso hover:text-brand-cream group-hover:opacity-100 sm:grid"
          aria-label={isArabic ? 'عرض المنتج' : 'Voir le produit'}
        >
          <Eye size={16} strokeWidth={1.7} />
        </Link>
      </div>

      {activeMedia ? (
        <Image
          src={activeMedia.url}
          alt={localizedName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-brand-gray-text">
          {isArabic ? 'الصورة قريباً' : 'Photo bientot disponible'}
        </div>
      )}
    </div>
  );

  const thumbnails = safeMedia.slice(0, 4);

  const CardContent = (
    <div className="overflow-hidden border border-brand-sand/80 bg-white shadow-[0_8px_24px_rgba(68,47,35,0.04)]">
      {imageArea}

      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[8px] font-bold uppercase tracking-[0.2em] text-brand-caramel sm:text-[9px]">
            {localizedCategory}
          </p>
          <span className={`flex shrink-0 items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.08em] ${isOutOfStock ? 'text-red-700' : 'text-brand-gray-text'}`}>
            <i className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-emerald-700'}`} />
            {isOutOfStock ? (isArabic ? 'نفد' : 'Epuisé') : (isArabic ? 'متوفر' : 'En stock')}
          </span>
        </div>

        <Link
          href={productHref}
          className="font-display italic mt-2 block line-clamp-2 text-[15px] leading-5 text-brand-espresso transition-colors hover:text-brand-caramel sm:text-[17px] sm:leading-6"
        >
          {localizedName}
        </Link>

        {thumbnails.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {thumbnails.map((item, index) => (
                <button
                  key={`${item.url}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`block h-9 w-9 overflow-hidden rounded-md border bg-brand-cream shadow-sm transition-transform ${
                    activeIndex === index ? 'scale-105 border-brand-brown' : 'border-white'
                  }`}
                  aria-label={item.label ? `Voir ${item.label}` : `Voir image ${index + 1}`}
                >
                  <Image src={item.url} alt="" width={36} height={36} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            {safeMedia.length > 4 && (
              <span className="text-[10px] text-brand-gray-text">+{safeMedia.length - 4}</span>
            )}
          </div>
        )}

        {hasVariants && activeMedia?.label && (
          <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-brand-gray-text">
            {activeMedia.label}
          </p>
        )}

        <div className="mt-2 flex min-h-6 flex-wrap items-baseline gap-1.5">
          {isPriceOnRequest ? (
            <span className="text-sm font-bold text-brand-brown sm:text-base">{t.priceOnRequest}</span>
          ) : (
            <span className="text-sm font-bold text-brand-brown sm:text-base">{formatPrice(activePrice)}</span>
          )}

          {!isPriceOnRequest && activeOldPrice && activeOldPrice > activePrice && (
            <>
              <span className="text-[11px] text-brand-gray-text line-through">{formatPrice(activeOldPrice)}</span>
              {discountPercent && (
                <span className="rounded-full bg-brand-caramel/12 px-2 py-0.5 text-[9px] font-bold text-brand-caramel">
                  -{discountPercent}%
                </span>
              )}
            </>
          )}

          {hasVariants && !isPriceOnRequest && (
            <span className="text-[10px] text-brand-gray-text">{isArabic ? 'السعر حسب الصورة' : 'Prix selon la photo'}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-brand-brown bg-transparent px-2 text-[8px] font-bold uppercase tracking-[0.08em] text-brand-brown transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-brand-espresso hover:text-brand-cream"
        >
          {isPriceOnRequest ? <Eye size={13} /> : <ShoppingBag size={13} />}
          {isAdding ? t.added : actionLabel}
        </button>
      </div>
    </div>
  );

  if (compact) {
    return (
      <article className="group min-w-0 bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
        {CardContent}
      </article>
    );
  }

  return (
    <article className="group min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="relative">{CardContent}</div>
    </article>
  );
}
