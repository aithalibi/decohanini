'use client';

import React from 'react';
import { useLanguageStore } from '../../store/language-store';
import type { Category } from '../../types/product';

interface ProductFiltersProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export default function ProductFilters({ categories, activeCategory, onSelectCategory }: ProductFiltersProps) {
  const language = useLanguageStore((state) => state.language);

  // Mapping for seeded categories translation fallback
  const categoryNamesAR: Record<string, string> = {
    'Décoration': 'ديكور',
    'Tableaux': 'لوحات فنية',
    'Assiettes': 'أطباق',
    'Bambou & Épices': 'خيزران وتوابل',
    'Chaises & Extérieur': 'كراسي وخارجية',
  };

  const getLabel = (slug: string, name: string) => {
    if (language === 'AR') return categoryNamesAR[name] || name;
    return name;
  };

  const filters = [
    { slug: 'Tous', label: language === 'AR' ? 'الكل' : 'Tous' },
    ...categories.map(c => ({ slug: c.slug, label: getLabel(c.slug, c.name) }))
  ];

  return (
    <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto pb-4 md:pb-0 gap-2 md:gap-3 no-scrollbar select-none">
      {filters.map((filter) => {
        const isActive = activeCategory === filter.slug;
        return (
          <button
            key={filter.slug}
            onClick={() => onSelectCategory(filter.slug)}
            className={`px-4 py-2 text-xs md:text-sm font-bold tracking-wider uppercase border rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-brand-gold border-brand-gold text-brand-white shadow-sm'
                : 'bg-brand-white border-neutral-200 text-brand-black hover:border-brand-gold hover:text-brand-gold-dark'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
