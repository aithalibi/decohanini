import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Update product images to use /images/products/ path (served directly by Next.js)
  const updates = [
    { name: 'Pièce décorative moderne', url: '/images/products/piece_moderne.png' },
    { name: "Jeu d'échecs de luxe", url: '/images/products/echecs2.png' },
    { name: 'Sculpture cerf doré', url: '/images/products/cerf_dore.png' },
    { name: 'Vase décoration noire', url: '/images/products/vase_noir.png' },
    { name: 'Chaise de plage', url: '/images/products/chaise_pliante.png' },
  ];

  for (const u of updates) {
    const product = await prisma.product.findFirst({ where: { name: u.name }, include: { images: true } });
    if (product) {
      // Delete old images and create new one
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.create({ data: { productId: product.id, url: u.url } });
      console.log(`Updated: ${u.name} → ${u.url}`);
    } else {
      console.log(`Not found: ${u.name}`);
    }
  }

  // Also update hero image URL
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: { heroImageUrl: '/images/hero/hero_background.png' }
  });
  console.log('Updated hero image URL');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
