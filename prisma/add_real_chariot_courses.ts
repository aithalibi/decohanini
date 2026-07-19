import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'rangement' },
    update: { isVisible: true },
    create: {
      name: 'Rangement',
      slug: 'rangement',
      description: 'Solutions pratiques pour les courses, le rangement et la maison.',
      imageUrl: '/uploads/chariot-courses-pliable-couleurs.jpeg',
      sortOrder: 7,
      isVisible: true,
    },
  });

  const variants = ['Bleu marine', 'Bleu royal', 'Bordeaux', 'Rouge'].map((name, index) => ({
    name,
    price: 100,
    stock: 10,
    sortOrder: index,
  }));

  const product = await prisma.product.upsert({
    where: { slug: 'chariot-courses-pliable-roulettes-97cm' },
    update: {
      name: 'Chariot de courses pliable a roulettes',
      shortDescription: 'Chariot leger avec grand sac et roues silencieuses.',
      description: 'Chariot de courses pliable avec sac spacieux, poche arriere zippee et roues legeres. Hauteur totale de 97 cm, pratique pour le marche et les courses du quotidien.',
      price: 100,
      oldPrice: null,
      stock: 40,
      dimensions: 'Hauteur: 97 cm',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: [
          { url: '/uploads/chariot-courses-pliable-couleurs.jpeg', isMain: true, sortOrder: 0 },
          { url: '/uploads/chariot-courses-pliable-bleu.jpeg', isMain: false, sortOrder: 1 },
          { url: '/uploads/chariot-courses-pliable-rouge.jpeg', isMain: false, sortOrder: 2 },
        ],
      },
      variants: { deleteMany: {}, create: variants },
    },
    create: {
      name: 'Chariot de courses pliable a roulettes',
      slug: 'chariot-courses-pliable-roulettes-97cm',
      shortDescription: 'Chariot leger avec grand sac et roues silencieuses.',
      description: 'Chariot de courses pliable avec sac spacieux, poche arriere zippee et roues legeres. Hauteur totale de 97 cm, pratique pour le marche et les courses du quotidien.',
      price: 100,
      stock: 40,
      dimensions: 'Hauteur: 97 cm',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: [
          { url: '/uploads/chariot-courses-pliable-couleurs.jpeg', isMain: true, sortOrder: 0 },
          { url: '/uploads/chariot-courses-pliable-bleu.jpeg', isMain: false, sortOrder: 1 },
          { url: '/uploads/chariot-courses-pliable-rouge.jpeg', isMain: false, sortOrder: 2 },
        ],
      },
      variants: { create: variants },
    },
    include: {
      images: true,
      variants: { orderBy: { sortOrder: 'asc' } },
      category: { select: { name: true } },
    },
  });

  console.log(`${product.name}: ${product.price.toString()} DH, ${product.images.length} photos, couleurs ${product.variants.map((variant) => variant.name).join(', ')}, categorie ${product.category.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
