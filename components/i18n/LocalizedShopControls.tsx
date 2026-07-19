'use client';

import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';

export function LocalizedSearchInput({ defaultValue, className }: { defaultValue: string; className: string }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  return <input name="recherche" defaultValue={defaultValue} placeholder={t.searchPlaceholder} className={className} />;
}

export function LocalizedSortSelect({ defaultValue, className }: { defaultValue: string; className: string }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  return (
    <select name="tri" defaultValue={defaultValue} className={className}>
      <option value="newest">{t.newest}</option>
      <option value="prix-asc">{t.priceAsc}</option>
      <option value="prix-desc">{t.priceDesc}</option>
      <option value="name">{t.nameAZ}</option>
    </select>
  );
}
