import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajoute des images pour les catégories en utilisant les images de produits existantes
  const catImages: { slug: string; imageUrl: string }[] = [
    { slug: 'decoration', imageUrl: '/images/products/cerf_dore.png' },
    { slug: 'tableaux', imageUrl: '/images/products/echecs2.png' },
    { slug: 'assiettes', imageUrl: '/images/products/piece_moderne.png' },
    { slug: 'bambou-epices', imageUrl: '/images/products/vase_noir.png' },
    { slug: 'chaises-exterieur', imageUrl: '/images/products/chaise_pliante.png' },
  ];

  for (const c of catImages) {
    await prisma.category.update({
      where: { slug: c.slug },
      data: { imageUrl: c.imageUrl },
    });
    console.log(`Updated category: ${c.slug}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
