import { readFile } from 'node:fs/promises';
import path from 'node:path';
import nextEnv from '@next/env';
import { Prisma, PrismaClient } from '@prisma/client';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const snapshotPath = path.resolve(process.cwd(), 'prisma', 'catalog.snapshot.json');
const onlyIfEmpty = process.argv.includes('--if-empty');
const force = process.argv.includes('--force');

function productData(product, categoryId) {
  return {
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    stock: product.stock,
    isVisible: product.isVisible,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isOnSale: product.isOnSale,
    colors: product.colors === null ? Prisma.JsonNull : product.colors,
    dimensions: product.dimensions,
    categoryId,
  };
}

try {
  const existingProducts = await prisma.product.count();

  if (existingProducts > 0 && onlyIfEmpty) {
    console.log(`Catalog import skipped: ${existingProducts} products already exist.`);
    process.exitCode = 0;
  } else {
    if (existingProducts > 0 && !force) {
      throw new Error('The catalog is not empty. Use --force only when you intentionally want to replace matching products.');
    }

    const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
    if (snapshot.version !== 1 || !Array.isArray(snapshot.categories)) {
      throw new Error('Unsupported catalog snapshot.');
    }

    if (snapshot.settings) {
      await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: snapshot.settings,
        create: { id: 1, ...snapshot.settings },
      });
    }

    for (const category of snapshot.categories) {
      const savedCategory = await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl,
          isVisible: category.isVisible,
          sortOrder: category.sortOrder,
        },
        create: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          imageUrl: category.imageUrl,
          isVisible: category.isVisible,
          sortOrder: category.sortOrder,
        },
      });

      for (const product of category.products) {
        const scalarData = productData(product, savedCategory.id);
        await prisma.product.upsert({
          where: { slug: product.slug },
          update: {
            ...scalarData,
            images: {
              deleteMany: {},
              create: product.images,
            },
            variants: {
              deleteMany: {},
              create: product.variants,
            },
          },
          create: {
            slug: product.slug,
            ...scalarData,
            images: { create: product.images },
            variants: { create: product.variants },
          },
        });
      }
    }

    console.log(`Catalog imported from ${snapshotPath}`);
  }
} finally {
  await prisma.$disconnect();
}
