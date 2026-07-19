'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';
import type { Category } from '@prisma/client';
import { useLanguageStore } from '@/store/language-store';

interface CategoryFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
  category?: Category;
}

export default function CategoryForm({ action, category }: CategoryFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? '');
  const [name, setName] = useState(category?.name ?? '');
  const [slugPreview, setSlugPreview] = useState(category?.slug ?? '');
  const language = useLanguageStore((store) => store.language);
  const isArabic = language === 'AR';

  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(isArabic ? 'تم حفظ الفئة بنجاح!' : 'Catégorie enregistrée avec succès !');
      router.push('/admin/categories');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router, isArabic]);

  const generateSlug = (v: string) =>
    v.toLowerCase()
      .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
      .replace(/&/g, 'et').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {/* Nom */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'المعلومات الرئيسية' : 'Informations principales'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="cat-name">
              {isArabic ? 'اسم الفئة' : 'Nom de la catégorie'} <span className="text-red-500">*</span>
            </label>
            <input
              id="cat-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlugPreview(generateSlug(e.target.value));
              }}
              placeholder={isArabic ? 'مثال: ديكور، لوحات...' : 'Ex: Décoration, Tableaux...'}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329] focus:ring-2 focus:ring-[#E52329]/10 transition-all"
            />
            {slugPreview && (
              <p className="text-xs text-gray-400 mt-1">
                {isArabic ? 'الرابط المولد تلقائياً:' : 'URL générée automatiquement :'} <span className="font-mono text-gray-600">/{slugPreview}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="cat-desc">
              {isArabic ? 'الوصف' : 'Description'} <span className="text-gray-400 font-normal">({isArabic ? 'اختياري' : 'facultatif'})</span>
            </label>
            <textarea
              id="cat-desc"
              name="description"
              rows={3}
              defaultValue={category?.description ?? ''}
              placeholder={isArabic ? 'وصف مختصر للفئة...' : 'Courte description de la catégorie...'}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329] focus:ring-2 focus:ring-[#E52329]/10 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="cat-order">
              {isArabic ? 'ترتيب العرض' : "Ordre d'affichage"}
            </label>
            <input
              id="cat-order"
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={category?.sortOrder ?? 0}
              className="w-32 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329] focus:ring-2 focus:ring-[#E52329]/10 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">{isArabic ? '0 = يظهر أولاً' : '0 = affiché en premier'}</p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'الصورة' : 'Image'}</h3>
        <ImageUploader
          currentUrl={imageUrl}
          name="imageUrl"
          label={isArabic ? 'صورة الفئة' : 'Image de la catégorie'}
          onUpload={setImageUrl}
        />
      </div>

      {/* Visibilité */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'الظهور' : 'Visibilité'}</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              name="isVisible"
              value="true"
              defaultChecked={category?.isVisible ?? true}
              className="sr-only peer"
              id="cat-visible"
            />
            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#E52329] rounded-full transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-700">{isArabic ? 'الفئة ظاهرة في الموقع' : 'Catégorie visible sur le site'}</span>
            <p className="text-xs text-gray-400">{isArabic ? 'عند تعطيله، لن تظهر الفئة في الموقع' : "Si désactivé, la catégorie n'apparaît plus sur le site"}</p>
          </div>
        </label>
        {/* Hidden field hack for checkbox */}
        <input type="hidden" name="isVisible" value="false" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
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
            isArabic ? 'حفظ الفئة' : 'Enregistrer la catégorie'
          )}
        </button>
      </div>
    </form>
  );
}
