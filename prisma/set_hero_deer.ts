import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: { heroImageUrl: '/images/products/cerf_dore.png' }
  });
  console.log('Successfully set heroImageUrl to /images/products/cerf_dore.png');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
