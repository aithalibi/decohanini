import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getCategoryBySlug, getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import ProductCard from '@/components/product/ProductCard';
import { LocalizedCategoryDescription, LocalizedCategoryName, LocalizedText } from '@/components/i18n/LocalizedText';
import { toStoreProduct } from '@/lib/storefront';

export default async function CategoryPage({ params }: PageProps<'/categorie/[slug]'>) {
  const { slug } = await params;
  const [category, allCategories] = await Promise.all([getCategoryBySlug(slug), getCategories()]);
  if (!category || !category.isVisible) notFound();
  const products = await getProducts({ categoryId: category.id, isVisible: true });
  const storeProducts = products.map(toStoreProduct);

  return (
    <section className="bg-brand-cream pb-16">
      <div className="warm-speckle border-b border-brand-sand px-4 py-10 text-center">
        <p className="flex items-center justify-center gap-1 text-xs text-brand-gray-text"><Link href="/"><LocalizedText fr="Accueil" ar="الرئيسية" /></Link><ChevronRight size={13} /><Link href="/boutique"><LocalizedText fr="Boutique" ar="المتجر" /></Link><ChevronRight size={13} /><span><LocalizedCategoryName slug={category.slug} fallback={category.name} /></span></p>
        <h1 className="mt-3 font-serif text-4xl text-brand-espresso md:text-5xl"><LocalizedCategoryName slug={category.slug} fallback={category.name} /></h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-brand-gray-text"><LocalizedCategoryDescription slug={category.slug} fallback={category.description} /></p>
      </div>
      <div className="container mx-auto px-3 py-9 sm:px-5 lg:px-8">
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2">
          <Link href="/boutique" className="shrink-0 rounded-full border border-brand-taupe bg-brand-white px-4 py-2 text-xs font-semibold text-brand-brown"><LocalizedText fr="Tous" ar="الكل" /></Link>
          {allCategories.filter((item) => item.isVisible).map((item) => <Link key={item.id} href={`/categorie/${item.slug}`} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold ${item.id === category.id ? 'border-brand-espresso bg-brand-espresso text-brand-cream' : 'border-brand-taupe bg-brand-white text-brand-brown'}`}><LocalizedCategoryName slug={item.slug} fallback={item.name} /></Link>)}
        </div>
        <div className="mb-6 flex items-end justify-between gap-3 border-b border-brand-sand pb-4"><h2 className="font-serif text-xl sm:text-2xl"><LocalizedText fr="Tous les" ar="جميع منتجات" /> <LocalizedCategoryName slug={category.slug} fallback={category.name} /></h2><span className="shrink-0 text-xs text-brand-gray-text">{storeProducts.length} <LocalizedText fr="produit(s)" ar="منتج" /></span></div>
        {storeProducts.length > 0 ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-11 md:grid-cols-3 lg:grid-cols-4">{storeProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-[24px] border border-dashed border-brand-taupe py-20 text-center"><h2 className="font-serif text-2xl"><LocalizedText fr="Cette catégorie sera bientôt remplie" ar="ستتوفر منتجات هذه الفئة قريباً" /></h2><p className="mt-2 text-sm text-brand-gray-text"><LocalizedText fr="Ajoutez ses produits depuis le panneau administrateur." ar="يمكن إضافة المنتجات من لوحة الإدارة." /></p><Link href="/boutique" className="mt-6 inline-block rounded-full bg-brand-espresso px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-cream"><LocalizedText fr="Voir les autres produits" ar="عرض المنتجات الأخرى" /></Link></div>}
      </div>
    </section>
  );
}
