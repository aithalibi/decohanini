'use client';

import { useLanguageStore } from '@/store/language-store';

type FilterCategory = { id: number; name: string };

export default function AdminProductFilters({ categories, search, categoryId }: { categories: FilterCategory[]; search?: string; categoryId?: number }) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  return (
    <form className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <input
        type="text"
        name="search"
        defaultValue={search}
        placeholder={isArabic ? 'البحث عن منتج...' : 'Rechercher un produit...'}
        className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-brand-caramel focus:outline-none"
      />
      <select name="categoryId" defaultValue={categoryId ?? ''} className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-brand-caramel focus:outline-none">
        <option value="">{isArabic ? 'جميع الفئات' : 'Toutes les catégories'}</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <button type="submit" className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200">
        {isArabic ? 'تصفية' : 'Filtrer'}
      </button>
    </form>
  );
}
