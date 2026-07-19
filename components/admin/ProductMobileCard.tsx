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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col sm:hidden mb-4">
      <div className="p-4 flex gap-4">
        {/* Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative flex-shrink-0">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <Package size={24} className="text-gray-300" />
          )}
          {product.isFeatured && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              {isArabic ? 'مميز' : 'À la une'}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <button
              onClick={handleToggleVis}
              className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${
                product.isVisible ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'
              }`}
            >
              {product.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1 block">
            {product.category.name}
          </span>
          
          <div className="mt-auto flex items-end justify-between">
            <div>
              <span className="font-bold text-[#E52329] text-base leading-none block">
                {Number(product.price)} DH
              </span>
              {product.oldPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  {Number(product.oldPrice)} DH
                </span>
              )}
            </div>
            
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              product.stock > 10 ? 'bg-green-100 text-green-700' :
              product.stock > 0 ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {isArabic ? 'المخزون' : 'Stock'}: {product.stock}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 flex gap-2">
        <Link
          href={`/admin/produits/${product.id}/modifier`}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          <Edit size={16} /> {isArabic ? 'تعديل' : 'Modifier'}
        </Link>
        <DeleteConfirmDialog
          title={isArabic ? 'حذف المنتج' : 'Supprimer le produit'}
          description={isArabic ? `هل تريد فعلاً حذف "${product.name}"؟` : `Voulez-vous vraiment supprimer "${product.name}" ?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
