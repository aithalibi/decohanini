'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

type EditableVariant = {
  key: string;
  name: string;
  price: string;
  oldPrice: string;
  stock: string;
};

type InitialVariant = Omit<EditableVariant, 'key'>;

export default function ProductVariantEditor({ initialVariants = [] }: { initialVariants?: InitialVariant[] }) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const [variants, setVariants] = useState<EditableVariant[]>(() => initialVariants.map((variant, index) => ({
    ...variant,
    key: `existing-${index}`,
  })));

  const serializedVariants = JSON.stringify(variants.map(({ name, price, oldPrice, stock }) => ({
    name,
    price,
    oldPrice: oldPrice || null,
    stock,
  })));

  const updateVariant = (key: string, field: keyof InitialVariant, value: string) => {
    setVariants((current) => current.map((variant) => variant.key === key ? { ...variant, [field]: value } : variant));
  };

  const addVariant = () => {
    setVariants((current) => [...current, {
      key: `new-${Date.now()}-${current.length}`,
      name: '',
      price: '',
      oldPrice: '',
      stock: '0',
    }]);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <input type="hidden" name="variants" value={serializedVariants} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-800">{isArabic ? 'المقاسات والخيارات' : 'Tailles et variantes'}</h3>
          <p className="mt-1 text-xs leading-5 text-gray-500">{isArabic ? 'اختياري. مثال: صغير 70 درهم، متوسط 80 درهم، كبير 100 درهم.' : 'Facultatif. Exemple: Petite 70 DH, Moyenne 80 DH, Grande 100 DH.'}</p>
        </div>
        <button type="button" onClick={addVariant} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#9A6743] px-3 py-2 text-xs font-bold text-white hover:bg-[#70472F]">
          <Plus size={15} /> {isArabic ? 'إضافة' : 'Ajouter'}
        </button>
      </div>

      {variants.length === 0 ? (
        <p className="mt-5 rounded-xl border border-dashed border-gray-200 px-4 py-5 text-center text-xs text-gray-500">{isArabic ? 'لا توجد خيارات: سيستعمل الثمن والمخزون الافتراضيان.' : 'Aucune variante: le prix et le stock par défaut seront utilisés.'}</p>
      ) : (
        <div className="mt-5 space-y-3">
          {variants.map((variant, index) => (
            <div key={variant.key} className="rounded-xl border border-[#E6D8C8] bg-[#FBF8F3] p-3">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-xs text-[#4A3024]">{isArabic ? 'الخيار' : 'Variante'} {index + 1}</strong>
                <button type="button" onClick={() => setVariants((current) => current.filter((item) => item.key !== variant.key))} className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label={isArabic ? `حذف الخيار ${index + 1}` : `Supprimer la variante ${index + 1}`}>
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-xs font-semibold text-gray-600">{isArabic ? 'الاسم' : 'Nom'}
                  <input required value={variant.name} onChange={(event) => updateVariant(variant.key, 'name', event.target.value)} placeholder={isArabic ? 'كبير' : 'Grande'} className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#9A6743]" />
                </label>
                <label className="text-xs font-semibold text-gray-600">{isArabic ? 'الثمن (درهم)' : 'Prix (DH)'}
                  <input required type="number" min="0.01" step="0.01" value={variant.price} onChange={(event) => updateVariant(variant.key, 'price', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#9A6743]" />
                </label>
                <label className="text-xs font-semibold text-gray-600">{isArabic ? 'الثمن القديم' : 'Ancien prix'}
                  <input type="number" min="0.01" step="0.01" value={variant.oldPrice} onChange={(event) => updateVariant(variant.key, 'oldPrice', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#9A6743]" />
                </label>
                <label className="text-xs font-semibold text-gray-600">{isArabic ? 'المخزون' : 'Stock'}
                  <input required type="number" min="0" value={variant.stock} onChange={(event) => updateVariant(variant.key, 'stock', event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#9A6743]" />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
