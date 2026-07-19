import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const chairModels = [
  {
    name: 'Chaise de plage enfant Spider-Man',
    slug: 'chaise-plage-enfant-spiderman',
    image: '/uploads/chaise-plage-enfant-spiderman.jpeg',
    price: 150,
    shortDescription: 'Chaise pliante enfant avec parasol rouge assorti.',
    description: 'Modele Spider-Man pratique pour la plage, le jardin et les sorties en famille. Chaise pliante avec accoudoirs et parasol amovible.',
  },
  {
    name: 'Chaise de plage enfant Princesses',
    slug: 'chaise-plage-enfant-princesses',
    image: '/uploads/chaise-plage-enfant-princesses.jpeg',
    price: 150,
    shortDescription: 'Chaise pliante enfant avec parasol violet assorti.',
    description: 'Modele Princesses pratique pour la plage, le jardin et les sorties en famille. Chaise pliante avec accoudoirs et parasol amovible.',
  },
  {
    name: "Chaise de plage enfant Pat' Patrouille",
    slug: 'chaise-plage-enfant-pat-patrouille',
    image: '/uploads/chaise-plage-enfant-pat-patrouille.jpeg',
    price: 150,
    shortDescription: 'Chaise pliante enfant avec parasol bleu assorti.',
    description: "Modele Pat' Patrouille pratique pour la plage, le jardin et les sorties en famille. Chaise pliante avec accoudoirs et parasol amovible.",
  },
  {
    name: 'Chaise de plage enfant Hello Kitty',
    slug: 'chaise-plage-enfant-hello-kitty',
    image: '/uploads/chaise-plage-enfant-hello-kitty.jpeg',
    price: 150,
    shortDescription: 'Chaise pliante enfant avec parasol rose assorti.',
    description: 'Modele Hello Kitty pratique pour la plage, le jardin et les sorties en famille. Chaise pliante avec accoudoirs et parasol amovible.',
  },
  {
    name: 'Chaise pliante camping avec porte-gobelet',
    slug: 'chaise-pliante-camping-porte-gobelet',
    image: '/uploads/chaise-pliante-camping-porte-gobelet.jpeg',
    price: 75,
    shortDescription: 'Chaise pliante legere avec accoudoirs et porte-gobelet.',
    description: 'Chaise facile a transporter pour la plage, le camping, le jardin et les sorties. Presentee en bleu, noir, rouge et vert.',
  },
] as const;

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'chaises-exterieur' },
    update: { isVisible: true },
    create: {
      name: 'Chaises & Exterieur',
      slug: 'chaises-exterieur',
      description: 'Chaises, fauteuils et mobilier pratique pour la plage, le balcon, la terrasse et le jardin.',
      imageUrl: '/uploads/chaise-plage-enfant-hello-kitty.jpeg',
      sortOrder: 6,
      isVisible: true,
    },
  });

  for (const model of chairModels) {
    await prisma.product.upsert({
      where: { slug: model.slug },
      update: {
        name: model.name,
        shortDescription: model.shortDescription,
        description: model.description,
        price: model.price,
        oldPrice: null,
        stock: 10,
        isVisible: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        categoryId: category.id,
        images: {
          deleteMany: {},
          create: {
            url: model.image,
            isMain: true,
            sortOrder: 0,
          },
        },
      },
      create: {
        name: model.name,
        slug: model.slug,
        shortDescription: model.shortDescription,
        description: model.description,
        price: model.price,
        stock: 10,
        isVisible: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        categoryId: category.id,
        images: {
          create: {
            url: model.image,
            isMain: true,
            sortOrder: 0,
          },
        },
      },
    });
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: chairModels.map((model) => model.slug) } },
    select: { name: true, price: true, stock: true },
    orderBy: { name: 'asc' },
  });

  console.log(`${products.length} modeles de chaise disponibles dans ${category.name}:`);
  for (const product of products) {
    console.log(`- ${product.name}: ${product.price.toString()} DH, stock ${product.stock}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
