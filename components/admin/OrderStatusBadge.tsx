'use client';

import React from 'react';
import { useLanguageStore } from '@/store/language-store';

const statusConfig: Record<string, { label: string; labelAr: string; className: string }> = {
  NEW: { label: 'Nouvelle', labelAr: 'جديدة', className: 'bg-blue-100 text-blue-700' },
  CONFIRMED: { label: 'Confirmée', labelAr: 'مؤكدة', className: 'bg-purple-100 text-purple-700' },
  PREPARING: { label: 'En préparation', labelAr: 'قيد التحضير', className: 'bg-yellow-100 text-yellow-700' },
  SHIPPED: { label: 'Expédiée', labelAr: 'تم الشحن', className: 'bg-orange-100 text-orange-700' },
  DELIVERED: { label: 'Livrée', labelAr: 'تم التوصيل', className: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulée', labelAr: 'ملغاة', className: 'bg-red-100 text-red-700' },
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const language = useLanguageStore((state) => state.language);
  const config = statusConfig[status] ?? { label: status, labelAr: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {language === 'AR' ? config.labelAr : config.label}
    </span>
  );
}
