import React from 'react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import ProductForm from '@/components/admin/ProductForm';
import { createProduct } from '@/actions/products';
import { getCategories } from '@/actions/categories';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <AdminLayoutClient title="Nouveau produit" titleAr="منتج جديد" subtitle="Ajouter un article à votre catalogue" subtitleAr="إضافة منتج إلى الكتالوج">
      <ProductForm action={createProduct} categories={categories} />
    </AdminLayoutClient>
  );
}
