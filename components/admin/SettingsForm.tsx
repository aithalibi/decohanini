'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';
import type { SiteSettings } from '@prisma/client';
import { useLanguageStore } from '@/store/language-store';

interface SettingsFormProps {
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
  settings: SiteSettings;
}

export default function SettingsForm({ action, settings }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [heroImageUrl, setHeroImageUrl] = useState(settings?.heroImageUrl ?? '');
  const language = useLanguageStore((store) => store.language);
  const isArabic = language === 'AR';

  useEffect(() => {
    if (state?.success) {
      toast.success(isArabic ? 'تم حفظ الإعدادات بنجاح!' : 'Paramètres enregistrés avec succès !');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isArabic]);

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      
      {/* Informations générales */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'معلومات المتجر' : 'Informations de la boutique'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="storeName">
              {isArabic ? 'اسم المتجر' : 'Nom de la boutique'} <span className="text-red-500">*</span>
            </label>
            <input
              id="storeName"
              name="storeName"
              type="text"
              required
              defaultValue={settings.storeName}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="whatsappNumber">
              {isArabic ? 'رقم واتساب' : 'Numéro WhatsApp'} <span className="text-red-500">*</span>
            </label>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              type="text"
              required
              defaultValue={settings.whatsappNumber}
              placeholder="Ex: 212777422673"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
            <p className="text-xs text-gray-400 mt-1">{isArabic ? 'الصيغة الدولية بدون + (مثال: 212...)' : 'Format international sans le + (ex: 212...)'}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="phone">
              {isArabic ? 'الهاتف (اختياري)' : 'Téléphone (facultatif)'}
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              defaultValue={settings.phone ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
              {isArabic ? 'البريد الإلكتروني (اختياري)' : 'Email (facultatif)'}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="address">
              {isArabic ? 'العنوان (اختياري)' : 'Adresse physique (facultatif)'}
            </label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={settings.address ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'الواجهة الرئيسية' : "Page d'accueil (Hero)"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="heroTitle">
              {isArabic ? 'العنوان الرئيسي' : 'Titre principal'}
            </label>
            <input
              id="heroTitle"
              name="heroTitle"
              type="text"
              defaultValue={settings.heroTitle ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="heroSubtitle">
              {isArabic ? 'العنوان الفرعي' : 'Sous-titre'}
            </label>
            <textarea
              id="heroSubtitle"
              name="heroSubtitle"
              rows={2}
              defaultValue={settings.heroSubtitle ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329] resize-none"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{isArabic ? 'صورة خلفية الواجهة' : 'Image de fond (Hero)'}</h4>
            <ImageUploader currentUrl={heroImageUrl} name="heroImageUrl" label="" onUpload={setHeroImageUrl} />
          </div>
        </div>
      </div>

      {/* Autres infos */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'النصوص وشبكات التواصل' : 'Textes et Réseaux sociaux'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="deliveryText">
              {isArabic ? 'نص التوصيل' : 'Texte Livraison'}
            </label>
            <input
              id="deliveryText"
              name="deliveryText"
              type="text"
              defaultValue={settings.deliveryText ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="paymentText">
              {isArabic ? 'نص الدفع' : 'Texte Paiement'}
            </label>
            <input
              id="paymentText"
              name="paymentText"
              type="text"
              defaultValue={settings.paymentText ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="instagramUrl">
              {isArabic ? 'رابط إنستغرام' : 'Lien Instagram'}
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              defaultValue={settings.instagramUrl ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="facebookUrl">
              {isArabic ? 'رابط فيسبوك' : 'Lien Facebook'}
            </label>
            <input
              id="facebookUrl"
              name="facebookUrl"
              type="url"
              defaultValue={settings.facebookUrl ?? ''}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E52329]"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3 bg-[#080808] text-white rounded-xl font-bold text-sm hover:bg-neutral-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isArabic ? 'جاري الحفظ...' : 'Enregistrement...'}</>
          ) : (
            isArabic ? 'حفظ الإعدادات' : 'Enregistrer les paramètres'
          )}
        </button>
      </div>
    </form>
  );
}
