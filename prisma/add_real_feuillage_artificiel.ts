import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'bougies-parfums' },
    update: { isVisible: true },
    create: {
      name: 'Pano 3D',
      slug: 'bougies-parfums',
      description: 'Panneaux, revetements et decorations murales en relief.',
      imageUrl: '/uploads/feuillage-artificiel-rouleau-detail.jpeg',
      sortOrder: 4,
      isVisible: true,
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'rouleau-feuillage-artificiel-mural-3x1m' },
    update: {
      name: 'Rouleau de feuillage artificiel mural',
      shortDescription: 'Feuillage decoratif en rouleau pour mur, balcon ou terrasse.',
      description: 'Rouleau de feuillage artificiel vert pour creer rapidement un mur vegetal decoratif. Format complet de 3 metres sur 1 metre.',
      price: 100,
      oldPrice: null,
      stock: 10,
      dimensions: '3 m x 1 m',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        deleteMany: {},
        create: [
          { url: '/uploads/feuillage-artificiel-rouleau-detail.jpeg', isMain: true, sortOrder: 0 },
          { url: '/uploads/feuillage-artificiel-rouleau-vue-complete.jpeg', isMain: false, sortOrder: 1 },
        ],
      },
      variants: { deleteMany: {} },
    },
    create: {
      name: 'Rouleau de feuillage artificiel mural',
      slug: 'rouleau-feuillage-artificiel-mural-3x1m',
      shortDescription: 'Feuillage decoratif en rouleau pour mur, balcon ou terrasse.',
      description: 'Rouleau de feuillage artificiel vert pour creer rapidement un mur vegetal decoratif. Format complet de 3 metres sur 1 metre.',
      price: 100,
      stock: 10,
      dimensions: '3 m x 1 m',
      isVisible: true,
      isFeatured: true,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: {
        create: [
          { url: '/uploads/feuillage-artificiel-rouleau-detail.jpeg', isMain: true, sortOrder: 0 },
          { url: '/uploads/feuillage-artificiel-rouleau-vue-complete.jpeg', isMain: false, sortOrder: 1 },
        ],
      },
    },
    include: {
      images: true,
      category: { select: { name: true } },
    },
  });

  console.log(`${product.name}: ${product.price.toString()} DH, format ${product.dimensions}, ${product.images.length} photos, categorie ${product.category.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
