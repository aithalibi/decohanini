import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Chaise basse pliante de plage',
    slug: 'chaise-basse-pliante-plage',
    shortDescription: 'Chaise basse confortable et facile a transporter.',
    description: 'Chaise basse pliante avec accoudoirs, ideale pour la plage, la terrasse et les sorties. Disponible en beige et en noir.',
    images: [
      '/uploads/chaise-basse-plage-beige-principale.jpeg',
      '/uploads/chaise-basse-plage-beige-noire.jpeg',
      '/uploads/chaise-basse-plage-noire.jpeg',
      '/uploads/chaise-basse-plage-beige-profil.jpeg',
    ],
    variants: ['Beige', 'Noir'],
  },
  {
    name: 'Chaise camping pliante dossier haut',
    slug: 'chaise-camping-pliante-dossier-haut',
    shortDescription: 'Chaise de camping pliante avec dossier haut et porte-gobelet.',
    description: 'Chaise pliante legere avec accoudoirs, dossier haut et porte-gobelet. Pratique pour le camping, la plage et le jardin, disponible en vert et en noir.',
    images: ['/uploads/chaise-camping-dossier-haut-vert-noir.jpeg'],
    variants: ['Vert', 'Noir'],
  },
] as const;

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'chaises-exterieur' },
    update: { isVisible: true },
    create: {
      name: 'Chaises & Exterieur',
      slug: 'chaises-exterieur',
      description: 'Chaises et mobilier pratique pour la plage, le camping, la terrasse et le jardin.',
      imageUrl: products[0].images[0],
      sortOrder: 6,
      isVisible: true,
    },
  });

  for (const product of products) {
    const images = product.images.map((url, index) => ({
      url,
      isMain: index === 0,
      sortOrder: index,
    }));
    const variants = product.variants.map((name, index) => ({
      name,
      price: 119,
      stock: 10,
      sortOrder: index,
    }));

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        price: 119,
        oldPrice: null,
        stock: 20,
        isVisible: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        categoryId: category.id,
        images: { deleteMany: {}, create: images },
        variants: { deleteMany: {}, create: variants },
      },
      create: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        price: 119,
        stock: 20,
        isVisible: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        categoryId: category.id,
        images: { create: images },
        variants: { create: variants },
      },
    });
  }

  const savedProducts = await prisma.product.findMany({
    where: { slug: { in: products.map((product) => product.slug) } },
    select: {
      name: true,
      price: true,
      images: { select: { url: true } },
      variants: { select: { name: true, price: true }, orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { name: 'asc' },
  });

  for (const product of savedProducts) {
    const colors = product.variants.map((variant) => variant.name).join(', ');
    console.log(`${product.name}: ${product.price.toString()} DH, ${product.images.length} photo(s), couleurs ${colors}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
