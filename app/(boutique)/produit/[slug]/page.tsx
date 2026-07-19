import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/actions/products';
import { getSettings } from '@/actions/settings';
import ProductDetails from '@/components/product/ProductDetails';
import ProductCard from '@/components/product/ProductCard';
import { LocalizedCategoryName, LocalizedProductName, LocalizedText } from '@/components/i18n/LocalizedText';
import { toStoreProduct } from '@/lib/storefront';

export default async function ProductPage({ params }: PageProps<'/produit/[slug]'>) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSettings()]);
  if (!product || !product.isVisible) notFound();
  const storeProduct = toStoreProduct(product);
  const related = (await getProducts({ categoryId: product.categoryId, isVisible: true }))
    .filter((item) => item.id !== product.id)
    .slice(0, 4)
    .map(toStoreProduct);

  return (
    <section className="bg-brand-cream">
      <div className="container mx-auto px-3 py-8 sm:px-5 lg:px-8 lg:py-12">
        <nav className="no-scrollbar mb-8 flex items-center gap-1 overflow-x-auto whitespace-nowrap text-xs text-brand-gray-text"><Link href="/"><LocalizedText fr="Accueil" ar="الرئيسية" /></Link><ChevronRight size={13} /><Link href="/boutique"><LocalizedText fr="Boutique" ar="المتجر" /></Link><ChevronRight size={13} /><Link href={`/categorie/${product.category.slug}`}><LocalizedCategoryName slug={product.category.slug} fallback={product.category.name} /></Link><ChevronRight size={13} /><span className="truncate text-brand-brown"><LocalizedProductName slug={product.slug} fallback={product.name} /></span></nav>
        <ProductDetails product={storeProduct} images={product.images.map((image) => image.url)} description={product.description} dimensions={product.dimensions} whatsappNumber={settings.whatsappNumber} />
        {related.length > 0 && <div className="mt-16 border-t border-brand-sand pt-12 md:mt-20"><div className="mb-8 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel"><LocalizedText fr="Pour compléter votre intérieur" ar="أكمل ديكور منزلك" /></p><h2 className="mt-2 font-serif text-3xl"><LocalizedText fr="Vous aimerez aussi" ar="قد يعجبك أيضاً" /></h2></div><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div>}
      </div>
    </section>
  );
}
