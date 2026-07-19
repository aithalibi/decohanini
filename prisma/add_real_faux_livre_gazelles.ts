import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'decoration' },
    update: { isVisible: true },
    create: {
      name: 'Vases',
      slug: 'decoration',
      description: 'Vases, sculptures et objets decoratifs pour le salon.',
      imageUrl: '/uploads/faux-livre-3-gazelles-dorees.jpeg',
      sortOrder: 1,
      isVisible: true,
    },
  });

  const existing = await prisma.product.findFirst({
    where: {
      OR: [
        { slug: 'faux-livre-3-gazelles-dorees' },
        { slug: 'jeu-echecs-luxe' },
        { name: { contains: 'Faux livre avec 3 gazelles' } },
      ],
    },
    select: { id: true },
  });

  const data = {
    name: 'Faux livre decoratif avec 3 gazelles dorees',
    slug: 'faux-livre-3-gazelles-dorees',
    shortDescription: 'Un faux livre blanc accompagne de trois gazelles dorees.',
    description: 'Ensemble decoratif compose d\'un faux livre blanc et de trois gazelles dorees de tailles differentes. Ideal sur une table basse, une console ou une etagere.',
    price: 100,
    oldPrice: null,
    stock: 10,
    isVisible: true,
    isFeatured: true,
    isNew: true,
    isOnSale: false,
    categoryId: category.id,
  };

  const product = existing
    ? await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...data,
          images: {
            deleteMany: {},
            create: { url: '/uploads/faux-livre-3-gazelles-dorees.jpeg', isMain: true, sortOrder: 0 },
          },
          variants: { deleteMany: {} },
        },
        include: { images: true, category: { select: { name: true } } },
      })
    : await prisma.product.create({
        data: {
          ...data,
          images: {
            create: { url: '/uploads/faux-livre-3-gazelles-dorees.jpeg', isMain: true, sortOrder: 0 },
          },
        },
        include: { images: true, category: { select: { name: true } } },
      });

  console.log(`${product.name}: ${product.price.toString()} DH, ${product.images.length} photo, categorie ${product.category.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
