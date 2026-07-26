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

interface ProductTableProps {
  products: ProductWithDetails[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
  };

  const handleToggleVis = async (id: number, current: boolean) => {
    await toggleProductVisibility(id, !current);
  };

  const handleToggleFeatured = async (id: number, current: boolean) => {
    await toggleProductFeatured(id, !current);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full border-collapse text-start">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="w-16 px-4 py-3">{isArabic ? 'الصورة' : 'Image'}</th>
            <th className="px-4 py-3">{isArabic ? 'المنتج' : 'Produit'}</th>
            <th className="px-4 py-3">{isArabic ? 'الفئة' : 'Catégorie'}</th>
            <th className="px-4 py-3">{isArabic ? 'الثمن' : 'Prix'}</th>
            <th className="px-4 py-3 text-center">{isArabic ? 'المخزون' : 'Stock'}</th>
            <th className="px-4 py-3 text-center">{isArabic ? 'مميز' : 'Phare'}</th>
            <th className="px-4 py-3 text-center">{isArabic ? 'الظهور' : 'Visibilité'}</th>
            <th className="px-4 py-3 text-end">{isArabic ? 'الإجراءات' : 'Actions'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  {product.images?.[0] ? (
                    <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package size={20} className="text-gray-300" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="max-w-[220px] line-clamp-2 font-semibold text-gray-900">{product.name}</div>
                {product.isFeatured && (
                  <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    {isArabic ? 'مميز' : 'En avant'}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="whitespace-nowrap rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {product.category.name}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="font-bold text-[#E52329]">{Number(product.price)} DH</span>
                {product.oldPrice && <span className="block text-xs text-gray-400 line-through">{Number(product.oldPrice)} DH</span>}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    product.stock > 10
                      ? 'bg-green-100 text-green-700'
                      : product.stock > 0
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                  className={`mx-auto inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    product.isFeatured ? 'bg-amber-50 text-amber-600' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={product.isFeatured ? (isArabic ? 'Retirer des produits phares' : 'Retirer des produits phares') : (isArabic ? 'Afficher dans produits phares' : 'Afficher dans produits phares')}
                >
                  <Star size={17} className={product.isFeatured ? 'fill-current' : ''} />
                </button>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleToggleVis(product.id, product.isVisible)}
                  className={`mx-auto inline-flex rounded-lg p-1.5 transition-colors ${
                    product.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={product.isVisible ? (isArabic ? 'إخفاء' : 'Masquer') : (isArabic ? 'إظهار' : 'Afficher')}
                >
                  {product.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-end">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/produits/${product.id}/modifier`}
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-[#E52329]"
                    title={isArabic ? 'تعديل' : 'Modifier'}
                  >
                    <Edit size={18} />
                  </Link>
                  <DeleteConfirmDialog
                    title={isArabic ? 'حذف المنتج' : 'Supprimer le produit'}
                    description={isArabic ? `Voulez-vous vraiment supprimer "${product.name}" ?` : `Voulez-vous vraiment supprimer "${product.name}" ?`}
                    onConfirm={() => handleDelete(product.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
