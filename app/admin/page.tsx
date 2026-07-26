import React from 'react';
import { Package, Tag, ShoppingCart, AlertTriangle, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats } from '@/actions/orders';
import DashboardCard from '@/components/admin/DashboardCard';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { AdminText } from '@/components/admin/AdminI18n';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const hasAlerts =
    stats.alertProductsNoImage > 0 ||
    stats.alertProductsOutOfStock > 0 ||
    stats.alertEmptyCategories > 0;

  return (
    <AdminLayoutClient title="Tableau de bord" titleAr="لوحة التحكم" subtitle="Vue d'ensemble de votre boutique" subtitleAr="نظرة عامة على متجرك">
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title={<AdminText fr="Produits" ar="المنتجات" />}
            value={stats.totalProducts}
            icon={Package}
            color="black"
            subtitle={<AdminText fr="au total" ar="في المجموع" />}
          />
          <DashboardCard
            title={<AdminText fr="Catégories" ar="الفئات" />}
            value={stats.totalCategories}
            icon={Tag}
            color="black"
            subtitle={<AdminText fr="actives" ar="نشطة" />}
          />
          <DashboardCard
            title={<AdminText fr="Nouvelles commandes" ar="طلبات جديدة" />}
            value={stats.pendingOrders}
            icon={ShoppingCart}
            color="red"
            subtitle={<AdminText fr="en attente" ar="في الانتظار" />}
          />
          <DashboardCard
            title={<AdminText fr="Rupture de stock" ar="نفاد المخزون" />}
            value={stats.outOfStock}
            icon={AlertTriangle}
            color={stats.outOfStock > 0 ? 'orange' : 'green'}
            subtitle={<AdminText fr="produits" ar="منتجات" />}
          />
        </div>

        {/* Alertes */}
        {hasAlerts && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-orange-500" />
              <h2 className="font-bold text-orange-800 text-sm"><AdminText fr="Alertes à traiter" ar="تنبيهات تحتاج المعالجة" /></h2>
            </div>
            <div className="space-y-2">
              {stats.alertProductsNoImage > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-700">
                    {stats.alertProductsNoImage} <AdminText fr="produit(s) sans image" ar="منتج بدون صورة" />
                  </span>
                  <Link href="/admin/produits" className="text-orange-600 font-semibold hover:underline text-xs">
                    <AdminText fr="Voir →" ar="عرض ←" />
                  </Link>
                </div>
              )}
              {stats.alertProductsOutOfStock > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-700">
                    {stats.alertProductsOutOfStock} <AdminText fr="produit(s) visible(s) en rupture de stock" ar="منتج ظاهر نفد مخزونه" />
                  </span>
                  <Link href="/admin/produits" className="text-orange-600 font-semibold hover:underline text-xs">
                    <AdminText fr="Voir →" ar="عرض ←" />
                  </Link>
                </div>
              )}
              {stats.alertEmptyCategories > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-700">
                    {stats.alertEmptyCategories} <AdminText fr="catégorie(s) sans produit" ar="فئة بدون منتجات" />
                  </span>
                  <Link href="/admin/categories" className="text-orange-600 font-semibold hover:underline text-xs">
                    <AdminText fr="Voir →" ar="عرض ←" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4"><AdminText fr="Actions rapides" ar="إجراءات سريعة" /></h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/admin/produits/nouveau"
              className="flex flex-col items-center gap-2 p-4 bg-[#E52329] text-white rounded-xl hover:bg-[#B8161B] transition-colors text-center"
            >
              <Plus size={22} />
              <span className="text-xs font-bold"><AdminText fr="Ajouter un produit" ar="إضافة منتج" /></span>
            </Link>
            <Link
              href="/admin/categories/nouvelle"
              className="flex flex-col items-center gap-2 p-4 bg-[#080808] text-white rounded-xl hover:bg-neutral-800 transition-colors text-center"
            >
              <Tag size={22} />
              <span className="text-xs font-bold"><AdminText fr="Ajouter une catégorie" ar="إضافة فئة" /></span>
            </Link>
            <Link
              href="/admin/commandes"
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-center"
            >
              <ShoppingCart size={22} />
              <span className="text-xs font-bold"><AdminText fr="Voir les commandes" ar="عرض الطلبات" /></span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-center"
            >
              <Eye size={22} />
              <span className="text-xs font-bold"><AdminText fr="Voir le site" ar="عرض الموقع" /></span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Derniers produits */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800"><AdminText fr="Derniers produits" ar="أحدث المنتجات" /></h2>
              <Link href="/admin/produits" className="text-xs text-[#E52329] font-semibold hover:underline">
                <AdminText fr="Voir tout →" ar="عرض الكل ←" />
              </Link>
            </div>
            {stats.recentProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8"><AdminText fr="Aucun produit" ar="لا توجد منتجات" /></p>
            ) : (
              <div className="space-y-3">
                {stats.recentProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {p.images[0] ? (
                        <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover brightness-110 contrast-105 saturate-110" />
                      ) : (
                        <Package size={18} className="text-gray-300 m-auto mt-1.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category.name} · {Number(p.price)} DH</p>
                    </div>
                    <Link
                      href={`/admin/produits/${p.id}/modifier`}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <AdminText fr="Modifier" ar="تعديل" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dernières commandes */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800"><AdminText fr="Dernières commandes" ar="أحدث الطلبات" /></h2>
              <Link href="/admin/commandes" className="text-xs text-[#E52329] font-semibold hover:underline">
                <AdminText fr="Voir tout →" ar="عرض الكل ←" />
              </Link>
            </div>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8"><AdminText fr="Aucune commande" ar="لا توجد طلبات" /></p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        #{o.orderNumber} · {o.customerName}
                      </p>
                      <p className="text-xs text-gray-400">{Number(o.total)} DH</p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                    <Link
                      href={`/admin/commandes/${o.id}`}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <AdminText fr="Voir" ar="عرض" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayoutClient>
  );
}
