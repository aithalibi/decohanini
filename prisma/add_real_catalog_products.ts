import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const realProducts = [
  {
    name: 'Cache-tableau electrique en bois Home',
    slug: 'cache-tableau-electrique-bois-home',
    categorySlug: 'tableaux',
    categoryName: 'Cache-tableaux',
    price: 100,
    stock: 10,
    image: '/uploads/cache-tableau-electrique-bois-home.jpeg',
    shortDescription: 'Cache-tableau en bois avec etageres et crochets porte-cles.',
    description: "Une solution decorative et pratique pour dissimuler le tableau electrique dans l'entree ou le salon. Finition effet bois, deux petites etageres et quatre crochets.",
  },
] as const;

async function main() {
  for (const product of realProducts) {
    const category = await prisma.category.upsert({
      where: { slug: product.categorySlug },
      update: { isVisible: true },
      create: {
        name: product.categoryName,
        slug: product.categorySlug,
        description: 'Cache-tableaux et decorations murales pour habiller la maison.',
        imageUrl: product.image,
        sortOrder: 2,
        isVisible: true,
      },
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        oldPrice: null,
        stock: product.stock,
        isVisible: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        categoryId: category.id,
        images: {
          deleteMany: {},
          create: { url: product.image, isMain: true, sortOrder: 0 },
        },
      },
      create: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        stock: product.stock,
        isVisible: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        categoryId: category.id,
        images: {
          create: { url: product.image, isMain: true, sortOrder: 0 },
        },
      },
    });
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: realProducts.map((product) => product.slug) } },
    select: { name: true, price: true, stock: true, category: { select: { name: true } } },
    orderBy: { name: 'asc' },
  });

  for (const product of products) {
    console.log(`${product.name}: ${product.price.toString()} DH, stock ${product.stock}, categorie ${product.category.name}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
