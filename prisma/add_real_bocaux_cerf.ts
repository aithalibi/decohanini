import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'rangement' },
    update: { isVisible: true },
    create: {
      name: 'Rangement',
      slug: 'rangement',
      description: 'Bocaux, boites et accessoires decoratifs pour une maison bien organisee.',
      imageUrl: '/uploads/lot-3-bocaux-cerf-dore.jpeg',
      sortOrder: 7,
      isVisible: true,
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'lot-3-bocaux-cerf-dore' },
    update: {
      name: 'Lot de 3 bocaux avec cerf dore',
      shortDescription: 'Trois bocaux assortis: grand, moyen et petit.',
      description: 'Lot complet de trois bocaux transparents avec couvercles effet bois et poignees cerf dorees. Comprend une grande, une moyenne et une petite taille.',
      price: 70,
      oldPrice: null,
      stock: 10,
      dimensions: 'Grande + moyenne + petite',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: { url: '/uploads/lot-3-bocaux-cerf-dore.jpeg', isMain: true, sortOrder: 0 },
      },
      variants: { deleteMany: {} },
    },
    create: {
      name: 'Lot de 3 bocaux avec cerf dore',
      slug: 'lot-3-bocaux-cerf-dore',
      shortDescription: 'Trois bocaux assortis: grand, moyen et petit.',
      description: 'Lot complet de trois bocaux transparents avec couvercles effet bois et poignees cerf dorees. Comprend une grande, une moyenne et une petite taille.',
      price: 70,
      stock: 10,
      dimensions: 'Grande + moyenne + petite',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: { url: '/uploads/lot-3-bocaux-cerf-dore.jpeg', isMain: true, sortOrder: 0 },
      },
    },
    include: {
      images: true,
      category: { select: { name: true } },
    },
  });

  console.log(`${product.name}: lot complet ${product.price.toString()} DH, ${product.dimensions}, categorie ${product.category.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
