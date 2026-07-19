import React from 'react';
import { notFound } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import OrderDetails from '@/components/admin/OrderDetails';
import { getOrderById } from '@/actions/orders';

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  
  if (isNaN(id)) notFound();

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <AdminLayoutClient title={`Commande #${order.orderNumber}`} titleAr={`الطلب #${order.orderNumber}`} subtitle="Détails et gestion de la commande" subtitleAr="تفاصيل الطلب وإدارته">
      <div className="max-w-7xl mx-auto">
        <OrderDetails order={order} />
      </div>
    </AdminLayoutClient>
  );
}
