'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tag, Edit, Eye, EyeOff } from 'lucide-react';
import type { Category } from '@prisma/client';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { deleteCategory } from '@/actions/categories';
import { useLanguageStore } from '@/store/language-store';

interface CategoryCardProps {
  category: Category & {
    _count?: { products: number };
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const handleDelete = async () => {
    await deleteCategory(category.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col group">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 flex-shrink-0">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <Tag size={32} className="mb-2 opacity-50" />
            <span className="text-xs">{isArabic ? 'لا توجد صورة' : "Pas d'image"}</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {category.isVisible ? (
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Eye size={12} /> {isArabic ? 'ظاهرة' : 'Visible'}
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <EyeOff size={12} /> {isArabic ? 'مخفية' : 'Masquée'}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 truncate">{category.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">
          {category.description || (isArabic ? 'لا يوجد وصف' : 'Aucune description')}
        </p>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">
            {category._count?.products || 0} {isArabic ? 'منتج' : 'produit(s)'}
          </span>
          <span className="text-gray-400 text-xs">
            {isArabic ? 'الترتيب' : 'Ordre'}: {category.sortOrder}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 flex gap-2">
        <Link
          href={`/admin/categories/${category.id}/modifier`}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          <Edit size={16} /> {isArabic ? 'تعديل' : 'Modifier'}
        </Link>
        <DeleteConfirmDialog
          title={isArabic ? 'حذف الفئة' : 'Supprimer la catégorie'}
          description={isArabic ? `هل تريد فعلاً حذف الفئة "${category.name}"؟` : `Voulez-vous vraiment supprimer la catégorie "${category.name}" ?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
