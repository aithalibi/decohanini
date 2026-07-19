import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database...');
  await prisma.productImage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('🌱 Seeding mockup categories...');
  const categories = [
    { name: 'Décoration', slug: 'decoration', imageUrl: '/images/categories/decoration.png', sortOrder: 1 },
    { name: 'Tableaux', slug: 'tableaux', imageUrl: '/images/categories/tableaux.png', sortOrder: 2 },
    { name: 'Miroirs', slug: 'miroirs', imageUrl: '/images/categories/miroirs.png', sortOrder: 3 },
    { name: 'Bougies & Parfums', slug: 'bougies-parfums', imageUrl: '/images/categories/bougies.png', sortOrder: 4 },
    { name: 'Accessoires', slug: 'accessoires', imageUrl: '/images/categories/accessoires.png', sortOrder: 5 },
  ];

  const dbCategories: Record<string, { id: number }> = {};
  for (const cat of categories) {
    dbCategories[cat.slug] = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
        isVisible: true,
        updatedAt: new Date(),
      },
    });
  }

  console.log('🌱 Seeding mockup products...');
  const products = [
    {
      name: 'Pièce décorative moderne',
      slug: 'piece-decorative-moderne',
      description: 'Magnifique pièce décorative pour votre intérieur.',
      price: 150.00,
      categoryId: dbCategories['decoration'].id,
      isVisible: true,
      isFeatured: true,
      image: '/images/products/piece_moderne.png'
    },
    {
      name: "Jeu d'échecs de luxe",
      slug: 'jeu-echecs-luxe',
      description: 'Superbe jeu d\'échecs luxueux en métal et marbre.',
      price: 450.00,
      categoryId: dbCategories['decoration'].id,
      isVisible: true,
      isFeatured: true,
      image: '/images/products/echecs2.png'
    },
    {
      name: 'Sculpture cerf doré',
      slug: 'sculpture-cerf-dore',
      description: 'Sculpture de cerf en or pour décorer votre salon.',
      price: 200.00,
      categoryId: dbCategories['decoration'].id,
      isVisible: true,
      isFeatured: true,
      image: '/images/products/cerf_dore.png'
    },
    {
      name: 'Vase décoration noire',
      slug: 'vase-decoration-noire',
      description: 'Vase moderne noir pour vos fleurs.',
      price: 180.00,
      categoryId: dbCategories['decoration'].id,
      isVisible: true,
      isFeatured: true,
      image: '/images/products/vase_noir.png'
    }
  ];

  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        categoryId: p.categoryId,
        isVisible: p.isVisible,
        isFeatured: p.isFeatured,
        updatedAt: new Date(),
      }
    });

    await prisma.productImage.create({
      data: {
        url: p.image,
        isMain: true,
        sortOrder: 0,
        productId: created.id
      }
    });
  }

  console.log('🌱 Seeding site settings...');
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      heroImageUrl: '/uploads/hero_bg.png',
      heroTitle: "L'élégance dans chaque détail",
      heroSubtitle: "Découvrez notre sélection unique de décoration pour un intérieur qui vous ressemble.",
      updatedAt: new Date(),
    },
    create: {
      id: 1,
      storeName: 'Déco Hanini',
      whatsappNumber: '212777422673',
      heroTitle: "L'élégance dans chaque détail",
      heroSubtitle: "Découvrez notre sélection unique de décoration pour un intérieur qui vous ressemble.",
      heroImageUrl: '/uploads/hero_bg.png',
      deliveryText: 'Livraison partout au Maroc',
      paymentText: 'Paiement à la réception',
      updatedAt: new Date(),
    },
  });

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
