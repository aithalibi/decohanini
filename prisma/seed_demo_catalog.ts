import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DemoVariant = { name: string; price: number; oldPrice?: number; stock: number };
type DemoProduct = {
  name: string;
  slug: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  secondImage?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  dimensions?: string;
  variants?: DemoVariant[];
};

const categories = [
  { slug: 'decoration', fallbackName: 'Vases', description: 'Vases, sculptures et objets décoratifs pour le salon.', imageUrl: '/images/categories/decoration.png', sortOrder: 1 },
  { slug: 'tableaux', fallbackName: 'Tableaux', description: 'Tableaux modernes, cadres et compositions murales.', imageUrl: '/images/categories/tableaux.png', sortOrder: 2 },
  { slug: 'miroirs', fallbackName: 'Assiettes décoratives', description: 'Vaisselle et assiettes décoratives aux finitions élégantes.', imageUrl: '/images/categories/assiettes.png', sortOrder: 3 },
  { slug: 'bougies-parfums', fallbackName: 'Panneaux 3D', description: 'Panneaux, horloges et décoration murale en relief.', imageUrl: '/images/categories/bougies.png', sortOrder: 4 },
  { slug: 'accessoires', fallbackName: 'Accessoires', description: 'Petits objets et accessoires pour personnaliser votre intérieur.', imageUrl: '/images/categories/accessoires.png', sortOrder: 5 },
  { slug: 'chaises-exterieur', fallbackName: 'Chaises & Extérieur', description: 'Mobilier pratique pour balcon, terrasse et jardin.', imageUrl: '/images/categories/chaises.png', sortOrder: 6 },
  { slug: 'rangement', fallbackName: 'Rangement', description: 'Pots, boîtes et solutions de rangement décoratives.', imageUrl: '/images/categories/bambou.png', sortOrder: 7 },
];

const products: DemoProduct[] = [
  { name: 'Vase pampas doré', slug: 'demo-vase-pampas-dore', categorySlug: 'decoration', shortDescription: 'Un vase doré lumineux pour fleurs séchées et pampas.', description: 'Vase décoratif à finition dorée, idéal sur une console, une table basse ou dans une entrée.', price: 90, oldPrice: 110, stock: 16, image: '/images/products/vases.png', secondImage: '/images/products/vase_noir.png', isFeatured: true, isOnSale: true, variants: [{ name: 'Petit', price: 90, oldPrice: 110, stock: 7 }, { name: 'Moyen', price: 120, oldPrice: 140, stock: 5 }, { name: 'Grand', price: 160, oldPrice: 190, stock: 4 }] },
  { name: 'Vase noir sculptural', slug: 'demo-vase-noir-sculptural', categorySlug: 'decoration', shortDescription: 'Silhouette moderne et finition noire mate.', description: 'Une pièce graphique qui apporte du contraste à une décoration beige, blanche ou boisée.', price: 180, stock: 8, image: '/images/products/vase_noir.png', isFeatured: true, dimensions: '32 × 14 cm' },
  { name: 'Duo de vases minimalistes', slug: 'demo-duo-vases-minimalistes', categorySlug: 'decoration', shortDescription: 'Deux vases assortis aux lignes douces.', description: 'Ensemble décoratif facile à associer avec des pampas ou à exposer seul.', price: 145, oldPrice: 170, stock: 10, image: '/images/categories/decoration.png', isNew: true, isOnSale: true },

  { name: 'Tableau abstrait beige et or', slug: 'demo-tableau-abstrait-beige-or', categorySlug: 'tableaux', shortDescription: 'Des tons chaleureux pour une ambiance élégante.', description: 'Tableau décoratif contemporain dans une palette beige, brune et dorée.', price: 220, stock: 9, image: '/images/categories/tableaux.png', isFeatured: true, dimensions: '60 × 90 cm' },
  { name: 'Triptyque lignes modernes', slug: 'demo-triptyque-lignes-modernes', categorySlug: 'tableaux', shortDescription: 'Composition de trois cadres coordonnés.', description: 'Un ensemble prêt à structurer le mur du salon, de la chambre ou du bureau.', price: 350, oldPrice: 400, stock: 5, image: '/uploads/1784461501897-s2pp9z1zqom.jpg', isOnSale: true, dimensions: '3 cadres de 40 × 60 cm' },
  { name: 'Cadre calligraphie contemporaine', slug: 'demo-cadre-calligraphie', categorySlug: 'tableaux', shortDescription: 'Une touche artistique sobre et raffinée.', description: 'Cadre moderne inspiré de la calligraphie, proposé en deux formats.', price: 140, stock: 12, image: '/images/products/piece_moderne.png', isNew: true, variants: [{ name: '40 × 60 cm', price: 140, stock: 7 }, { name: '60 × 90 cm', price: 210, stock: 5 }] },

  { name: 'Service de bols en céramique', slug: 'demo-service-bols-ceramique', categorySlug: 'miroirs', shortDescription: 'Un service élégant pour vos tables du quotidien.', description: 'Bols décoratifs en céramique aux tons neutres, faciles à associer à votre vaisselle.', price: 160, stock: 14, image: '/images/products/bols.png', isFeatured: true },
  { name: 'Assiettes murales graphiques', slug: 'demo-assiettes-murales-graphiques', categorySlug: 'miroirs', shortDescription: 'Un ensemble mural original aux motifs modernes.', description: 'Assiettes décoratives à suspendre pour créer une composition murale unique.', price: 210, oldPrice: 240, stock: 6, image: '/images/categories/assiettes.png', isOnSale: true },
  { name: 'Plateau décoratif doré', slug: 'demo-plateau-decoratif-dore', categorySlug: 'miroirs', shortDescription: 'Pour bougies, parfums ou petits accessoires.', description: 'Plateau décoratif polyvalent avec finition dorée et fond miroir.', price: 130, stock: 11, image: '/uploads/1784461569436-wa2cysneq4.jpg', isNew: true },

  { name: 'Horloge murale DIY 3D', slug: 'demo-horloge-murale-diy-3d', categorySlug: 'bougies-parfums', shortDescription: 'Une horloge moderne à composer selon votre mur.', description: 'Kit d’horloge murale en relief, facile à installer et disponible en deux diamètres.', price: 70, stock: 17, image: '/images/products/horloge.png', isFeatured: true, variants: [{ name: 'Diamètre 80 cm', price: 70, stock: 10 }, { name: 'Diamètre 120 cm', price: 100, stock: 7 }] },
  { name: 'Panneau mural géométrique', slug: 'demo-panneau-mural-geometrique', categorySlug: 'bougies-parfums', shortDescription: 'Relief géométrique aux reflets dorés.', description: 'Panneau décoratif 3D pour habiller un mur principal avec caractère.', price: 260, oldPrice: 300, stock: 6, image: '/uploads/1784461743143-wx7jfi39l.jpg', isOnSale: true, dimensions: '70 × 100 cm' },
  { name: 'Décoration murale feuilles dorées', slug: 'demo-decoration-feuilles-dorees', categorySlug: 'bougies-parfums', shortDescription: 'Une composition légère inspirée de la nature.', description: 'Décoration murale métallique parfaite au-dessus d’une console ou d’un canapé.', price: 195, stock: 8, image: '/images/categories/bougies.png', isNew: true },

  { name: "Jeu d’échecs décoratif", slug: 'demo-jeu-echecs-decoratif', categorySlug: 'accessoires', shortDescription: 'Un objet décoratif qui reste entièrement jouable.', description: 'Jeu d’échecs élégant à exposer sur une table basse ou dans une bibliothèque.', price: 450, stock: 5, image: '/images/products/echecs2.png', secondImage: '/images/products/echecs.png', isFeatured: true },
  { name: 'Sculpture cerf doré', slug: 'demo-sculpture-cerf-dore', categorySlug: 'accessoires', shortDescription: 'Une sculpture lumineuse au style contemporain.', description: 'Cerf décoratif doré pour apporter une note raffinée à votre salon.', price: 200, stock: 9, image: '/images/products/cerf_dore.png', isFeatured: true },
  { name: 'Pièce décorative anneau', slug: 'demo-piece-decorative-anneau', categorySlug: 'accessoires', shortDescription: 'Une silhouette abstraite et minimaliste.', description: 'Objet décoratif moderne à poser sur des livres, une étagère ou une console.', price: 150, oldPrice: 175, stock: 13, image: '/images/products/piece_moderne.png', isNew: true, isOnSale: true },

  { name: 'Chaise pliante premium', slug: 'demo-chaise-pliante-premium', categorySlug: 'chaises-exterieur', shortDescription: 'Confortable, élégante et facile à ranger.', description: 'Chaise pliante robuste adaptée au balcon, à la terrasse et aux sorties.', price: 280, stock: 10, image: '/images/products/chaise_pliante.png', isFeatured: true, variants: [{ name: 'Beige', price: 280, stock: 6 }, { name: 'Noir', price: 280, stock: 4 }] },
  { name: 'Fauteuil extérieur tressé', slug: 'demo-fauteuil-exterieur-tresse', categorySlug: 'chaises-exterieur', shortDescription: 'Une assise accueillante pour votre terrasse.', description: 'Fauteuil d’extérieur au style naturel avec structure résistante.', price: 340, stock: 7, image: '/images/products/chaise.png', isNew: true },

  { name: 'Set de pots de rangement', slug: 'demo-set-pots-rangement', categorySlug: 'rangement', shortDescription: 'Trois pots assortis pour une cuisine organisée.', description: 'Pots décoratifs avec couvercles, parfaits pour café, thé et sucre.', price: 120, stock: 15, image: '/images/products/pots.png', isFeatured: true },
  { name: 'Boîte livre décorative', slug: 'demo-boite-livre-decorative', categorySlug: 'rangement', shortDescription: 'Un faux livre élégant qui cache vos petits objets.', description: 'Boîte de rangement en forme de livre de mode, idéale sur une table basse.', price: 50, stock: 20, image: '/images/products/piece_moderne.png', variants: [{ name: '1 livre', price: 50, stock: 12 }, { name: 'Lot de 3 livres', price: 120, stock: 8 }] },
  { name: 'Paniers décoratifs naturels', slug: 'demo-paniers-decoratifs-naturels', categorySlug: 'rangement', shortDescription: 'Rangement pratique avec une texture chaleureuse.', description: 'Paniers polyvalents pour plaids, magazines ou accessoires du quotidien.', price: 95, stock: 12, image: '/images/categories/bambou.png', isNew: true },
];

async function main() {
  console.log('Ajout du catalogue de démonstration...');
  const categoryIds = new Map<string, number>();

  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        description: category.description,
        isVisible: true,
      },
      create: {
        name: category.fallbackName,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder,
        isVisible: true,
      },
    });
    categoryIds.set(category.slug, saved.id);
  }

  let createdCount = 0;
  let skippedCount = 0;
  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existing) {
      skippedCount += 1;
      continue;
    }

    const categoryId = categoryIds.get(product.categorySlug);
    if (!categoryId) throw new Error(`Catégorie absente: ${product.categorySlug}`);
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        stock: product.stock,
        dimensions: product.dimensions ?? null,
        categoryId,
        isVisible: true,
        isFeatured: product.isFeatured ?? false,
        isNew: product.isNew ?? false,
        isOnSale: product.isOnSale ?? false,
        images: {
          create: [product.image, product.secondImage].filter((image): image is string => Boolean(image)).map((url, index) => ({
            url,
            isMain: index === 0,
            sortOrder: index,
          })),
        },
        variants: product.variants ? {
          create: product.variants.map((variant, index) => ({
            name: variant.name,
            price: variant.price,
            oldPrice: variant.oldPrice ?? null,
            stock: variant.stock,
            sortOrder: index,
          })),
        } : undefined,
      },
    });
    createdCount += 1;
  }

  console.log(`${createdCount} produits ajoutés, ${skippedCount} déjà présents.`);
  const summary = await prisma.category.findMany({
    select: { name: true, _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  });
  const totalProducts = await prisma.product.count();
  console.log(`Total catalogue: ${totalProducts} produits dans ${summary.length} catégories.`);
  for (const category of summary) {
    console.log(`- ${category.name}: ${category._count.products} produit(s)`);
  }
  console.log('Catalogue de démonstration prêt.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
