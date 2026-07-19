'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Edit, Eye, EyeOff } from 'lucide-react';
import type { Product, Category, ProductImage } from '@prisma/client';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { deleteProduct, toggleProductVisibility } from '@/actions/products';
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

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200">
      <table className="w-full text-start border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
            <th className="px-4 py-3 w-16">{isArabic ? 'الصورة' : 'Image'}</th>
            <th className="px-4 py-3">{isArabic ? 'المنتج' : 'Produit'}</th>
            <th className="px-4 py-3">{isArabic ? 'الفئة' : 'Catégorie'}</th>
            <th className="px-4 py-3">{isArabic ? 'الثمن' : 'Prix'}</th>
            <th className="px-4 py-3 text-center">{isArabic ? 'المخزون' : 'Stock'}</th>
            <th className="px-4 py-3 text-center">{isArabic ? 'الظهور' : 'Visibilité'}</th>
            <th className="px-4 py-3 text-end">{isArabic ? 'الإجراءات' : 'Actions'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <Package size={20} className="text-gray-300" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold text-gray-900 line-clamp-2 max-w-[200px]">
                  {product.name}
                </div>
                {product.isFeatured && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">
                    {isArabic ? 'مميز' : 'En avant'}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium whitespace-nowrap">
                  {product.category.name}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="font-bold text-[#E52329]">{Number(product.price)} DH</span>
                {product.oldPrice && (
                  <span className="text-xs text-gray-400 line-through block">
                    {Number(product.oldPrice)} DH
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                  product.stock > 10 ? 'bg-green-100 text-green-700' :
                  product.stock > 0 ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleToggleVis(product.id, product.isVisible)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer mx-auto ${
                    product.isVisible
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={product.isVisible ? (isArabic ? 'إخفاء' : 'Masquer') : (isArabic ? 'إظهار' : 'Afficher')}
                >
                  {product.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </td>
              <td className="px-4 py-3 text-end whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/produits/${product.id}/modifier`}
                    className="p-2 text-gray-600 hover:text-[#E52329] hover:bg-red-50 rounded-lg transition-colors"
                    title={isArabic ? 'تعديل' : 'Modifier'}
                  >
                    <Edit size={18} />
                  </Link>
                  <DeleteConfirmDialog
                    title={isArabic ? 'حذف المنتج' : 'Supprimer le produit'}
                    description={isArabic ? `هل تريد فعلاً حذف "${product.name}"؟` : `Voulez-vous vraiment supprimer "${product.name}" ?`}
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
