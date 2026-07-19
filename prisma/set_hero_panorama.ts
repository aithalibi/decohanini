import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: { heroImageUrl: '/images/hero/hero-panorama-v2.png' },
    create: {
      id: 1,
      storeName: 'Déco Hanini',
      whatsappNumber: '212777422673',
      heroTitle: "L'élégance dans chaque détail",
      heroSubtitle: 'Découvrez notre sélection unique de décoration pour un intérieur qui vous ressemble.',
      heroImageUrl: '/images/hero/hero-panorama-v2.png',
      deliveryText: 'Livraison partout au Maroc',
      paymentText: 'Paiement à la réception',
    },
  });
  console.log('Image panoramique activée.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
