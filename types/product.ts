export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
  hoverImage?: string | null;
  badge?: string | null;
  isFeatured?: boolean;
  shortDescription?: string | null;
  stock?: number;
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  image: string | null;
  slug: string;
}
