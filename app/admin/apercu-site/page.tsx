import React from 'react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { ExternalLink } from 'lucide-react';
import { getSettings } from '@/actions/settings';
import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import Image from 'next/image';
import { AdminText } from '@/components/admin/AdminI18n';

export default async function SitePreviewPage() {
  const [settings, products, categories] = await Promise.all([
    getSettings(),
    getProducts({ isVisible: true }),
    getCategories(),
  ]);

  const visibleCategories = categories.filter(c => c.isVisible);
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <AdminLayoutClient title="Aperçu du site" titleAr="معاينة الموقع" subtitle="Visualisez le rendu actuel du site public" subtitleAr="معاينة المظهر الحالي للموقع">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-end">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#080808] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <AdminText fr="OUVRIR LE SITE PUBLIC" ar="فتح الموقع العام" />
            <ExternalLink size={18} />
          </a>
        </div>

        {/* Aperçu Hero */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <AdminText fr="Section principale (Hero)" ar="الواجهة الرئيسية" />
          </div>
          <div className="relative w-full h-[400px] bg-[#080808] flex items-center">
            {settings.heroImageUrl && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/45 z-10" />
                <Image
                  src={settings.heroImageUrl}
                  alt="Hero"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="relative z-20 px-8 text-white max-w-2xl">
              <h1 className="text-4xl font-serif mb-4 leading-tight">
                {settings.heroTitle || <AdminText fr="Titre du site" ar="عنوان الموقع" />}
              </h1>
              <p className="text-lg font-light text-neutral-200">
                {settings.heroSubtitle || <AdminText fr="Sous-titre du site" ar="العنوان الفرعي للموقع" />}
              </p>
            </div>
          </div>
        </div>

        {/* Aperçu Catégories */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <AdminText fr="Catégories visibles" ar="الفئات الظاهرة" /> ({visibleCategories.length})
          </div>
          <div className="p-6 flex gap-6 overflow-x-auto">
            {visibleCategories.map(cat => (
              <div key={cat.id} className="flex flex-col items-center gap-3 w-24 flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden relative">
                  {cat.imageUrl && (
                    <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <span className="text-xs font-bold text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aperçu Produits en vedette */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <AdminText fr="Produits en avant" ar="المنتجات المميزة" /> ({featuredProducts.length})
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredProducts.map(prod => (
              <div key={prod.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  {prod.images[0] && (
                    <Image src={prod.images[0].url} alt={prod.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{prod.category.name}</p>
                  <p className="font-semibold text-sm truncate mt-1">{prod.name}</p>
                  <p className="text-[#E52329] font-bold text-sm mt-2">{Number(prod.price)} DH</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayoutClient>
  );
}
