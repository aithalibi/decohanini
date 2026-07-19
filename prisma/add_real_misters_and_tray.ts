import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const imageUrl = '/uploads/vaporisateurs-verre-vert-plateau-bambou.jpeg';

async function main() {
  const category = await prisma.category.findUnique({ where: { slug: 'accessoires' } });
  if (!category) throw new Error('Categorie accessoires introuvable.');

  const mister = await prisma.product.upsert({
    where: { slug: 'vaporisateur-verre-vert-dore' },
    update: {
      name: 'Vaporisateur en verre vert et dore',
      shortDescription: 'Vaporisateur decoratif vendu a l unite.',
      description: 'Vaporisateur en verre vert nervure avec pompe et embout dores. Ideal pour les plantes, le repassage ou la decoration. Prix pour un vaporisateur; le plateau est vendu separement.',
      price: 18,
      oldPrice: null,
      stock: 20,
      isVisible: true,
      isFeatured: false,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: { deleteMany: {}, create: { url: imageUrl, isMain: true, sortOrder: 0 } },
      variants: { deleteMany: {} },
    },
    create: {
      name: 'Vaporisateur en verre vert et dore',
      slug: 'vaporisateur-verre-vert-dore',
      shortDescription: 'Vaporisateur decoratif vendu a l unite.',
      description: 'Vaporisateur en verre vert nervure avec pompe et embout dores. Ideal pour les plantes, le repassage ou la decoration. Prix pour un vaporisateur; le plateau est vendu separement.',
      price: 18,
      stock: 20,
      isVisible: true,
      isFeatured: false,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: { create: { url: imageUrl, isMain: true, sortOrder: 0 } },
    },
  });

  const tray = await prisma.product.upsert({
    where: { slug: 'plateau-ovale-bambou' },
    update: {
      name: 'Plateau ovale en bambou',
      shortDescription: 'Petit plateau naturel pour accessoires et flacons.',
      description: 'Plateau ovale en bambou au style naturel, pratique pour organiser des flacons, parfums ou petits accessoires. Prix pour le plateau seul; les vaporisateurs sont vendus separement.',
      price: 15,
      oldPrice: null,
      stock: 20,
      isVisible: true,
      isFeatured: false,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: { deleteMany: {}, create: { url: imageUrl, isMain: true, sortOrder: 0 } },
      variants: { deleteMany: {} },
    },
    create: {
      name: 'Plateau ovale en bambou',
      slug: 'plateau-ovale-bambou',
      shortDescription: 'Petit plateau naturel pour accessoires et flacons.',
      description: 'Plateau ovale en bambou au style naturel, pratique pour organiser des flacons, parfums ou petits accessoires. Prix pour le plateau seul; les vaporisateurs sont vendus separement.',
      price: 15,
      stock: 20,
      isVisible: true,
      isFeatured: false,
      isNew: true,
      isOnSale: false,
      categoryId: category.id,
      images: { create: { url: imageUrl, isMain: true, sortOrder: 0 } },
    },
  });

  console.log(`${mister.name}: ${mister.price.toString()} DH l unite`);
  console.log(`${tray.name}: ${tray.price.toString()} DH`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
