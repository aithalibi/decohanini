import type { Language } from '@/store/language-store';

type CategoryTranslation = { name: string; description: string };
type ProductTranslation = { name: string; description?: string };

const categoriesAr: Record<string, CategoryTranslation> = {
  decoration: { name: 'المزهريات والديكور', description: 'مزهريات ومنحوتات وقطع ديكور أنيقة للصالون وكل أركان المنزل.' },
  tableaux: { name: 'أغطية لوحة الكهرباء', description: 'لوحات ديكور عملية لإخفاء صندوق الكهرباء وتزيين الجدار.' },
  miroirs: { name: 'الأطباق وقطع التقديم', description: 'أطباق وصحون وقطع تقديم بلمسات زخرفية أنيقة.' },
  'bougies-parfums': { name: 'ديكور جداري ثلاثي الأبعاد', description: 'ألواح وكسوات وديكورات جدارية بارزة لإضفاء لمسة مميزة.' },
  accessoires: { name: 'الإكسسوارات', description: 'إكسسوارات وقطع صغيرة تضيف لمسة شخصية وأنيقة إلى منزلك.' },
  'chaises-exterieur': { name: 'الكراسي والفضاءات الخارجية', description: 'كراسي وتجهيزات عملية للشاطئ والتخييم والشرفة والحديقة.' },
  rangement: { name: 'التنظيم والتخزين', description: 'علب وأوعية وحلول عملية لتنظيم المنزل والمطبخ.' },
};

const productsAr: Record<string, ProductTranslation> = {
  'piece-decorative-moderne': { name: 'ساعة حائط خشبية ثلاثية الأبعاد' },
  'faux-livre-3-gazelles-dorees': { name: 'كتاب ديكور مع ثلاث غزالات ذهبية', description: 'طقم ديكور يتكون من كتاب أبيض وثلاث غزالات ذهبية بأحجام مختلفة، مناسب للطاولة أو الرف.' },
  'vase-decoration-noire': { name: 'مزهرية ديكور سوداء' },
  'demo-vase-pampas-dore': { name: 'مزهرية بامباس ذهبية' },
  'demo-vase-noir-sculptural': { name: 'مزهرية سوداء بتصميم فني' },
  'demo-duo-vases-minimalistes': { name: 'طقم مزهريتين بتصميم بسيط' },
  'demo-tableau-abstrait-beige-or': { name: 'لوحة تجريدية بالبيج والذهبي' },
  'demo-triptyque-lignes-modernes': { name: 'ثلاثية لوحات بخطوط عصرية' },
  'demo-cadre-calligraphie': { name: 'إطار بخط عربي عصري' },
  'demo-service-bols-ceramique': { name: 'طقم أوعية من السيراميك' },
  'demo-assiettes-murales-graphiques': { name: 'أطباق جدارية مزخرفة' },
  'demo-plateau-decoratif-dore': { name: 'صينية ديكور ذهبية' },
  'demo-horloge-murale-diy-3d': { name: 'ساعة حائط ثلاثية الأبعاد' },
  'demo-panneau-mural-geometrique': { name: 'لوح جداري هندسي' },
  'demo-decoration-feuilles-dorees': { name: 'ديكور جداري بأوراق ذهبية' },
  'demo-jeu-echecs-decoratif': { name: 'لعبة شطرنج للديكور' },
  'demo-sculpture-cerf-dore': { name: 'مجسم غزال ذهبي' },
  'demo-piece-decorative-anneau': { name: 'قطعة ديكور على شكل حلقة' },
  'demo-chaise-pliante-premium': { name: 'كرسي ممتاز قابل للطي' },
  'demo-fauteuil-exterieur-tresse': { name: 'كرسي خارجي منسوج' },
  'demo-set-pots-rangement': { name: 'طقم أوعية للتخزين' },
  'demo-boite-livre-decorative': { name: 'علبة تخزين على شكل كتاب' },
  'demo-paniers-decoratifs-naturels': { name: 'سلال طبيعية للديكور والتخزين' },
  'chaise-plage-enfant-spiderman': { name: 'كرسي شاطئ للأطفال سبايدرمان', description: 'كرسي أطفال قابل للطي مع مساند ومظلة حمراء، مناسب للشاطئ والحديقة.' },
  'chaise-plage-enfant-princesses': { name: 'كرسي شاطئ للأطفال الأميرات', description: 'كرسي أطفال قابل للطي مع مساند ومظلة بنفسجية، مناسب للشاطئ والحديقة.' },
  'chaise-plage-enfant-pat-patrouille': { name: 'كرسي شاطئ للأطفال باو باترول', description: 'كرسي أطفال قابل للطي مع مساند ومظلة زرقاء، مناسب للشاطئ والحديقة.' },
  'chaise-plage-enfant-hello-kitty': { name: 'كرسي شاطئ للأطفال هيلو كيتي', description: 'كرسي أطفال قابل للطي مع مساند ومظلة وردية، مناسب للشاطئ والحديقة.' },
  'chaise-pliante-camping-porte-gobelet': { name: 'كرسي تخييم قابل للطي مع حامل كوب', description: 'كرسي خفيف وسهل الحمل للشاطئ والتخييم والحديقة، مزود بمساند وحامل كوب.' },
  'cache-tableau-electrique-bois-home': { name: 'غطاء خشبي للوحة الكهرباء', description: 'غطاء عملي من الخشب لإخفاء لوحة الكهرباء، مزود برفين صغيرين وخطافات للمفاتيح.' },
  'chaise-basse-pliante-plage': { name: 'كرسي شاطئ منخفض قابل للطي', description: 'كرسي منخفض ومريح مع مساند، سهل الطي والحمل ومتوفر بالبيج والأسود.' },
  'chaise-camping-pliante-dossier-haut': { name: 'كرسي تخييم قابل للطي بظهر مرتفع', description: 'كرسي خفيف بظهر مرتفع ومساند وحامل كوب، مناسب للتخييم والشاطئ والحديقة.' },
  'chaise-camping-rembourree-camp-master': { name: 'كرسي تخييم مبطن كامب ماستر', description: 'كرسي مريح ومبطن، قابل للطي ومزود بمساند وحامل كوب.' },
  'vase-anneau-bicolore-blanc-dore': { name: 'مزهرية حلقية باللون الأبيض والذهبي', description: 'مزهرية عصرية بشكل حلقة، مناسبة للريش والنباتات المجففة أو كقطعة ديكور مستقلة.' },
  'lot-3-bocaux-cerf-dore': { name: 'طقم 3 أوعية بغطاء وغزال ذهبي', description: 'طقم كامل من ثلاثة أوعية شفافة بأحجام كبير ومتوسط وصغير.' },
  'coupe-marocaine-decorative-sur-pied': { name: 'صحن مغربي مزخرف على قاعدة', description: 'قطعة تقديم مستوحاة من الزخرفة المغربية، متوفرة بقياسات 20 و23 و25 سم.' },
  'rouleau-feuillage-artificiel-mural-3x1m': { name: 'لفافة نباتات اصطناعية للجدار', description: 'لفافة خضراء لإنشاء جدار نباتي للمنزل أو الشرفة، بقياس 3 أمتار في متر واحد.' },
  'cache-tableau-arbre-fleuri-blanc-dore': { name: 'غطاء لوحة الكهرباء بشجرة مزهرة', description: 'لوحة بإطار ذهبي وشجرة بيضاء مزهرة تخفي صندوق الكهرباء وتزين الجدار.' },
  'cache-tableau-calligraphie-doree': { name: 'غطاء لوحة الكهرباء بخط ذهبي', description: 'لوحة ديكور بالأسود والأبيض والذهبي مع خط بارز، مناسبة للمدخل أو الصالون.' },
  'cache-tableau-bouquet-blanc-dore': { name: 'غطاء لوحة الكهرباء بباقة بيضاء وذهبية', description: 'لوحة بإطار ذهبي وزهور بيضاء لإخفاء صندوق الكهرباء وإضاءة ديكور الجدار.' },
  'chariot-courses-pliable-roulettes-97cm': { name: 'عربة تسوق قابلة للطي بعجلات', description: 'عربة خفيفة بحقيبة واسعة وجيب خلفي، ارتفاعها 97 سم ومتوفرة بعدة ألوان.' },
  'presentoir-gateaux-2-etages-jaune-dore': { name: 'حامل حلويات بطابقين أصفر وذهبي', description: 'حامل تقديم بطابقين للحلويات والفواكه، بأطباق مزخرفة وهيكل ذهبي.' },
  'lampe-table-ceramique-blanche-marron': { name: 'مصباح طاولة من السيراميك أبيض أو بني', description: 'مصباح ديكور بقاعدة من السيراميك وغطاء قماشي، متوفر بنموذج أبيض منقط أو بني مزخرف.' },
  'lampe-table-effet-marbre-beige-dore': { name: 'مصباح طاولة بتأثير الرخام البيج والذهبي', description: 'مصباح أنيق بقاعدة بتأثير الرخام البيج ولمسات ذهبية وغطاء قماشي، مناسب للصالون أو غرفة النوم.' },
  'vaporisateur-verre-vert-dore': { name: 'بخاخ زجاجي أخضر وذهبي', description: 'بخاخ مزخرف من الزجاج الأخضر مع مضخة ذهبية، يباع بالقطعة والصينية غير مشمولة.' },
  'plateau-ovale-bambou': { name: 'صينية بيضاوية من الخيزران', description: 'صينية صغيرة من الخيزران لتنظيم القوارير والإكسسوارات، تباع وحدها والبخاخات غير مشمولة.' },
};

const variantsAr: Record<string, string> = {
  Petit: 'صغير',
  Moyen: 'متوسط',
  Grand: 'كبير',
  Beige: 'بيج',
  Noir: 'أسود',
  Vert: 'أخضر',
  Bleu: 'أزرق',
  Bordeaux: 'خمري',
  Blanche: 'بيضاء',
  Marron: 'بنية',
  Rouge: 'أحمر',
  'Bleu marine': 'أزرق داكن',
  'Bleu royal': 'أزرق ملكي',
};

export function localizeCategoryName(slug: string | undefined, fallback: string, language: Language): string {
  return language === 'AR' && slug ? categoriesAr[slug]?.name ?? fallback : fallback;
}

export function localizeCategoryDescription(slug: string, fallback: string | null | undefined, language: Language): string {
  if (language !== 'AR') return fallback ?? '';
  return categoriesAr[slug]?.description ?? 'اكتشف تشكيلتنا المختارة بعناية لمنزل أنيق ومريح.';
}

export function localizeProductName(slug: string, fallback: string, language: Language): string {
  return language === 'AR' ? productsAr[slug]?.name ?? fallback : fallback;
}

export function localizeProductDescription(slug: string, fallback: string | null | undefined, language: Language): string {
  if (language !== 'AR') return fallback ?? '';
  return productsAr[slug]?.description ?? 'قطعة مختارة بعناية لتضيف لمسة من الأناقة والدفء إلى منزلك.';
}

export function localizeVariantName(name: string, language: Language): string {
  return language === 'AR' ? variantsAr[name] ?? name : name;
}
