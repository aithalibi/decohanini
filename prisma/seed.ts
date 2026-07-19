import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Admin user
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin',
    12
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin' },
    update: { passwordHash },
    create: {
      name: 'Administrateur',
      email: process.env.ADMIN_EMAIL || 'admin',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin créé : ${admin.email}`);

  // Paramètres du site par défaut
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      heroImageUrl: '/images/hero/hero-panorama-v2.png'
    },
    create: {
      id: 1,
      storeName: 'Déco Hanini',
      whatsappNumber: '212777422673',
      heroTitle: "L'élégance dans chaque détail",
      heroSubtitle: "Découvrez notre sélection unique de décoration pour un intérieur qui vous ressemble.",
      heroImageUrl: '/images/hero/hero-panorama-v2.png',
      deliveryText: 'Livraison partout au Maroc',
      paymentText: 'Paiement à la réception',
    },
  });
  console.log('✅ Paramètres du site créés');

  // Catégories par défaut
  const categories = [
    { name: 'Décoration', slug: 'decoration', sortOrder: 1 },
    { name: 'Tableaux', slug: 'tableaux', sortOrder: 2 },
    { name: 'Assiettes', slug: 'assiettes', sortOrder: 3 },
    { name: 'Bambou & Épices', slug: 'bambou-epices', sortOrder: 4 },
    { name: 'Chaises & Extérieur', slug: 'chaises-exterieur', sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isVisible: true },
    });
  }
  console.log('✅ Catégories créées');

  const catDeco = await prisma.category.findUnique({ where: { slug: 'decoration' } });

  if (catDeco) {
    const products = [
      {
        name: 'Pièce décorative moderne',
        slug: 'piece-decorative-moderne',
        description: 'Magnifique pièce décorative pour votre intérieur.',
        price: 150.00,
        categoryId: catDeco.id,
        isVisible: true,
        isFeatured: true,
        images: { create: [{ url: '/uploads/piece.png' }] }
      },
      {
        name: "Jeu d'échecs de luxe",
        slug: 'jeu-echecs-luxe',
        description: 'Superbe jeu d\'échecs luxueux en métal et marbre.',
        price: 450.00,
        categoryId: catDeco.id,
        isVisible: true,
        isFeatured: true,
        images: { create: [{ url: '/uploads/echecs.png' }] }
      },
      {
        name: 'Sculpture cerf doré',
        slug: 'sculpture-cerf-dore',
        description: 'Sculpture de cerf en or pour décorer votre salon.',
        price: 200.00,
        categoryId: catDeco.id,
        isVisible: true,
        isFeatured: true,
        images: { create: [{ url: '/uploads/cerf_dore.png' }] }
      },
      {
        name: 'Vase décoration noire',
        slug: 'vase-decoration-noire',
        description: 'Vase moderne noir pour vos fleurs.',
        price: 180.00,
        categoryId: catDeco.id,
        isVisible: true,
        isFeatured: true,
        images: { create: [{ url: '/uploads/vase.png' }] }
      }
    ];

    for (const p of products) {
      const existing = await prisma.product.findFirst({ where: { name: p.name } });
      if (!existing) {
        await prisma.product.create({ data: p });
      }
    }
    console.log('✅ Produits créés');
  }

  console.log('🎉 Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
