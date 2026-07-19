'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';

interface DeleteConfirmDialogProps {
  title?: string;
  description?: string;
  onConfirm: () => Promise<void>;
  trigger?: React.ReactNode;
}

export default function DeleteConfirmDialog({
  title = 'Confirmer la suppression',
  description = 'Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?',
  onConfirm,
  trigger,
}: DeleteConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const resolvedTitle = isArabic && title === 'Confirmer la suppression' ? 'تأكيد الحذف' : title;
  const resolvedDescription = isArabic && description === 'Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?' ? 'لا يمكن التراجع عن هذا الإجراء. هل تريد فعلاً حذف هذا العنصر؟' : description;

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger ?? (
          <button
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            aria-label={isArabic ? 'حذف' : 'Supprimer'}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !isLoading && setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={28} className="text-[#E52329]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{resolvedTitle}</h3>
              <p className="text-sm text-gray-500 mt-2">{resolvedDescription}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isArabic ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-[#E52329] text-white rounded-xl font-medium hover:bg-[#B8161B] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={16} />
                    {isArabic ? 'حذف' : 'Supprimer'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
