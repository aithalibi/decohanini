import React from 'react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import CategoryForm from '@/components/admin/CategoryForm';
import { createCategory } from '@/actions/categories';

export default function NewCategoryPage() {
  return (
    <AdminLayoutClient title="Nouvelle catégorie" titleAr="فئة جديدة" subtitle="Ajouter une nouvelle catégorie de produits" subtitleAr="إضافة فئة جديدة للمنتجات">
      <CategoryForm action={createCategory} />
    </AdminLayoutClient>
  );
}
