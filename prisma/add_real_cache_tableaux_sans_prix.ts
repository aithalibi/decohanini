import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Cache-tableau arbre fleuri blanc et dore',
    slug: 'cache-tableau-arbre-fleuri-blanc-dore',
    image: '/uploads/cache-tableau-arbre-fleuri-blanc-dore.jpeg',
    shortDescription: 'Cache-tableau encadre avec un arbre fleuri blanc et dore.',
    description: 'Cache-tableau electrique decoratif avec cadre dore et motif arbre fleuri en relief. Il dissimule le coffret tout en habillant le mur avec elegance.',
  },
  {
    name: 'Cache-tableau calligraphie doree',
    slug: 'cache-tableau-calligraphie-doree',
    image: '/uploads/cache-tableau-calligraphie-doree.jpeg',
    shortDescription: 'Cache-tableau noir, blanc et dore avec calligraphie.',
    description: 'Cache-tableau electrique decoratif avec cadre dore, fond abstrait et calligraphie en relief. Une finition chaleureuse pour le salon ou l\'entree.',
  },
  {
    name: 'Cache-tableau bouquet blanc et dore',
    slug: 'cache-tableau-bouquet-blanc-dore',
    image: '/uploads/cache-tableau-bouquet-blanc-dore.jpeg',
    shortDescription: 'Cache-tableau avec bouquet blanc et feuillage dore.',
    description: 'Cache-tableau electrique decoratif avec cadre dore et composition florale blanche et doree. Le panneau masque le coffret electrique tout en apportant une touche lumineuse au mur.',
  },
] as const;

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'tableaux' },
    update: { isVisible: true },
    create: {
      name: 'Cache Tableaux',
      slug: 'tableaux',
      description: 'Cache-tableaux decoratifs pour dissimuler les coffrets electriques.',
      imageUrl: products[0].image,
      sortOrder: 2,
      isVisible: true,
    },
  });

  for (const item of products) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        shortDescription: item.shortDescription,
        description: item.description,
        price: 0,
        oldPrice: null,
        stock: 10,
        isVisible: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        categoryId: category.id,
        images: {
          deleteMany: {},
          create: { url: item.image, isMain: true, sortOrder: 0 },
        },
        variants: { deleteMany: {} },
      },
      create: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        price: 0,
        stock: 10,
        isVisible: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        categoryId: category.id,
        images: {
          create: { url: item.image, isMain: true, sortOrder: 0 },
        },
      },
    });
  }

  const savedProducts = await prisma.product.findMany({
    where: { slug: { in: products.map((product) => product.slug) } },
    select: { name: true, price: true, images: { select: { url: true } } },
    orderBy: { name: 'asc' },
  });

  for (const product of savedProducts) {
    console.log(`${product.name}: prix sur demande, ${product.images.length} photo`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
