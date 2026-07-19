import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isVisible: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isVisible: true }, select: { slug: true, updatedAt: true } }),
  ]);
  const staticRoutes = ['', '/boutique', '/livraison-retours', '/conditions', '/confidentialite', '/faq'].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));
  return [...staticRoutes, ...categories.map((category) => ({ url: `${baseUrl}/categorie/${category.slug}`, lastModified: category.updatedAt })), ...products.map((product) => ({ url: `${baseUrl}/produit/${product.slug}`, lastModified: product.updatedAt }))];
}
