import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'decoration' },
    update: { isVisible: true },
    create: {
      name: 'Vases',
      slug: 'decoration',
      description: 'Vases et objets decoratifs pour le salon, la table et la console.',
      imageUrl: '/uploads/vase-anneau-blanc-dore.jpeg',
      sortOrder: 1,
      isVisible: true,
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'vase-anneau-bicolore-blanc-dore' },
    update: {
      name: 'Vase anneau bicolore blanc et dore',
      shortDescription: 'Vase decoratif moderne en forme d\'anneau.',
      description: 'Vase anneau au design contemporain, avec une finition blanche et doree. Ideal avec des pampas ou comme objet decoratif sur une table ou une console.',
      price: 85,
      oldPrice: null,
      stock: 10,
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: { url: '/uploads/vase-anneau-blanc-dore.jpeg', isMain: true, sortOrder: 0 },
      },
      variants: {
        deleteMany: {},
        create: { name: 'Petit', price: 85, stock: 10, sortOrder: 0 },
      },
    },
    create: {
      name: 'Vase anneau bicolore blanc et dore',
      slug: 'vase-anneau-bicolore-blanc-dore',
      shortDescription: 'Vase decoratif moderne en forme d\'anneau.',
      description: 'Vase anneau au design contemporain, avec une finition blanche et doree. Ideal avec des pampas ou comme objet decoratif sur une table ou une console.',
      price: 85,
      stock: 10,
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: { url: '/uploads/vase-anneau-blanc-dore.jpeg', isMain: true, sortOrder: 0 },
      },
      variants: {
        create: { name: 'Petit', price: 85, stock: 10, sortOrder: 0 },
      },
    },
    include: {
      images: true,
      variants: true,
      category: { select: { name: true } },
    },
  });

  console.log(`${product.name}: ${product.price.toString()} DH, variante ${product.variants.map((variant) => `${variant.name} ${variant.price.toString()} DH`).join(', ')}, categorie ${product.category.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
