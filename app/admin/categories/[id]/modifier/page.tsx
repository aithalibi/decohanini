import React from 'react';
import { notFound } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import CategoryForm from '@/components/admin/CategoryForm';
import { getCategoryById, updateCategory } from '@/actions/categories';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  
  if (isNaN(id)) notFound();

  const category = await getCategoryById(id);
  if (!category) notFound();

  const updateAction = updateCategory.bind(null, id);

  return (
    <AdminLayoutClient title="Modifier la catégorie" titleAr="تعديل الفئة" subtitle={category.name}>
      <CategoryForm action={updateAction} category={category} />
    </AdminLayoutClient>
  );
}
