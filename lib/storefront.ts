import type { Product } from '@/types/product';

type StoreProductRecord = {
  id: number;
  slug: string;
  name: string;
  price: number | { toString(): string };
  oldPrice: number | { toString(): string } | null;
  shortDescription: string | null;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  category: { name: string; slug: string };
  images: Array<{ url: string }>;
  variants?: Array<{
    id: number;
    name: string;
    price: number | { toString(): string };
    oldPrice: number | { toString(): string } | null;
    stock: number;
  }>;
};

export function toStoreProduct(product: StoreProductRecord): Product {
  const variants = product.variants?.map((variant) => ({
    id: String(variant.id),
    name: variant.name,
    price: Number(variant.price),
    oldPrice: variant.oldPrice == null ? null : Number(variant.oldPrice),
    stock: variant.stock,
  })) ?? [];

  return {
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    category: product.category.name,
    categorySlug: product.category.slug,
    price: Number(product.price),
    oldPrice: product.oldPrice == null ? null : Number(product.oldPrice),
    image: product.images[0]?.url || null,
    hoverImage: product.images[1]?.url || null,
    badge: product.isNew ? 'Nouveau' : product.isOnSale ? 'Promo' : null,
    isFeatured: product.isFeatured,
    shortDescription: product.shortDescription,
    stock: product.stock,
    variants,
  };
}
