import React from 'react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { ExternalLink } from 'lucide-react';
import { getSettings } from '@/actions/settings';
import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import { AdminText } from '@/components/admin/AdminI18n';

export const dynamic = 'force-dynamic';

export default async function SitePreviewPage() {
  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';
  const [settings, products, categories] = await Promise.all([
    getSettings(),
    getProducts({ isVisible: true }),
    getCategories(),
  ]);

  const showcaseImages = [
    '/lookbook/lookbook-01.jpeg',
    '/lookbook/lookbook-02.jpeg',
    '/lookbook/lookbook-03.jpeg',
    '/lookbook/lookbook-04.jpeg',
    '/lookbook/lookbook-05.jpeg',
    '/lookbook/lookbook-06.jpeg',
    '/lookbook/lookbook-07.jpeg',
    '/lookbook/lookbook-08.jpeg',
    '/lookbook/lookbook-09.jpeg',
  ];

  const visibleCategories = categories.filter((category) => category.isVisible);
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);

  return (
    <AdminLayoutClient
      title="Aperçu du site"
      titleAr="معاينة الموقع"
      subtitle="Visualisez le rendu actuel du site public"
      subtitleAr="معاينة المظهر الحالي للموقع"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex justify-end">
          <a
            href={publicSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[#080808] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            <AdminText fr="OUVRIR LE SITE PUBLIC" ar="فتح الموقع العام" />
            <ExternalLink size={18} />
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <AdminText fr="Section principale (Hero)" ar="الواجهة الرئيسية" />
          </div>
          <div className="relative flex h-[400px] w-full items-center bg-[#080808]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 z-10 bg-black/35" />
              <img
                src={settings.heroImageUrl || showcaseImages[0]}
                alt="Hero"
                className="h-full w-full object-cover object-center brightness-110 contrast-105 saturate-110"
              />
            </div>
            <div className="relative z-20 max-w-2xl px-8 text-white">
              <h1 className="mb-4 text-4xl leading-tight font-serif">
                {settings.heroTitle || <AdminText fr="Titre du site" ar="عنوان الموقع" />}
              </h1>
              <p className="text-lg font-light text-neutral-200">
                {settings.heroSubtitle || <AdminText fr="Sous-titre du site" ar="العنوان الفرعي للموقع" />}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <AdminText fr="Photos récentes" ar="الصور الجديدة" />
          </div>
          <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
            {showcaseImages.slice(0, 6).map((src, index) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={src}
                  alt={`Showcase ${index + 1}`}
                  className="h-full w-full object-cover object-center brightness-110 contrast-105 saturate-110"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <AdminText fr="Catégories visibles" ar="الفئات الظاهرة" /> ({visibleCategories.length})
          </div>
          <div className="flex gap-6 overflow-x-auto p-6">
            {visibleCategories.map((category, index) => (
              <div key={category.id} className="flex w-24 shrink-0 flex-col items-center gap-3">
                <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-brand-sand/60">
                  <img
                    src={category.imageUrl || showcaseImages[index % showcaseImages.length]}
                    alt={category.name}
                    className="h-full w-full object-cover object-center brightness-110 contrast-105 saturate-110"
                  />
                </div>
                <span className="text-center text-xs font-bold">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <AdminText fr="Produits en avant" ar="المنتجات المميزة" /> ({featuredProducts.length})
          </div>
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="overflow-hidden rounded-xl border border-gray-100">
                <div className="relative aspect-square bg-gray-100">
                  {product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full object-cover object-center brightness-110 contrast-105 saturate-110"
                    />
                  ) : null}
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold uppercase text-gray-400">{product.category.name}</p>
                  <p className="mt-1 truncate text-sm font-semibold">{product.name}</p>
                  <p className="mt-2 text-sm font-bold text-[#E52329]">{Number(product.price)} DH</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayoutClient>
  );
}
