'use client';

import { useEffect, useState } from 'react';
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

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
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
  const variantPrices = variants.map((variant) => variant.price);
  const minimumPrice = hasVariants ? Math.min(...variantPrices) : product.price;
  const maximumPrice = hasVariants ? Math.max(...variantPrices) : product.price;
  const isPriceOnRequest = minimumPrice <= 0;
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const isFavorite = isMounted && favorites.includes(product.id);
  const productHref = `/produit/${product.slug}`;
  const badgeLabel = product.badge === 'Nouveau' && isArabic ? 'جديد' : product.badge === 'Promo' && isArabic ? 'تخفيض' : product.badge;
  const actionLabel = isPriceOnRequest
    ? t.viewProduct
    : isOutOfStock
      ? (isArabic ? 'غير متوفر' : 'Épuisé')
      : hasVariants
        ? (isArabic ? 'اختيار الخيارات' : 'Choisir les options')
        : t.addToCart;

  const handleAddToCart = () => {
    if (isPriceOnRequest || hasVariants) {
      router.push(productHref);
      return;
    }
    if (isOutOfStock) return;
    setIsAdding(true);
    addItem(product);
    window.setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <article className={`group min-w-0 ${compact ? 'overflow-hidden border border-brand-sand bg-brand-white shadow-[0_8px_24px_rgba(68,47,35,0.06)]' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className={`relative overflow-hidden bg-brand-beige transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_22px_50px_rgba(68,47,35,0.15)] ${compact ? 'aspect-[4/3]' : 'aspect-[4/5] rounded-[16px] shadow-[0_10px_30px_rgba(68,47,35,0.07)] ring-1 ring-brand-sand/70 sm:rounded-[20px]'}`}>
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
          <Link href={productHref} className="hidden h-9 w-9 translate-y-1 place-items-center rounded-full border border-white/50 bg-brand-cream/95 text-brand-brown opacity-0 shadow-sm backdrop-blur-md transition-all hover:bg-brand-espresso hover:text-brand-cream group-hover:translate-y-0 group-hover:opacity-100 sm:grid" aria-label={isArabic ? 'عرض المنتج' : 'Voir le produit'}>
            <Eye size={16} strokeWidth={1.7} />
          </Link>
        </div>

        <Link href={productHref} className="block h-full w-full" aria-label={localizedName}>
          {product.image ? (
            <>
              <Image src={product.image} alt={localizedName} fill sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw" className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.035] ${product.hoverImage ? 'group-hover:opacity-0' : ''}`} />
              {product.hoverImage && <Image src={product.hoverImage} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.035] group-hover:opacity-100" />}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-brand-gray-text">{isArabic ? 'الصورة قريباً' : 'Photo bientôt disponible'}</div>
          )}
        </Link>

        <div className={`absolute inset-x-3 bottom-3 z-20 transition-all duration-300 ${compact ? 'hidden' : 'hidden sm:block lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100'}`}>
          <button type="button" onClick={handleAddToCart} disabled={isAdding || isOutOfStock} className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-espresso/95 px-4 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-cream shadow-xl backdrop-blur-md transition-colors hover:bg-brand-caramel disabled:cursor-not-allowed disabled:opacity-60">
            {isPriceOnRequest ? <Eye size={15} strokeWidth={1.8} /> : <ShoppingBag size={15} strokeWidth={1.8} />}
            {isAdding ? t.added : actionLabel}
          </button>
        </div>
      </div>

      <div className={compact ? 'p-3 text-center sm:p-4' : 'px-1 pb-2 pt-4'}>
        <div className={`items-center justify-between gap-2 ${compact ? 'hidden' : 'flex'}`}>
          <p className="truncate text-[8px] font-bold uppercase tracking-[0.2em] text-brand-caramel sm:text-[9px]">{localizedCategory}</p>
          <span className={`flex shrink-0 items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.08em] ${isOutOfStock ? 'text-red-700' : 'text-brand-gray-text'}`}><i className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-emerald-700'}`} />{isOutOfStock ? (isArabic ? 'نفد' : 'Épuisé') : (isArabic ? 'متوفر' : 'En stock')}</span>
        </div>

        <Link href={productHref} className={`block line-clamp-2 font-serif text-[15px] leading-5 text-brand-espresso transition-colors hover:text-brand-caramel sm:text-[17px] sm:leading-6 ${compact ? 'min-h-10' : 'mt-2 min-h-10'}`}>
          {localizedName}
        </Link>

        <div className={`mt-2.5 flex min-h-6 flex-wrap items-baseline gap-1.5 ${compact ? 'justify-center' : ''}`}>
          {isPriceOnRequest ? (
            <span className="text-sm font-bold text-brand-brown sm:text-base">{t.priceOnRequest}</span>
          ) : hasVariants && minimumPrice !== maximumPrice ? (
            <span className="text-sm font-bold text-brand-brown sm:text-base">{formatPrice(minimumPrice)} <span className="mx-0.5 font-normal text-brand-taupe">–</span> {formatPrice(maximumPrice)}</span>
          ) : (
            <span className="text-sm font-bold text-brand-brown sm:text-base">{formatPrice(minimumPrice)}</span>
          )}
          {!isPriceOnRequest && !hasVariants && product.oldPrice && product.oldPrice > product.price && <span className="text-[11px] text-brand-gray-text line-through">{formatPrice(product.oldPrice)}</span>}
        </div>

        {hasVariants && !compact && <p className="mt-1.5 text-[9px] text-brand-gray-text">{variants.length} {isArabic ? 'خيارات متاحة' : 'options disponibles'}</p>}

        <button type="button" onClick={handleAddToCart} disabled={isAdding || isOutOfStock} className={`mt-3 h-10 w-full items-center justify-center gap-1.5 px-2 text-[8px] font-bold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${compact ? 'flex bg-brand-caramel text-white hover:bg-brand-gold-dark' : 'flex rounded-full border border-brand-brown bg-transparent text-brand-brown hover:bg-brand-espresso hover:text-brand-cream sm:hidden'}`}>
          {isPriceOnRequest ? <Eye size={13} /> : <ShoppingBag size={13} />}{isAdding ? t.added : actionLabel}
        </button>
      </div>
    </article>
  );
}
