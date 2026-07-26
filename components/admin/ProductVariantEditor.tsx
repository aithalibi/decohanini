'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { useLanguageStore } from '@/store/language-store';

type EditableVariant = {
  key: string;
  name: string;
  price: string;
  oldPrice: string;
  stock: string;
  imageUrl: string;
};

type InitialVariant = Omit<EditableVariant, 'key'>;

export default function ProductVariantEditor({ initialVariants = [] }: { initialVariants?: InitialVariant[] }) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const [variants, setVariants] = useState<EditableVariant[]>(() =>
    initialVariants.map((variant, index) => ({
      ...variant,
      key: `existing-${index}`,
    }))
  );

  const serializedVariants = JSON.stringify(
    variants.map(({ name, price, oldPrice, stock, imageUrl }) => ({
      name,
      price,
      oldPrice: oldPrice || null,
      stock,
      imageUrl: imageUrl || null,
    }))
  );

  const updateVariant = (key: string, field: keyof InitialVariant, value: string) => {
    setVariants((current) => current.map((variant) => (variant.key === key ? { ...variant, [field]: value } : variant)));
  };

  const addVariant = (preset?: { name?: string; price?: string }) => {
    setVariants((current) => [
      ...current,
      {
        key: `new-${Date.now()}-${current.length}`,
        name: preset?.name ?? '',
        price: preset?.price ?? '',
        oldPrice: '',
        stock: '0',
        imageUrl: '',
      },
    ]);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <input type="hidden" name="variants" value={serializedVariants} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-800">{isArabic ? 'Photos et options' : 'Photos et options'}</h3>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
            {isArabic
              ? 'La photo est optionnelle. Ajoutez juste un nom et un prix à chaque option. Exemple: Grand 300 DH et Petit 230 DH.'
              : 'La photo est optionnelle. Ajoutez juste un nom et un prix à chaque option. Exemple: Grand 300 DH et Petit 230 DH.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addVariant({ name: isArabic ? 'Grand' : 'Grand', price: '300' })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand-taupe bg-brand-cream px-3 py-2 text-xs font-bold text-brand-brown transition-colors hover:bg-brand-sand"
          >
            <Plus size={15} />
            {isArabic ? 'Ajouter Grand' : 'Ajouter Grand'}
          </button>
          <button
            type="button"
            onClick={() => addVariant({ name: isArabic ? 'Petit' : 'Petit', price: '230' })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand-taupe bg-brand-cream px-3 py-2 text-xs font-bold text-brand-brown transition-colors hover:bg-brand-sand"
          >
            <Plus size={15} />
            {isArabic ? 'Ajouter Petit' : 'Ajouter Petit'}
          </button>
          <button
            type="button"
            onClick={() => addVariant()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#9A6743] px-3 py-2 text-xs font-bold text-white hover:bg-[#70472F]"
          >
            <Plus size={15} />
            {isArabic ? 'Ajouter une option' : 'Ajouter une option'}
          </button>
        </div>
      </div>

      {variants.length === 0 ? (
        <p className="mt-5 rounded-xl border border-dashed border-gray-200 px-4 py-5 text-center text-xs text-gray-500">
          {isArabic
            ? 'Aucune option: le prix et le stock par défaut seront utilisés.'
            : 'Aucune option: le prix et le stock par défaut seront utilisés.'}
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {variants.map((variant, index) => (
            <div key={variant.key} className="rounded-xl border border-[#E6D8C8] bg-[#FBF8F3] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <strong className="text-xs uppercase tracking-[0.18em] text-[#4A3024]">
                    {isArabic ? 'Option' : 'Option'} {index + 1}
                  </strong>
                  {variant.name && (
                    <p className="mt-1 text-sm font-semibold text-brand-espresso">
                      {variant.name}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setVariants((current) => current.filter((item) => item.key !== variant.key))}
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={isArabic ? `Supprimer l'option ${index + 1}` : `Supprimer l'option ${index + 1}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
                <div className="space-y-2">
                  <ImageUploader
                    currentUrl={variant.imageUrl}
                    name={`variant-image-${variant.key}`}
                    label={isArabic ? 'Photo optionnelle' : 'Photo optionnelle'}
                    onUpload={(url) => updateVariant(variant.key, 'imageUrl', url)}
                  />
                  <p className="text-[10px] leading-4 text-gray-500">
                    {isArabic
                      ? 'Quand cette photo est choisie dans la boutique, le prix associé s’affiche automatiquement.'
                      : 'Quand cette photo est choisie dans la boutique, le prix associé s’affiche automatiquement.'}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-semibold text-gray-600">
                    {isArabic ? 'Nom' : 'Nom'}
                    <input
                      required
                      value={variant.name}
                      onChange={(event) => updateVariant(variant.key, 'name', event.target.value)}
                      placeholder={isArabic ? 'Grand' : 'Grand'}
                      className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#9A6743]"
                    />
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    {isArabic ? 'Prix (DH)' : 'Prix (DH)'}
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={variant.price}
                      onChange={(event) => updateVariant(variant.key, 'price', event.target.value)}
                      placeholder="300"
                      className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#9A6743]"
                    />
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    {isArabic ? 'Ancien prix' : 'Ancien prix'}
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={variant.oldPrice}
                      onChange={(event) => updateVariant(variant.key, 'oldPrice', event.target.value)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#9A6743]"
                    />
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    {isArabic ? 'Stock' : 'Stock'}
                    <input
                      required
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(event) => updateVariant(variant.key, 'stock', event.target.value)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#9A6743]"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
