import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import nextEnv from '@next/env';
import { PrismaClient } from '@prisma/client';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const outputPath = path.resolve(process.cwd(), 'prisma', 'catalog.snapshot.json');

try {
  const [settings, categories] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: {
        products: {
          orderBy: { id: 'asc' },
          include: {
            images: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
            variants: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
          },
        },
      },
    }),
  ]);

  const snapshot = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: settings
      ? {
          storeName: settings.storeName,
          whatsappNumber: settings.whatsappNumber,
          phone: settings.phone,
          email: settings.email,
          address: settings.address,
          heroTitle: settings.heroTitle,
          heroSubtitle: settings.heroSubtitle,
          heroImageUrl: settings.heroImageUrl,
          instagramUrl: settings.instagramUrl,
          facebookUrl: settings.facebookUrl,
          deliveryText: settings.deliveryText,
          paymentText: settings.paymentText,
        }
      : null,
    categories: categories.map((category) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      isVisible: category.isVisible,
      sortOrder: category.sortOrder,
      products: category.products.map((product) => ({
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() ?? null,
        stock: product.stock,
        isVisible: product.isVisible,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        isOnSale: product.isOnSale,
        colors: product.colors,
        dimensions: product.dimensions,
        images: product.images.map((image) => ({
          url: image.url,
          publicId: image.publicId,
          isMain: image.isMain,
          sortOrder: image.sortOrder,
        })),
        variants: product.variants.map((variant) => ({
          name: variant.name,
          price: variant.price.toString(),
          oldPrice: variant.oldPrice?.toString() ?? null,
          stock: variant.stock,
          sortOrder: variant.sortOrder,
        })),
      })),
    })),
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`Catalog exported to ${outputPath}`);
} finally {
  await prisma.$disconnect();
}
