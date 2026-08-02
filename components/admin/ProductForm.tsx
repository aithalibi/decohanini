'use client';

import React, { useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import MultiImageUploader from '@/components/admin/MultiImageUploader';
import ProductVariantEditor from '@/components/admin/ProductVariantEditor';
import type { Product, Category, ProductImage, ProductVariant } from '@prisma/client';
import { useLanguageStore } from '@/store/language-store';

interface ProductFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string; id?: number }>;
  product?: Product & { images: ProductImage[]; variants: ProductVariant[]; colors?: unknown };
  categories: Category[];
}

export default function ProductForm({ action, product, categories }: ProductFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);
  const language = useLanguageStore((store) => store.language);
  const isArabic = language === 'AR';

  useEffect(() => {
    if (state?.success) {
      toast.success(isArabic ? 'Produit enregistre avec succes !' : 'Produit enregistre avec succes !');
      router.push('/admin/produits');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router, isArabic]);

  return (
    <form action={formAction} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-4 font-bold text-gray-800">{isArabic ? 'Informations principales' : 'Informations principales'}</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-name">
                  {isArabic ? 'Nom du produit' : 'Nom du produit'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="prod-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={product?.name}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-cat">
                  {isArabic ? 'Categorie' : 'Categorie'} <span className="text-red-500">*</span>
                </label>
                <select
                  id="prod-cat"
                  name="categoryId"
                  required
                  defaultValue={product?.categoryId}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                >
                  <option value="">{isArabic ? 'Selectionner une categorie...' : 'Selectionner une categorie...'}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-short">
                  {isArabic ? 'Description courte' : 'Description courte'} <span className="font-normal text-gray-400">(facultatif)</span>
                </label>
                <textarea
                  id="prod-short"
                  name="shortDescription"
                  rows={2}
                  defaultValue={product?.shortDescription ?? ''}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-description">
                  {isArabic ? 'Description complete' : 'Description complete'} <span className="font-normal text-gray-400">(facultatif)</span>
                </label>
                <textarea
                  id="prod-description"
                  name="description"
                  rows={5}
                  defaultValue={product?.description ?? ''}
                  placeholder={isArabic ? 'Decrivez la matiere, le style et les details du produit...' : 'Decrivez la matiere, le style et les details du produit...'}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-dimensions">
                  {isArabic ? 'Dimensions' : 'Dimensions'} <span className="font-normal text-gray-400">(facultatif)</span>
                </label>
                <input
                  id="prod-dimensions"
                  name="dimensions"
                  type="text"
                  defaultValue={product?.dimensions ?? ''}
                  placeholder={isArabic ? 'Ex: 40 x 60 cm' : 'Ex: 40 x 60 cm'}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-colors">
                  {isArabic ? 'Couleurs disponibles' : 'Couleurs disponibles'} <span className="font-normal text-gray-400">(facultatif)</span>
                </label>
                <textarea
                  id="prod-colors"
                  name="colors"
                  rows={3}
                  defaultValue={Array.isArray(product?.colors) ? product.colors.join(', ') : typeof product?.colors === 'string' ? product.colors : ''}
                  placeholder={isArabic ? 'Jaune, Rouge, Blanc' : 'Jaune, Rouge, Blanc'}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                />
                <p className="mt-1 text-[10px] leading-4 text-gray-500">
                  {isArabic
                    ? 'Séparez les couleurs par une virgule. Elles apparaîtront comme choix dans la fiche produit.'
                    : 'Séparez les couleurs par une virgule. Elles apparaîtront comme choix dans la fiche produit.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-1 font-bold text-gray-800">{isArabic ? 'Prix et stock par defaut' : 'Prix et stock par defaut'}</h3>
            <p className="mb-4 text-xs leading-5 text-gray-500">
              {isArabic
                ? 'Si vous ajoutez un ancien prix plus eleve, la boutique affichera automatiquement le pourcentage de promo (ex: -30%).'
                : 'Si vous ajoutez un ancien prix plus eleve, la boutique affichera automatiquement le pourcentage de promo (ex: -30%).'}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-price">
                  {isArabic ? 'Prix (DH)' : 'Prix (DH)'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="prod-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={product?.price?.toString() ?? ''}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-old">
                  {isArabic ? 'Ancien prix (DH)' : 'Ancien prix (DH)'} <span className="font-normal text-gray-400">(facultatif)</span>
                </label>
                <input
                  id="prod-old"
                  name="oldPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.oldPrice?.toString() ?? ''}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="prod-stock">
                  {isArabic ? 'Stock' : 'Stock'}
                </label>
                <input
                  id="prod-stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  defaultValue={product?.stock ?? 0}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E52329] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <ProductVariantEditor
            initialVariants={product?.variants.map((variant) => ({
              name: variant.name,
              price: variant.price.toString(),
              oldPrice: variant.oldPrice?.toString() ?? '',
              stock: String(variant.stock),
              imageUrl: variant.imageUrl ?? '',
            }))}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-4 font-bold text-gray-800">{isArabic ? 'Photos du produit' : 'Photos du produit'}</h3>
            <MultiImageUploader initialUrls={product?.images?.map((image) => image.url) ?? []} />
            <p className="mt-2 text-[10px] leading-4 text-gray-500">
              {isArabic
                ? 'La premiere photo est la principale dans la boutique. Vous pouvez ajouter jusqu a 6 images.'
                : 'La premiere photo est la principale dans la boutique. Vous pouvez ajouter jusqu a 6 images.'}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
            <h3 className="mb-2 font-bold text-gray-800">{isArabic ? 'Options' : 'Options'}</h3>

            <label className="group flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input type="checkbox" name="isVisible" value="true" defaultChecked={product?.isVisible ?? true} className="peer sr-only" />
                <input type="hidden" name="isVisible" value="false" />
                <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-green-500" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{isArabic ? 'Visible sur le site' : 'Visible sur le site'}</span>
            </label>

            <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
              <Star size={16} className="text-amber-600" />
              <div className="relative">
                <input type="checkbox" name="isFeatured" value="true" defaultChecked={product?.isFeatured ?? false} className="peer sr-only" />
                <input type="hidden" name="isFeatured" value="false" />
                <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-[#E52329]" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-700">{isArabic ? 'Produit phare' : 'Produit phare'}</span>
                <span className="block text-[11px] text-gray-500">{isArabic ? 'Affiché dans la section d’accueil' : 'Affiché dans la section d’accueil'}</span>
              </div>
            </label>

            <label className="group flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input type="checkbox" name="isNew" value="true" defaultChecked={product?.isNew ?? false} className="peer sr-only" />
                <input type="hidden" name="isNew" value="false" />
                <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-500" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{isArabic ? 'Badge Nouveau' : 'Badge Nouveau'}</span>
            </label>

            <label className="group flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input type="checkbox" name="isOnSale" value="true" defaultChecked={product?.isOnSale ?? false} className="peer sr-only" />
                <input type="hidden" name="isOnSale" value="false" />
                <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-orange-500" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{isArabic ? 'Badge promotion' : 'Badge promotion'}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          {isArabic ? 'Annuler' : 'Annuler'}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E52329] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#B8161B] disabled:opacity-60 sm:flex-none"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {isArabic ? 'Enregistrement...' : 'Enregistrement...'}
            </>
          ) : (
            isArabic ? 'Enregistrer le produit' : 'Enregistrer le produit'
          )}
        </button>
      </div>
    </form>
  );
}
