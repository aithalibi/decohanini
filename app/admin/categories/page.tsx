import React from 'react';
import Link from 'next/link';
import { Plus, Tag } from 'lucide-react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { getCategories } from '@/actions/categories';
import CategoryCard from '@/components/admin/CategoryCard';
import EmptyState from '@/components/admin/EmptyState';
import { AdminText } from '@/components/admin/AdminI18n';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminLayoutClient title="Catégories" titleAr="الفئات" subtitle="Gérez les catégories de votre boutique" subtitleAr="إدارة فئات المتجر">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Actions */}
        <div className="flex justify-end">
          <Link
            href="/admin/categories/nouvelle"
            className="bg-[#E52329] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#B8161B] transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <AdminText fr="Ajouter une catégorie" ar="إضافة فئة" />
          </Link>
        </div>

        {/* Content */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200">
            <EmptyState
              icon={Tag}
              title={<AdminText fr="Aucune catégorie" ar="لا توجد فئات" />}
              description={<AdminText fr="Commencez par créer votre première catégorie pour organiser vos produits." ar="ابدأ بإنشاء أول فئة لتنظيم منتجاتك." />}
              action={
                <Link
                  href="/admin/categories/nouvelle"
                  className="text-[#E52329] font-bold hover:underline"
                >
                  <AdminText fr="Créer une catégorie" ar="إنشاء فئة" />
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </AdminLayoutClient>
  );
}
