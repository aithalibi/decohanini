'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Package, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { updateOrderStatus } from '@/actions/orders';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order, OrderItem, Product, ProductImage, OrderStatusHistory } from '@prisma/client';
import { toast } from 'sonner';
import { useLanguageStore } from '@/store/language-store';
import { localizeProductName, localizeVariantName } from '@/lib/catalog-i18n';

type OrderWithRelations = Order & {
  items: (OrderItem & { product: (Product & { images: ProductImage[] }) | null })[];
  statusHistory: OrderStatusHistory[];
};

interface OrderDetailsProps {
  order: OrderWithRelations;
}

const AVAILABLE_STATUSES = [
  { value: 'NEW', label: 'Nouvelle', labelAr: 'جديدة' },
  { value: 'CONFIRMED', label: 'Confirmée', labelAr: 'مؤكدة' },
  { value: 'PREPARING', label: 'En préparation', labelAr: 'قيد التحضير' },
  { value: 'SHIPPED', label: 'Expédiée', labelAr: 'تم الشحن' },
  { value: 'DELIVERED', label: 'Livrée', labelAr: 'تم التوصيل' },
  { value: 'CANCELLED', label: 'Annulée', labelAr: 'ملغاة' },
];

export default function OrderDetails({ order }: OrderDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const res = await updateOrderStatus(order.id, newStatus);
    setIsUpdating(false);
    
    if (res.success) {
      toast.success(isArabic ? 'تم تحديث حالة الطلب بنجاح' : 'Statut mis à jour avec succès');
    } else {
      toast.error(res.error);
    }
  };

  const whatsappUrl = `https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Colonne Principale */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Header Commande */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isArabic ? 'الطلب' : 'Commande'} #{order.orderNumber}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isArabic ? 'تاريخ الطلب' : 'Passée le'} {new Date(order.createdAt).toLocaleString(isArabic ? 'ar-MA' : 'fr-FR', {
                dateStyle: 'long', timeStyle: 'short'
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Produits commandés */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Package size={20} className="text-gray-400" />
            <h3 className="font-bold text-gray-800">{isArabic ? 'المنتجات المطلوبة' : 'Articles commandés'}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="p-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                  {item.product?.images?.[0] ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product ? localizeProductName(item.product.slug, item.productName, language) : item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="text-gray-300 m-auto mt-4" size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{item.product ? localizeProductName(item.product.slug, item.productName, language) : item.productName}</p>
                  {item.variantName && <p className="text-xs font-medium text-[#9A6743]">{isArabic ? 'الخيار' : 'Option'}: {localizeVariantName(item.variantName, language)}</p>}
                  <p className="text-sm text-gray-500">{Number(item.unitPrice)} DH x {item.quantity}</p>
                </div>
                <div className="text-end">
                  <p className="font-bold text-[#E52329]">{Number(item.unitPrice) * item.quantity} DH</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 bg-gray-50 flex justify-between items-center">
            <span className="font-bold text-gray-700">{isArabic ? 'المجموع' : 'Total'}</span>
            <span className="text-xl font-bold text-[#E52329]">{Number(order.total)} DH</span>
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Clock size={20} className="text-gray-400" />
            <h3 className="font-bold text-gray-800">{isArabic ? 'سجل الحالات' : 'Historique des statuts'}</h3>
          </div>
          <div className="p-5">
            <div className={`relative space-y-6 border-gray-200 ${isArabic ? 'mr-3 border-r-2' : 'ml-3 border-l-2'}`}>
              {order.statusHistory.map((history) => (
                <div key={history.id} className={`relative ${isArabic ? 'pr-6' : 'pl-6'}`}>
                  <span className={`absolute top-1 h-4 w-4 rounded-full border-2 border-[#E52329] bg-white ${isArabic ? '-right-[9px]' : '-left-[9px]'}`} />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-900">
                      {(() => { const status = AVAILABLE_STATUSES.find((item) => item.value === history.status); return status ? (isArabic ? status.labelAr : status.label) : history.status; })()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(history.createdAt).toLocaleString(isArabic ? 'ar-MA' : 'fr-FR')}
                    </span>
                  </div>
                  {history.note && <p className="text-sm text-gray-600">{history.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Colonne Latérale */}
      <div className="space-y-6">
        
        {/* Actions sur le statut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'تغيير الحالة' : 'Changer le statut'}</h3>
          <div className="space-y-2">
            {AVAILABLE_STATUSES.map((status) => {
              const isActive = order.status === status.value;
              return (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isActive || isUpdating}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors border ${
                    isActive 
                      ? 'border-[#E52329] bg-red-50 text-[#E52329]' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isArabic ? status.labelAr : status.label}
                  {isActive && <CheckCircle size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Client info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">{isArabic ? 'الزبون' : 'Client'}</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{order.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{order.address || (isArabic ? 'لا يوجد عنوان' : 'Aucune adresse')}</p>
                {order.city && <p className="text-sm font-medium text-gray-900 mt-1">{order.city}</p>}
              </div>
            </div>

            {order.notes && (
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 mt-4">
                <p className="text-xs font-bold text-orange-800 mb-1">{isArabic ? 'ملاحظات الزبون:' : 'Notes du client :'}</p>
                <p className="text-sm text-orange-700">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <a
              href={`tel:${order.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              <Phone size={18} />
              {isArabic ? 'اتصال' : 'Appeler'}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
