'use client';

import React, { useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MultiImageUploader from '@/components/admin/MultiImageUploader';
import ProductVariantEditor from '@/components/admin/ProductVariantEditor';
import type { Product, Category, ProductImage, ProductVariant } from '@prisma/client';
import { useLanguageStore } from '@/store/language-store';

interface ProductFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string; id?: number }>;
  product?: Product & { images: ProductImage[]; variants: ProductVariant[] };
  categories: Category[];
}

export default function ProductForm({ action, product, categories }: ProductFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);
  const language = useLanguageStore((store) => store.language);
  const isArabic = language === 'AR';

  useEffect(() => {
    if (state?.success) {
      toast.success(isArabic ? 'تم حفظ المنتج بنجاح!' : 'Produit enregistré avec succès !');
      router.push('/admin/produits');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router, isArabic]);

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Principale */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Informations principales */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'المعلومات الرئيسية' : 'Informations principales'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="prod-name">
                  {isArabic ? 'اسم المنتج' : 'Nom du produit'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="prod-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={product?.name}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="prod-cat">
                  {isArabic ? 'الفئة' : 'Catégorie'} <span className="text-red-500">*</span>
                </label>
                <select
                  id="prod-cat"
                  name="categoryId"
                  required
                  defaultValue={product?.categoryId}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
                >
                  <option value="">{isArabic ? 'اختر فئة...' : 'Sélectionner une catégorie...'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="prod-short">
                  {isArabic ? 'وصف مختصر' : 'Petite description'} <span className="text-gray-400 font-normal">({isArabic ? 'اختياري' : 'facultatif'})</span>
                </label>
                <textarea
                  id="prod-short"
                  name="shortDescription"
                  rows={2}
                  defaultValue={product?.shortDescription ?? ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="prod-description">
                  {isArabic ? 'الوصف الكامل' : 'Description complète'} <span className="text-gray-400 font-normal">({isArabic ? 'اختياري' : 'facultatif'})</span>
                </label>
                <textarea
                  id="prod-description"
                  name="description"
                  rows={5}
                  defaultValue={product?.description ?? ''}
                  placeholder={isArabic ? 'صف المادة والتصميم وتفاصيل المنتج...' : 'Décrivez la matière, le style et les détails du produit...'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329] resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="prod-dimensions">{isArabic ? 'الأبعاد' : 'Dimensions'} <span className="text-gray-400 font-normal">({isArabic ? 'اختياري' : 'facultatif'})</span></label>
                <input id="prod-dimensions" name="dimensions" type="text" defaultValue={product?.dimensions ?? ''} placeholder={isArabic ? 'مثال: 40 × 60 سم' : 'Ex: 40 × 60 cm'} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]" />
              </div>
            </div>
          </div>

          {/* Prix et Stock */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-1">{isArabic ? 'الثمن والمخزون الافتراضيان' : 'Prix et stock par défaut'}</h3>
            <p className="mb-4 text-xs leading-5 text-gray-500">{isArabic ? 'تستعمل هذه القيم إذا لم تضف أي خيارات أسفله.' : 'Ces valeurs sont utilisées si vous ne créez aucune variante ci-dessous.'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="prod-price">
                  {isArabic ? 'الثمن (درهم)' : 'Prix (DH)'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="prod-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={product?.price?.toString() ?? ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
                />
                <p className="mt-1.5 text-xs text-gray-500">{isArabic ? 'أدخل 0 لعرض "الثمن عند الطلب" في المتجر.' : 'Saisissez 0 pour afficher "Prix sur demande" dans la boutique.'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="prod-old">
                  {isArabic ? 'الثمن القديم (درهم)' : 'Ancien prix (DH)'} <span className="text-gray-400 font-normal">({isArabic ? 'اختياري' : 'facultatif'})</span>
                </label>
                <input
                  id="prod-old"
                  name="oldPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.oldPrice?.toString() ?? ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="prod-stock">
                  {isArabic ? 'المخزون' : 'Stock'}
                </label>
                <input
                  id="prod-stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  defaultValue={product?.stock ?? 0}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
                />
              </div>
            </div>
          </div>

          <ProductVariantEditor initialVariants={product?.variants.map((variant) => ({
            name: variant.name,
            price: variant.price.toString(),
            oldPrice: variant.oldPrice?.toString() ?? '',
            stock: String(variant.stock),
          }))} />
        </div>

        {/* Colonne Latérale */}
        <div className="space-y-6">
          
          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'صور المنتج' : 'Photos du produit'}</h3>
            <MultiImageUploader initialUrls={product?.images?.map((image) => image.url) ?? []} />
          </div>

          {/* Options d'affichage */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-800 mb-2">{isArabic ? 'الخيارات' : 'Options'}</h3>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="isVisible" value="true" defaultChecked={product?.isVisible ?? true} className="sr-only peer" />
                <input type="hidden" name="isVisible" value="false" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{isArabic ? 'ظاهر في الموقع' : 'Visible sur le site'}</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="isFeatured" value="true" defaultChecked={product?.isFeatured ?? false} className="sr-only peer" />
                <input type="hidden" name="isFeatured" value="false" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#E52329] rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{isArabic ? 'منتج مميز' : 'Mettre en avant'}</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="isNew" value="true" defaultChecked={product?.isNew ?? false} className="sr-only peer" />
                <input type="hidden" name="isNew" value="false" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
              </div>
                <span className="text-sm font-semibold text-gray-700">{isArabic ? 'شارة "جديد"' : 'Badge "Nouveau"'}</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="isOnSale" value="true" defaultChecked={product?.isOnSale ?? false} className="sr-only peer" />
                <input type="hidden" name="isOnSale" value="false" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-orange-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{isArabic ? 'شارة "تخفيض"' : 'Badge "Promotion"'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {isArabic ? 'إلغاء →' : '← Annuler'}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 sm:flex-none px-8 py-3 bg-[#E52329] text-white rounded-xl font-bold text-sm hover:bg-[#B8161B] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isArabic ? 'جاري الحفظ...' : 'Enregistrement...'}</>
          ) : (
            isArabic ? 'حفظ المنتج' : 'Enregistrer le produit'
          )}
        </button>
      </div>
    </form>
  );
}
