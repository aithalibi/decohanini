export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  imageUrl?: string | null;
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
  galleryImages?: string[];
  badge?: string | null;
  isFeatured?: boolean;
  isOnSale?: boolean;
  shortDescription?: string | null;
  stock?: number;
  colors?: string[];
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  image: string | null;
  slug: string;
}
