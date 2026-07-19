import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'chaises-exterieur' } });
  if (!cat) {
    console.error('Category not found');
    return;
  }

  const existing = await prisma.product.findFirst({ where: { name: 'Chaise de plage' } });
  if (!existing) {
    await prisma.product.create({
      data: {
        name: 'Chaise de plage',
        slug: 'chaise-plage',
        description: 'Chaise pliante idéale pour la plage et la terrasse.',
        price: 119.00,
        categoryId: cat.id,
        isVisible: true,
        isFeatured: true,
        images: { create: [{ url: '/uploads/chaise.png' }] }
      }
    });
    console.log('Product created');
  } else {
    console.log('Product already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
