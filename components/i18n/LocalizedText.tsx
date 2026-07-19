'use client';

import { useLanguageStore } from '@/store/language-store';
import { localizeCategoryDescription, localizeCategoryName, localizeProductName, localizeVariantName } from '@/lib/catalog-i18n';

export function LocalizedText({ fr, ar }: { fr: string; ar: string }) {
  const language = useLanguageStore((state) => state.language);
  return <>{language === 'AR' ? ar : fr}</>;
}

export function LocalizedCategoryName({ slug, fallback }: { slug: string; fallback: string }) {
  const language = useLanguageStore((state) => state.language);
  return <>{localizeCategoryName(slug, fallback, language)}</>;
}

export function LocalizedCategoryDescription({ slug, fallback }: { slug: string; fallback?: string | null }) {
  const language = useLanguageStore((state) => state.language);
  return <>{localizeCategoryDescription(slug, fallback, language)}</>;
}

export function LocalizedProductName({ slug, fallback }: { slug: string; fallback: string }) {
  const language = useLanguageStore((state) => state.language);
  return <>{localizeProductName(slug, fallback, language)}</>;
}

export function LocalizedVariantName({ name }: { name: string }) {
  const language = useLanguageStore((state) => state.language);
  return <>{localizeVariantName(name, language)}</>;
}
