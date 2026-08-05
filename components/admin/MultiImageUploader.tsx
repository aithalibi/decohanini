'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Star, Trash2, Upload } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

const MAX_IMAGES = 6;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export default function MultiImageUploader({ initialUrls = [] }: { initialUrls?: string[] }) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const [urls, setUrls] = useState(initialUrls.slice(0, MAX_IMAGES));
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, MAX_IMAGES - urls.length);
    if (files.length === 0) return;

    const invalid = files.find((file) => !ALLOWED_TYPES.includes(file.type) || file.size > 5 * 1024 * 1024);
    if (invalid) {
      setError(isArabic ? 'يجب أن تكون كل صورة بصيغة JPG أو PNG أو WebP وألا تتجاوز 5 ميغابايت.' : 'Chaque image doit être en JPG, PNG ou WebP et ne pas dépasser 5 Mo.');
      return;
    }

    setError('');
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || (isArabic ? 'تعذر رفع الصورة.' : 'Upload impossible.'));
        uploadedUrls.push(data.url);
      }
      setUrls((current) => [...current, ...uploadedUrls].slice(0, MAX_IMAGES));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : (isArabic ? 'تعذر رفع الصورة.' : 'Upload impossible.'));
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const makeMain = (index: number) => {
    setUrls((current) => [current[index], ...current.filter((_, itemIndex) => itemIndex !== index)]);
  };

  return (
    <div>
      <input type="hidden" name="imageUrls" value={JSON.stringify(urls)} />
      <div className="grid grid-cols-2 gap-3">
        {urls.map((url, index) => (
          <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <img src={url} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
            {index === 0 && <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-[9px] font-bold text-white"><Star size={10} fill="currentColor" />{isArabic ? 'رئيسية' : 'Principale'}</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-black/65 p-2">
              {index > 0 && <button type="button" onClick={() => makeMain(index)} className="rounded-lg bg-white p-2 text-gray-700" title={isArabic ? 'تعيين كصورة رئيسية' : 'Définir comme principale'} aria-label={isArabic ? 'تعيين كصورة رئيسية' : 'Définir comme principale'}><Star size={15} /></button>}
              <button type="button" onClick={() => setUrls((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-500 p-2 text-white" title={isArabic ? 'حذف' : 'Supprimer'} aria-label={isArabic ? 'حذف' : 'Supprimer'}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {urls.length < MAX_IMAGES && (
          <button type="button" disabled={isUploading} onClick={() => inputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-center text-gray-400 transition-colors hover:border-[#E52329] hover:text-[#E52329] disabled:opacity-50">
            {isUploading ? <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#E52329]/25 border-t-[#E52329]" /> : <><ImagePlus size={25} /><span className="text-xs font-semibold">{isArabic ? 'إضافة صور' : 'Ajouter des photos'}</span><span className="text-[9px]">{urls.length}/{MAX_IMAGES}</span></>}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleFiles} className="hidden" />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading || urls.length >= MAX_IMAGES} className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#E52329] disabled:hidden"><Upload size={14} />{isArabic ? 'اختر من الحاسوب أو الهاتف' : 'Choisir depuis l’ordinateur ou le téléphone'}</button>
      <p className="mt-2 text-[10px] leading-4 text-gray-400">{isArabic ? 'ستظهر الصورة الأولى في الكتالوج. يمكنك إضافة 6 صور كحد أقصى.' : 'La première photo sera affichée dans le catalogue. Vous pouvez ajouter jusqu’à 6 images.'}</p>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
