import Link from 'next/link';
import { Search } from 'lucide-react';
import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import ProductCard from '@/components/product/ProductCard';
import { LocalizedCategoryName, LocalizedText } from '@/components/i18n/LocalizedText';
import { LocalizedSearchInput, LocalizedSortSelect } from '@/components/i18n/LocalizedShopControls';
import { toStoreProduct } from '@/lib/storefront';

type ShopSearchParams = Promise<{ recherche?: string | string[]; categorie?: string | string[]; prixMin?: string | string[]; prixMax?: string | string[]; disponible?: string | string[]; tri?: string | string[]; page?: string | string[] }>;

export const metadata = { title: 'Boutique décoration | Déco Hanini' };

export default async function ShopPage({ searchParams }: { searchParams: ShopSearchParams }) {
  const query = await searchParams;
  const search = typeof query.recherche === 'string' ? query.recherche.trim() : '';
  const categorySlug = typeof query.categorie === 'string' ? query.categorie : '';
  const minPrice = typeof query.prixMin === 'string' && query.prixMin !== '' ? Math.max(0, Number(query.prixMin)) : undefined;
  const maxPrice = typeof query.prixMax === 'string' && query.prixMax !== '' ? Math.max(0, Number(query.prixMax)) : undefined;
  const inStock = query.disponible === '1';
  const sort = query.tri === 'prix-asc' || query.tri === 'prix-desc' || query.tri === 'name' ? query.tri : 'newest';
  const currentPage = typeof query.page === 'string' ? Math.max(1, Number(query.page) || 1) : 1;
  const categories = (await getCategories()).filter((category) => category.isVisible);
  const activeCategory = categories.find((category) => category.slug === categorySlug);
  const products = await getProducts({ isVisible: true, search: search || undefined, categoryId: activeCategory?.id, minPrice: Number.isFinite(minPrice) ? minPrice : undefined, maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined, inStock, sort });
  const allStoreProducts = products.map(toStoreProduct);
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(allStoreProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const storeProducts = allStoreProducts.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set('recherche', search);
    if (categorySlug) params.set('categorie', categorySlug);
    if (minPrice !== undefined) params.set('prixMin', String(minPrice));
    if (maxPrice !== undefined) params.set('prixMax', String(maxPrice));
    if (inStock) params.set('disponible', '1');
    if (sort !== 'newest') params.set('tri', sort);
    params.set('page', String(page));
    return `/boutique?${params.toString()}`;
  };

  return (
    <section className="bg-brand-cream pb-16">
      <div className="warm-speckle border-b border-brand-sand px-4 py-11 text-center md:py-14">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-caramel">Déco Hanini</p>
        <h1 className="mt-2 font-serif text-4xl text-brand-espresso md:text-5xl"><LocalizedText fr="Notre boutique" ar="متجرنا" /></h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-brand-gray-text"><LocalizedText fr="Découvrez toutes nos pièces de décoration sélectionnées pour sublimer votre intérieur." ar="اكتشف جميع قطع الديكور المختارة بعناية لتجميل منزلك." /></p>
      </div>
      <div className="container mx-auto px-3 py-9 sm:px-5 lg:px-8">
        <form className="mb-7 flex overflow-hidden rounded-full border border-brand-taupe bg-brand-white md:hidden">
          <LocalizedSearchInput defaultValue={search} className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" />
          <button type="submit" className="w-12 bg-brand-espresso text-brand-cream"><Search className="mx-auto" size={18} /></button>
        </form>
        <form className="mb-8 grid gap-3 rounded-[20px] border border-brand-sand bg-brand-white p-4 sm:grid-cols-2 lg:grid-cols-5">
          {search && <input type="hidden" name="recherche" value={search} />}
          {categorySlug && <input type="hidden" name="categorie" value={categorySlug} />}
          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown"><LocalizedText fr="Prix minimum" ar="أقل ثمن" /><input name="prixMin" type="number" min="0" defaultValue={minPrice} placeholder="0 DH" className="mt-1.5 h-10 w-full rounded-xl border border-brand-sand px-3 text-sm font-normal outline-none focus:border-brand-caramel" /></label>
          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown"><LocalizedText fr="Prix maximum" ar="أعلى ثمن" /><input name="prixMax" type="number" min="0" defaultValue={maxPrice} placeholder="500 DH" className="mt-1.5 h-10 w-full rounded-xl border border-brand-sand px-3 text-sm font-normal outline-none focus:border-brand-caramel" /></label>
          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-brown"><LocalizedText fr="Trier par" ar="الترتيب حسب" /><LocalizedSortSelect defaultValue={sort} className="mt-1.5 h-10 w-full rounded-xl border border-brand-sand px-3 text-sm font-normal outline-none focus:border-brand-caramel" /></label>
          <label className="flex h-10 items-center gap-2 self-end rounded-xl border border-brand-sand px-3 text-xs font-semibold"><input type="checkbox" name="disponible" value="1" defaultChecked={inStock} /><LocalizedText fr="En stock seulement" ar="المتوفر فقط" /></label>
          <button type="submit" className="h-10 self-end rounded-full bg-brand-espresso px-5 text-xs font-bold uppercase tracking-wider text-brand-cream"><LocalizedText fr="Appliquer" ar="تطبيق" /></button>
        </form>
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          <Link href={search ? `/boutique?recherche=${encodeURIComponent(search)}` : '/boutique'} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold ${!activeCategory ? 'border-brand-espresso bg-brand-espresso text-brand-cream' : 'border-brand-taupe bg-brand-white text-brand-brown'}`}><LocalizedText fr="Tous" ar="الكل" /></Link>
          {categories.map((category) => <Link key={category.id} href={`/categorie/${category.slug}`} className="shrink-0 rounded-full border border-brand-taupe bg-brand-white px-4 py-2 text-xs font-semibold text-brand-brown"><LocalizedCategoryName slug={category.slug} fallback={category.name} /></Link>)}
        </div>
        <div className="grid gap-9 lg:grid-cols-[230px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-5 rounded-[22px] border border-brand-sand bg-brand-white p-5">
              <h2 className="border-b border-brand-sand pb-4 text-xs font-bold uppercase tracking-[0.16em]"><LocalizedText fr="Catégories" ar="الفئات" /></h2>
              <nav className="mt-3 flex flex-col text-sm">
                <Link href="/boutique" className={`border-b border-brand-sand py-3 ${!activeCategory ? 'font-bold text-brand-caramel' : 'text-brand-gray-text hover:text-brand-caramel'}`}><LocalizedText fr="Tous les produits" ar="جميع المنتجات" /></Link>
                {categories.map((category) => <Link key={category.id} href={`/categorie/${category.slug}`} className="border-b border-brand-sand py-3 text-brand-gray-text hover:text-brand-caramel"><LocalizedCategoryName slug={category.slug} fallback={category.name} /><span className="float-right text-xs text-brand-taupe">{category._count.products}</span></Link>)}
              </nav>
              <div className="mt-7 rounded-2xl bg-brand-beige p-4 text-xs leading-6 text-brand-gray-text"><strong className="block text-sm text-brand-espresso"><LocalizedText fr="Paiement à la livraison" ar="الدفع عند الاستلام" /></strong><LocalizedText fr="Aucune carte bancaire nécessaire. Payez à la réception." ar="لا تحتاج إلى بطاقة بنكية، ادفع عند استلام طلبك." /></div>
            </div>
          </aside>
          <div id="produits">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-brand-sand pb-4">
              <div><p className="text-[10px] uppercase tracking-[0.18em] text-brand-caramel"><LocalizedText fr="Catalogue" ar="الكتالوج" /></p><h2 className="mt-1 font-serif text-2xl">{activeCategory ? <LocalizedCategoryName slug={activeCategory.slug} fallback={activeCategory.name} /> : search ? <><LocalizedText fr="Résultats pour" ar="نتائج البحث عن" /> “{search}”</> : <LocalizedText fr="Tous les produits" ar="جميع المنتجات" />}</h2></div>
              <span className="text-xs text-brand-gray-text">{allStoreProducts.length} <LocalizedText fr="produit(s)" ar="منتج" /></span>
            </div>
            {storeProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-11 xl:grid-cols-3 2xl:grid-cols-4">{storeProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-brand-taupe py-20 text-center"><Search className="mx-auto text-brand-taupe" size={38} /><h3 className="mt-4 font-serif text-2xl"><LocalizedText fr="Aucun produit trouvé" ar="لم يتم العثور على منتجات" /></h3><p className="mt-2 text-sm text-brand-gray-text"><LocalizedText fr="Essayez une autre recherche ou une autre catégorie." ar="جرّب بحثاً أو فئة أخرى." /></p><Link href="/boutique" className="mt-6 inline-block rounded-full bg-brand-espresso px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-cream"><LocalizedText fr="Voir toute la boutique" ar="عرض المتجر كاملاً" /></Link></div>
            )}
            {totalPages > 1 && <nav className="mt-9 flex items-center justify-center gap-2" aria-label="Pagination">{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <Link key={page} href={pageHref(page)} className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold ${page === safePage ? 'bg-brand-espresso text-brand-cream' : 'border border-brand-taupe bg-brand-white text-brand-brown'}`}>{page}</Link>)}</nav>}
          </div>
        </div>
      </div>
    </section>
  );
}
