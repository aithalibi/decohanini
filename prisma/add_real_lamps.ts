import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findUnique({ where: { slug: 'accessoires' } });
  if (!category) throw new Error('Categorie accessoires introuvable.');

  const ceramicLamp = await prisma.product.upsert({
    where: { slug: 'lampe-table-ceramique-blanche-marron' },
    update: {
      name: 'Lampe de table en ceramique blanche ou marron',
      shortDescription: 'Lampe decorative avec pied en ceramique et abat-jour en tissu.',
      description: 'Lampe de table chaleureuse avec pied en ceramique et abat-jour texture. Disponible en deux modeles: blanc mouchete et marron avec motif graphique.',
      price: 105,
      oldPrice: null,
      stock: 20,
      isVisible: true,
      isFeatured: false,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: { url: '/uploads/lampe-ceramique-blanche-marron.jpeg', isMain: true, sortOrder: 0 },
      },
      variants: {
        deleteMany: {},
        create: [
          { name: 'Blanche', price: 105, stock: 10, sortOrder: 0 },
          { name: 'Marron', price: 120, stock: 10, sortOrder: 1 },
        ],
      },
    },
    create: {
      name: 'Lampe de table en ceramique blanche ou marron',
      slug: 'lampe-table-ceramique-blanche-marron',
      shortDescription: 'Lampe decorative avec pied en ceramique et abat-jour en tissu.',
      description: 'Lampe de table chaleureuse avec pied en ceramique et abat-jour texture. Disponible en deux modeles: blanc mouchete et marron avec motif graphique.',
      price: 105,
      stock: 20,
      isVisible: true,
      isFeatured: false,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: { url: '/uploads/lampe-ceramique-blanche-marron.jpeg', isMain: true, sortOrder: 0 },
      },
      variants: {
        create: [
          { name: 'Blanche', price: 105, stock: 10, sortOrder: 0 },
          { name: 'Marron', price: 120, stock: 10, sortOrder: 1 },
        ],
      },
    },
  });

  const marbleLamp = await prisma.product.upsert({
    where: { slug: 'lampe-table-effet-marbre-beige-dore' },
    update: {
      name: 'Lampe de table effet marbre beige et dore',
      shortDescription: 'Lampe elegante aux nuances beige et dore avec abat-jour en tissu.',
      description: 'Lampe de table decorative avec pied effet marbre veine beige, finitions dorees et abat-jour texture. Ideale pour le salon, une console ou une table de chevet.',
      price: 120,
      oldPrice: null,
      stock: 10,
      isVisible: true,
      isFeatured: false,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: { url: '/uploads/lampe-marbre-beige-dore.jpeg', isMain: true, sortOrder: 0 },
      },
      variants: { deleteMany: {} },
    },
    create: {
      name: 'Lampe de table effet marbre beige et dore',
      slug: 'lampe-table-effet-marbre-beige-dore',
      shortDescription: 'Lampe elegante aux nuances beige et dore avec abat-jour en tissu.',
      description: 'Lampe de table decorative avec pied effet marbre veine beige, finitions dorees et abat-jour texture. Ideale pour le salon, une console ou une table de chevet.',
      price: 120,
      stock: 10,
      isVisible: true,
      isFeatured: false,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: { url: '/uploads/lampe-marbre-beige-dore.jpeg', isMain: true, sortOrder: 0 },
      },
    },
  });

  console.log(`${ceramicLamp.name}: variantes 105/120 DH`);
  console.log(`${marbleLamp.name}: 120 DH`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
