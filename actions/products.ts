'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { productSchema, productVariantsSchema } from '@/lib/validations/product';
import { revalidatePath } from 'next/cache';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/&/g, 'et')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getImageUrls(formData: FormData): string[] {
  const value = formData.get('imageUrls');
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
          .map((url) => url.trim())
          .slice(0, 6);
      }
    } catch {
      // Fallback to the legacy single-image field below.
    }
  }

  const legacyUrl = formData.get('imageUrl');
  return typeof legacyUrl === 'string' && legacyUrl.trim() ? [legacyUrl.trim()] : [];
}

function getVariants(formData: FormData) {
  const value = formData.get('variants');
  if (typeof value !== 'string' || !value.trim()) {
    return productVariantsSchema.safeParse([]);
  }

  try {
    return productVariantsSchema.safeParse(JSON.parse(value));
  } catch {
    return productVariantsSchema.safeParse('invalid');
  }
}

function normalizeVariantImageUrl(imageUrl: string | null | undefined) {
  if (typeof imageUrl !== 'string') return null;
  const trimmed = imageUrl.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function getProducts(filters?: {
  categoryId?: number;
  search?: string;
  isVisible?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'newest' | 'prix-asc' | 'prix-desc' | 'name';
}) {
  const where: {
    categoryId?: number;
    isVisible?: boolean;
    price?: { gte?: number; lte?: number };
    stock?: { gt: number };
    OR?: Array<{ name?: { contains: string } }>;
  } = {};

  if (filters?.categoryId) where.categoryId = filters.categoryId;
  if (filters?.isVisible !== undefined) where.isVisible = filters.isVisible;
  if (filters?.search) {
    where.OR = [{ name: { contains: filters.search.trim() } }];
  }
  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }
  if (filters?.inStock) where.stock = { gt: 0 };

  const orderBy =
    filters?.sort === 'prix-asc'
      ? { price: 'asc' as const }
      : filters?.sort === 'prix-desc'
        ? { price: 'desc' as const }
        : filters?.sort === 'name'
          ? { name: 'asc' as const }
          : { createdAt: 'desc' as const };

  return prisma.product.findMany({
    where,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' }, take: 4 },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy,
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }] },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function createProduct(_prevState: unknown, formData: FormData) {
  try {
    await requireAdmin();

    const raw = {
      name: formData.get('name') as string,
      categoryId: formData.get('categoryId') as string,
      price: formData.get('price') as string,
      oldPrice: (formData.get('oldPrice') as string) || undefined,
      shortDescription: (formData.get('shortDescription') as string) || undefined,
      description: (formData.get('description') as string) || undefined,
      stock: formData.get('stock') as string,
      isVisible: formData.get('isVisible') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      isNew: formData.get('isNew') === 'true',
      isOnSale: formData.get('isOnSale') === 'true',
      colors: (formData.get('colors') as string) || undefined,
      dimensions: (formData.get('dimensions') as string) || undefined,
    };

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const variantsResult = getVariants(formData);
    if (!variantsResult.success) {
      return { success: false, error: variantsResult.error.issues[0]?.message || 'Les variantes sont invalides.' };
    }

    const variants = variantsResult.data;
    const variantImageUrls = variants
      .map((variant) => normalizeVariantImageUrl(variant.imageUrl))
      .filter((url): url is string => Boolean(url));

    const normalizedProduct = variants.length > 0
      ? {
          ...parsed.data,
          price: Math.min(...variants.map((variant) => variant.price)),
          oldPrice: null,
          stock: variants.reduce((total, variant) => total + variant.stock, 0),
        }
      : { ...parsed.data, oldPrice: parsed.data.oldPrice ?? null };

    const slug = generateSlug(parsed.data.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const imageUrls = getImageUrls(formData);

    const product = await prisma.product.create({
      data: {
        ...normalizedProduct,
        slug: finalSlug,
        variants:
          variants.length > 0
            ? {
                create: variants.map((variant, index) => ({
                  ...variant,
                  imageUrl: normalizeVariantImageUrl(variant.imageUrl),
                  oldPrice: variant.oldPrice ?? null,
                  sortOrder: index,
                })),
              }
            : undefined,
      },
    });

    const galleryUrls = variants.length > 0
      ? [...variantImageUrls, ...imageUrls]
      : imageUrls;
    if (galleryUrls.length > 0) {
      await prisma.productImage.createMany({
        data: galleryUrls.map((url, index) => ({
          url,
          isMain: index === 0,
          sortOrder: index,
          productId: product.id,
        })),
      });
    }

    revalidatePath('/admin/produits');
    revalidatePath('/admin/apercu-site');
    revalidatePath('/');
    revalidatePath('/boutique');
    revalidatePath('/', 'layout');
    return { success: true, id: product.id };
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' };
  }
}

export async function updateProduct(id: number, _prevState: unknown, formData: FormData) {
  try {
    await requireAdmin();

    const raw = {
      name: formData.get('name') as string,
      categoryId: formData.get('categoryId') as string,
      price: formData.get('price') as string,
      oldPrice: (formData.get('oldPrice') as string) || undefined,
      shortDescription: (formData.get('shortDescription') as string) || undefined,
      description: (formData.get('description') as string) || undefined,
      stock: formData.get('stock') as string,
      isVisible: formData.get('isVisible') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      isNew: formData.get('isNew') === 'true',
      isOnSale: formData.get('isOnSale') === 'true',
      colors: (formData.get('colors') as string) || undefined,
      dimensions: (formData.get('dimensions') as string) || undefined,
    };

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const variantsResult = getVariants(formData);
    if (!variantsResult.success) {
      return { success: false, error: variantsResult.error.issues[0]?.message || 'Les variantes sont invalides.' };
    }

    const variants = variantsResult.data;
    const variantImageUrls = variants
      .map((variant) => normalizeVariantImageUrl(variant.imageUrl))
      .filter((url): url is string => Boolean(url));

    const normalizedProduct = variants.length > 0
      ? {
          ...parsed.data,
          price: Math.min(...variants.map((variant) => variant.price)),
          oldPrice: null,
          stock: variants.reduce((total, variant) => total + variant.stock, 0),
        }
      : { ...parsed.data, oldPrice: parsed.data.oldPrice ?? null };

    const imageUrls = getImageUrls(formData);
    const currentProduct = await prisma.product.findUnique({ where: { id }, select: { slug: true } });

    await prisma.$transaction(async (transaction) => {
      await transaction.product.update({
        where: { id },
        data: { ...normalizedProduct },
      });

      await transaction.productVariant.deleteMany({ where: { productId: id } });
      if (variants.length > 0) {
        await transaction.productVariant.createMany({
          data: variants.map((variant, index) => ({
            ...variant,
            imageUrl: normalizeVariantImageUrl(variant.imageUrl),
            oldPrice: variant.oldPrice ?? null,
            sortOrder: index,
            productId: id,
          })),
        });
      }

      await transaction.productImage.deleteMany({ where: { productId: id } });
      const galleryUrls = variants.length > 0
        ? [...variantImageUrls, ...imageUrls]
        : imageUrls;
      if (galleryUrls.length > 0) {
        await transaction.productImage.createMany({
          data: galleryUrls.map((url, index) => ({
            url,
            isMain: index === 0,
            sortOrder: index,
            productId: id,
          })),
        });
      }
    });

    revalidatePath('/admin/produits');
    revalidatePath('/admin/apercu-site');
    revalidatePath('/');
    revalidatePath('/boutique');
    if (currentProduct) revalidatePath(`/produit/${currentProduct.slug}`);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' };
  }
}

export async function deleteProduct(id: number) {
  try {
    await requireAdmin();
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/produits');
    revalidatePath('/admin/apercu-site');
    revalidatePath('/');
    revalidatePath('/boutique');
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' };
  }
}

export async function toggleProductVisibility(id: number, isVisible: boolean) {
  try {
    await requireAdmin();
    await prisma.product.update({ where: { id }, data: { isVisible } });
    revalidatePath('/admin/produits');
    revalidatePath('/admin/apercu-site');
    revalidatePath('/');
    revalidatePath('/boutique');
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue.' };
  }
}

export async function toggleProductFeatured(id: number, isFeatured: boolean) {
  try {
    await requireAdmin();
    await prisma.product.update({ where: { id }, data: { isFeatured } });
    revalidatePath('/admin/produits');
    revalidatePath('/admin/apercu-site');
    revalidatePath('/');
    revalidatePath('/boutique');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue.' };
  }
}
