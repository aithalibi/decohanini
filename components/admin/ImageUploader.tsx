'use client';

import React, { useEffect, useState, useRef } from 'react';
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

  useEffect(() => {
    setPreview(currentUrl || '');
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!ALLOWED.includes(file.type)) {
      setError(isArabic ? 'ØµÙŠØºØ© ØºÙŠØ± Ù…Ù‚Ø¨ÙˆÙ„Ø©. Ø§Ø³ØªØ¹Ù…Ù„ JPG Ø£Ùˆ PNG Ø£Ùˆ WebP.' : 'Format non acceptÃ©. Utilisez JPG, PNG ou WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(isArabic ? 'Ø­Ø¬Ù… Ø§Ù„ØµÙˆØ±Ø© ÙƒØ¨ÙŠØ± Ø¬Ø¯Ø§Ù‹. Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ 5 Ù…ÙŠØºØ§Ø¨Ø§ÙŠØª.' : "L'image est trop lourde. Maximum 5 Mo.");
      return;
    }

    setError('');
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();

    setIsUploading(false);

    if (!res.ok) {
      setError(data.error || (isArabic ? 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø±ÙØ¹ Ø§Ù„ØµÙˆØ±Ø©.' : 'Une erreur est survenue lors de l\'upload.'));
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
      {label && <label className="mb-2 block text-sm font-semibold text-gray-700">{isArabic && label === 'Image' ? 'Ø§Ù„ØµÙˆØ±Ø©' : label}</label>}

      <input type="hidden" name={name} value={preview} />

      {preview ? (
        <div className="group relative aspect-square w-full max-w-[200px] overflow-hidden rounded-xl border border-gray-200">
          <img src={preview} alt={isArabic ? 'Ù…Ø¹Ø§ÙŠÙ†Ø©' : 'AperÃ§u'} className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
            <button
              type="button"
              onClick={handleRemove}
              className="grid h-9 w-9 place-items-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={isArabic ? 'Ø­Ø°Ù Ø§Ù„ØµÙˆØ±Ø©' : "Supprimer l'image"}
            >
              <X size={18} />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#E52329]/30 border-t-[#E52329]" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-square w-full max-w-[200px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-center text-gray-400 transition-colors hover:border-[#E52329] hover:text-[#E52329] disabled:opacity-50"
        >
          {isUploading ? (
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#E52329]/30 border-t-[#E52329]" />
          ) : (
            <>
              <ImageIcon size={28} />
              <div className="px-2 text-center">
                <p className="text-xs font-medium">{isArabic ? 'Ø§Ø®ØªØ± ØµÙˆØ±Ø©' : 'Choisir une image'}</p>
                <p className="mt-0.5 text-[10px]">JPG, PNG, WebP · Max 5 Mo</p>
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
          className="mt-2 cursor-pointer text-xs text-[#E52329] hover:underline"
        >
          {isArabic ? 'Ø§Ø®ØªØ± Ù…Ù† Ø§Ù„Ø­Ø§Ø³ÙˆØ¨ Ø£Ùˆ Ø§Ù„Ù‡Ø§ØªÙ' : "Choisir depuis l'ordinateur ou le téléphone"}
        </button>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
