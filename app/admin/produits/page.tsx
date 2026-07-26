import React from 'react';
import Link from 'next/link';
import { Plus, Package, Star } from 'lucide-react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import ProductTable from '@/components/admin/ProductTable';
import ProductMobileCard from '@/components/admin/ProductMobileCard';
import EmptyState from '@/components/admin/EmptyState';
import AdminProductFilters from '@/components/admin/AdminProductFilters';
import { AdminText } from '@/components/admin/AdminI18n';

interface ProductsPageProps {
  searchParams: Promise<{
    categoryId?: string;
    search?: string;
    isVisible?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  const filters = {
    categoryId: resolvedSearchParams.categoryId ? Number(resolvedSearchParams.categoryId) : undefined,
    search: resolvedSearchParams.search || undefined,
    isVisible: resolvedSearchParams.isVisible ? resolvedSearchParams.isVisible === 'true' : undefined,
  };

  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);

  const serializedProducts = JSON.parse(
    JSON.stringify(products, (_key, value) =>
      typeof value === 'object' && value !== null && value.constructor?.name === 'Decimal' ? Number(value) : value
    )
  ) as typeof products;

  return (
    <AdminLayoutClient
      title="Produits"
      titleAr="المنتجات"
      subtitle="Gérez votre catalogue de produits"
      subtitleAr="إدارة كتالوج المنتجات"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminProductFilters
            categories={categories.map(({ id, name }) => ({ id, name }))}
            search={filters.search}
            categoryId={filters.categoryId}
          />

          <Link
            href="/admin/produits/nouveau"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E52329] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#B8161B] sm:w-auto"
          >
            <Plus size={18} />
            <AdminText fr="Ajouter un produit" ar="إضافة منتج" />
          </Link>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="flex items-start gap-2">
            <Star size={16} className="mt-0.5 shrink-0 fill-current" />
            <p>
              <AdminText
                fr="Utilisez l'étoile dans la liste produits pour afficher un article dans Nos pièces phares. Le site reprend automatiquement ces produits sur la landing page."
                ar="استعمل النجمة في لائحة المنتجات لعرض المنتج داخل قسم Nos pièces phares. سيتم تحديث الصفحة الرئيسية تلقائيا."
              />
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white">
            <EmptyState
              icon={Package}
              title={<AdminText fr="Aucun produit trouvé" ar="لم يتم العثور على منتجات" />}
              description={
                <AdminText
                  fr="Ajoutez votre premier produit ou modifiez vos filtres de recherche."
                  ar="أضف أول منتج أو غيّر معايير البحث."
                />
              }
              action={
                <Link href="/admin/produits/nouveau" className="font-bold text-[#E52329] hover:underline">
                  <AdminText fr="Ajouter un produit" ar="إضافة منتج" />
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <div className="hidden sm:block">
              <ProductTable products={serializedProducts} />
            </div>

            <div className="space-y-4 sm:hidden">
              {serializedProducts.map((product) => (
                <ProductMobileCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayoutClient>
  );
}
