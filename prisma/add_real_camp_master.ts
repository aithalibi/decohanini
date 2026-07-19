import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'chaises-exterieur' },
    update: { isVisible: true },
    create: {
      name: 'Chaises & Exterieur',
      slug: 'chaises-exterieur',
      description: 'Chaises et mobilier pratique pour la plage, le camping, la terrasse et le jardin.',
      imageUrl: '/uploads/chaise-camping-camp-master-duo.jpeg',
      sortOrder: 6,
      isVisible: true,
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'chaise-camping-rembourree-camp-master' },
    update: {
      name: 'Chaise camping rembourree Camp Master',
      shortDescription: 'Chaise pliante rembourree avec accoudoirs et porte-gobelet.',
      description: 'Chaise Camp Master confortable avec dossier rembourre, structure pliante, accoudoirs et porte-gobelet. Ideale pour le camping, la plage et le jardin.',
      price: 160,
      oldPrice: null,
      stock: 20,
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: [
          { url: '/uploads/chaise-camping-camp-master-duo.jpeg', isMain: true, sortOrder: 0 },
          { url: '/uploads/chaise-camping-camp-master-bleue.jpeg', isMain: false, sortOrder: 1 },
          { url: '/uploads/chaise-camping-camp-master-bordeaux.jpeg', isMain: false, sortOrder: 2 },
        ],
      },
      variants: {
        deleteMany: {},
        create: [
          { name: 'Bleu', price: 160, stock: 10, sortOrder: 0 },
          { name: 'Bordeaux', price: 160, stock: 10, sortOrder: 1 },
        ],
      },
    },
    create: {
      name: 'Chaise camping rembourree Camp Master',
      slug: 'chaise-camping-rembourree-camp-master',
      shortDescription: 'Chaise pliante rembourree avec accoudoirs et porte-gobelet.',
      description: 'Chaise Camp Master confortable avec dossier rembourre, structure pliante, accoudoirs et porte-gobelet. Ideale pour le camping, la plage et le jardin.',
      price: 160,
      stock: 20,
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: [
          { url: '/uploads/chaise-camping-camp-master-duo.jpeg', isMain: true, sortOrder: 0 },
          { url: '/uploads/chaise-camping-camp-master-bleue.jpeg', isMain: false, sortOrder: 1 },
          { url: '/uploads/chaise-camping-camp-master-bordeaux.jpeg', isMain: false, sortOrder: 2 },
        ],
      },
      variants: {
        create: [
          { name: 'Bleu', price: 160, stock: 10, sortOrder: 0 },
          { name: 'Bordeaux', price: 160, stock: 10, sortOrder: 1 },
        ],
      },
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
