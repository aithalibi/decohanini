'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Edit, Eye, EyeOff, Star } from 'lucide-react';
import type { Product, Category, ProductImage } from '@prisma/client';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { deleteProduct, toggleProductFeatured, toggleProductVisibility } from '@/actions/products';
import { useLanguageStore } from '@/store/language-store';

type ProductWithDetails = Product & {
  category: Pick<Category, 'name'>;
  images: ProductImage[];
};

interface ProductMobileCardProps {
  product: ProductWithDetails;
}

export default function ProductMobileCard({ product }: ProductMobileCardProps) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  const handleDelete = async () => {
    await deleteProduct(product.id);
  };

  const handleToggleVis = async () => {
    await toggleProductVisibility(product.id, !product.isVisible);
  };

  const handleToggleFeatured = async () => {
    await toggleProductFeatured(product.id, !product.isFeatured);
  };

  return (
    <div className="mb-4 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:hidden">
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {product.images?.[0] ? (
            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <Package size={24} className="text-gray-300" />
          )}
          {product.isFeatured && (
            <span className="absolute left-1 top-1 rounded-sm bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
              {isArabic ? 'مميز' : 'À la une'}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold leading-tight text-gray-900">{product.name}</h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleFeatured}
                className={`flex-shrink-0 rounded-lg p-1.5 transition-colors ${
                  product.isFeatured ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-400'
                }`}
                title={product.isFeatured ? (isArabic ? 'Retirer des produits phares' : 'Retirer des produits phares') : (isArabic ? 'Afficher dans produits phares' : 'Afficher dans produits phares')}
              >
                <Star size={16} className={product.isFeatured ? 'fill-current' : ''} />
              </button>
              <button
                onClick={handleToggleVis}
                className={`flex-shrink-0 rounded-lg p-1.5 transition-colors ${
                  product.isVisible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}
                title={product.isVisible ? (isArabic ? 'إخفاء' : 'Masquer') : (isArabic ? 'إظهار' : 'Afficher')}
              >
                {product.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-gray-500">
            {product.category.name}
          </span>

          <div className="mt-auto flex items-end justify-between">
            <div>
              <span className="block text-base font-bold leading-none text-[#E52329]">
                {Number(product.price)} DH
              </span>
              {product.oldPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  {Number(product.oldPrice)} DH
                </span>
              )}
            </div>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                product.stock > 10
                  ? 'bg-green-100 text-green-700'
                  : product.stock > 0
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {isArabic ? 'المخزون' : 'Stock'}: {product.stock}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-100 bg-gray-50 p-3">
        <Link
          href={`/admin/produits/${product.id}/modifier`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          <Edit size={16} /> {isArabic ? 'تعديل' : 'Modifier'}
        </Link>
        <DeleteConfirmDialog
          title={isArabic ? 'حذف المنتج' : 'Supprimer le produit'}
          description={isArabic ? `Voulez-vous vraiment supprimer "${product.name}" ?` : `Voulez-vous vraiment supprimer "${product.name}" ?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
