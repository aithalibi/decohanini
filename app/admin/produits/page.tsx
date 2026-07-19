import React from 'react';
import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import ProductTable from '@/components/admin/ProductTable';
import ProductMobileCard from '@/components/admin/ProductMobileCard';
import EmptyState from '@/components/admin/EmptyState';
import AdminProductFilters from '@/components/admin/AdminProductFilters';
import { AdminText } from '@/components/admin/AdminI18n';

// In Next.js 15, searchParams is a Promise
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

  const [products, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);

  // Serialize Decimal/Date fields for Client Component
  const serializedProducts = JSON.parse(JSON.stringify(products, (_key, value) =>
    typeof value === 'object' && value !== null && value.constructor?.name === 'Decimal'
      ? Number(value)
      : value
  )) as typeof products;

  return (
    <AdminLayoutClient title="Produits" titleAr="المنتجات" subtitle="Gérez votre catalogue de produits" subtitleAr="إدارة كتالوج المنتجات">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Actions & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-gray-200">
          <AdminProductFilters categories={categories.map(({ id, name }) => ({ id, name }))} search={filters.search} categoryId={filters.categoryId} />

          <Link
            href="/admin/produits/nouveau"
            className="w-full sm:w-auto bg-[#E52329] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#B8161B] transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <AdminText fr="Ajouter un produit" ar="إضافة منتج" />
          </Link>
        </div>

        {/* Content */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200">
            <EmptyState
              icon={Package}
              title={<AdminText fr="Aucun produit trouvé" ar="لم يتم العثور على منتجات" />}
              description={<AdminText fr="Ajoutez votre premier produit ou modifiez vos filtres de recherche." ar="أضف أول منتج أو غيّر معايير البحث." />}
              action={
                <Link
                  href="/admin/produits/nouveau"
                  className="text-[#E52329] font-bold hover:underline"
                >
                  <AdminText fr="Ajouter un produit" ar="إضافة منتج" />
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden sm:block">
              <ProductTable products={serializedProducts} />
            </div>

            {/* Mobile view */}
            <div className="sm:hidden space-y-4">
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
