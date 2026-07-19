import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'miroirs' },
    update: { isVisible: true },
    create: {
      name: 'Assiettes decoratives',
      slug: 'miroirs',
      description: 'Assiettes, coupes et pieces de service aux finitions decoratives.',
      imageUrl: '/uploads/coupe-marocaine-sur-pied-sans-mesures.png',
      sortOrder: 3,
      isVisible: true,
    },
  });

  const variants = [
    { name: '20 cm', price: 90, stock: 10, sortOrder: 0 },
    { name: '23 cm', price: 100, stock: 10, sortOrder: 1 },
    { name: '25 cm', price: 130, stock: 10, sortOrder: 2 },
  ];

  const product = await prisma.product.upsert({
    where: { slug: 'coupe-marocaine-decorative-sur-pied' },
    update: {
      name: 'Coupe marocaine decorative sur pied',
      shortDescription: 'Coupe blanche aux motifs marocains rouges, verts et dores.',
      description: 'Coupe decorative sur pied inspiree de l\'artisanat marocain. Disponible en trois dimensions: 20 cm a 90 DH, 23 cm a 100 DH et 25 cm a 130 DH.',
      price: 90,
      oldPrice: null,
      stock: 30,
      dimensions: '20 cm, 23 cm ou 25 cm',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: { url: '/uploads/coupe-marocaine-sur-pied-sans-mesures.png', isMain: true, sortOrder: 0 },
      },
      variants: { deleteMany: {}, create: variants },
    },
    create: {
      name: 'Coupe marocaine decorative sur pied',
      slug: 'coupe-marocaine-decorative-sur-pied',
      shortDescription: 'Coupe blanche aux motifs marocains rouges, verts et dores.',
      description: 'Coupe decorative sur pied inspiree de l\'artisanat marocain. Disponible en trois dimensions: 20 cm a 90 DH, 23 cm a 100 DH et 25 cm a 130 DH.',
      price: 90,
      stock: 30,
      dimensions: '20 cm, 23 cm ou 25 cm',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: { url: '/uploads/coupe-marocaine-sur-pied-sans-mesures.png', isMain: true, sortOrder: 0 },
      },
      variants: { create: variants },
    },
    include: {
      images: true,
      variants: { orderBy: { sortOrder: 'asc' } },
      category: { select: { name: true } },
    },
  });

  console.log(`${product.name}: ${product.variants.map((variant) => `${variant.name} = ${variant.price.toString()} DH`).join(', ')}, categorie ${product.category.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
