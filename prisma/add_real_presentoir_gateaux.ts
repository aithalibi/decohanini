import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'miroirs' },
    update: { isVisible: true },
    create: {
      name: 'Les assiettes',
      slug: 'miroirs',
      description: 'Assiettes, coupes et pieces de service decoratives.',
      imageUrl: '/uploads/presentoir-gateaux-2-etages-jaune-dore.jpeg',
      sortOrder: 3,
      isVisible: true,
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'presentoir-gateaux-2-etages-jaune-dore' },
    update: {
      name: 'Presentoir a gateaux 2 etages jaune et dore',
      shortDescription: 'Presentoir elegant a deux niveaux avec poignee doree.',
      description: 'Presentoir de service a deux etages, ideal pour les gateaux, petits fours, fruits et gourmandises. Assiettes decorees dans des tons jaune, noir et blanc avec structure doree.',
      price: 75,
      oldPrice: null,
      stock: 10,
      dimensions: '2 etages',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: { url: '/uploads/presentoir-gateaux-2-etages-jaune-dore.jpeg', isMain: true, sortOrder: 0 },
      },
      variants: { deleteMany: {} },
    },
    create: {
      name: 'Presentoir a gateaux 2 etages jaune et dore',
      slug: 'presentoir-gateaux-2-etages-jaune-dore',
      shortDescription: 'Presentoir elegant a deux niveaux avec poignee doree.',
      description: 'Presentoir de service a deux etages, ideal pour les gateaux, petits fours, fruits et gourmandises. Assiettes decorees dans des tons jaune, noir et blanc avec structure doree.',
      price: 75,
      stock: 10,
      dimensions: '2 etages',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: { url: '/uploads/presentoir-gateaux-2-etages-jaune-dore.jpeg', isMain: true, sortOrder: 0 },
      },
    },
    include: {
      images: true,
      category: { select: { name: true } },
    },
  });

  console.log(`${product.name}: ${product.price.toString()} DH, ${product.dimensions}, categorie ${product.category.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
