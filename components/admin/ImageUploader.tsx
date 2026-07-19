'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

interface ImageUploaderProps {
  currentUrl?: string;
  name?: string;
  label?: string;
  onUpload?: (url: string) => void;
}

export default function ImageUploader({
  currentUrl,
  name = 'imageUrl',
  label = 'Image',
  onUpload,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(currentUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!ALLOWED.includes(file.type)) {
      setError(isArabic ? 'صيغة غير مقبولة. استعمل JPG أو PNG أو WebP.' : 'Format non accepté. Utilisez JPG, PNG ou WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(isArabic ? 'حجم الصورة كبير جداً. الحد الأقصى 5 ميغابايت.' : "L'image est trop lourde. Maximum 5 Mo.");
      return;
    }

    setError('');
    setIsUploading(true);

    // Preview optimiste
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();

    setIsUploading(false);

    if (!res.ok) {
      setError(data.error || (isArabic ? 'حدث خطأ أثناء رفع الصورة.' : 'Une erreur est survenue lors de l\'upload.'));
      setPreview(currentUrl || '');
      return;
    }

    setPreview(data.url);
    onUpload?.(data.url);
  };

  const handleRemove = () => {
    setPreview('');
    if (inputRef.current) inputRef.current.value = '';
    onUpload?.('');
  };

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{isArabic && label === 'Image' ? 'الصورة' : label}</label>}

      {/* Hidden form field for the URL */}
      <input type="hidden" name={name} value={preview} />

      {preview ? (
        <div className="relative w-full aspect-square max-w-[200px] rounded-xl overflow-hidden border border-gray-200 group">
          <Image
            src={preview}
            alt={isArabic ? 'معاينة' : 'Aperçu'}
            fill
            className="object-cover"
            sizes="200px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer"
              aria-label={isArabic ? 'حذف الصورة' : "Supprimer l'image"}
            >
              <X size={18} />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="w-8 h-8 border-2 border-[#E52329]/30 border-t-[#E52329] rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full max-w-[200px] aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#E52329] hover:text-[#E52329] transition-colors cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <span className="w-8 h-8 border-2 border-[#E52329]/30 border-t-[#E52329] rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon size={28} />
              <div className="text-center px-2">
                <p className="text-xs font-medium">{isArabic ? 'اختر صورة' : 'Choisir une image'}</p>
                <p className="text-[10px] mt-0.5">JPG, PNG, WebP · Max 5 Mo</p>
              </div>
              <Upload size={16} />
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {!preview && !isUploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs text-[#E52329] hover:underline cursor-pointer"
        >
          {isArabic ? 'اختر من الحاسوب أو الهاتف' : "Choisir depuis l'ordinateur ou le téléphone"}
        </button>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
