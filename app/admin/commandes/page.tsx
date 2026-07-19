import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import EmptyState from '@/components/admin/EmptyState';
import { getOrders } from '@/actions/orders';
import { AdminDate, AdminText } from '@/components/admin/AdminI18n';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <AdminLayoutClient title="Commandes" titleAr="الطلبات" subtitle="Gérez les commandes de vos clients" subtitleAr="إدارة طلبات الزبناء">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Content */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200">
            <EmptyState
              icon={ShoppingCart}
              title={<AdminText fr="Aucune commande" ar="لا توجد طلبات" />}
              description={<AdminText fr="Les commandes apparaîtront ici dès qu'un client aura finalisé son panier." ar="ستظهر الطلبات هنا عندما يؤكد أحد الزبناء سلته." />}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4"><AdminText fr="Commande" ar="الطلب" /></th>
                    <th className="px-6 py-4"><AdminText fr="Date" ar="التاريخ" /></th>
                    <th className="px-6 py-4"><AdminText fr="Client" ar="الزبون" /></th>
                    <th className="px-6 py-4"><AdminText fr="Articles" ar="المنتجات" /></th>
                    <th className="px-6 py-4"><AdminText fr="Total" ar="المجموع" /></th>
                    <th className="px-6 py-4"><AdminText fr="Statut" ar="الحالة" /></th>
                    <th className="px-6 py-4 text-end"><AdminText fr="Action" ar="الإجراء" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <AdminDate value={order.createdAt.toISOString()} withTime />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.phone}</div>
                        {order.city && <div className="text-[10px] text-gray-400">{order.city}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order._count?.items || 0} <AdminText fr="article(s)" ar="منتج" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#E52329]">{Number(order.total)} DH</span>
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-end">
                        <Link
                          href={`/admin/commandes/${order.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                        >
                          <AdminText fr="Gérer" ar="إدارة" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutClient>
  );
}
