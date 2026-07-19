import React from 'react';
import { notFound } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, updateProduct } from '@/actions/products';
import { getCategories } from '@/actions/categories';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  
  if (isNaN(id)) notFound();

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories()
  ]);

  if (!product) notFound();

  // Serialize Decimal/Date fields for Client Component
  const serializedProduct = JSON.parse(JSON.stringify(product, (_key, value) =>
    typeof value === 'object' && value !== null && value.constructor?.name === 'Decimal'
      ? Number(value)
      : value
  ));

  const updateAction = updateProduct.bind(null, id);

  return (
    <AdminLayoutClient title="Modifier le produit" titleAr="تعديل المنتج" subtitle={product.name}>
      <ProductForm action={updateAction} product={serializedProduct} categories={categories} />
    </AdminLayoutClient>
  );
}
