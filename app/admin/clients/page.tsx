import { Users } from 'lucide-react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import EmptyState from '@/components/admin/EmptyState';
import { getCustomers } from '@/actions/customers';
import { AdminDate, AdminText } from '@/components/admin/AdminI18n';

export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <AdminLayoutClient title="Clients" titleAr="الزبناء" subtitle="Consultez les comptes et leur historique de commandes" subtitleAr="عرض الحسابات وسجل الطلبات">
      <div className="mx-auto max-w-7xl">
        {customers.length === 0 ? <div className="rounded-2xl border border-[#E6D8C8] bg-white"><EmptyState icon={Users} title={<AdminText fr="Aucun client inscrit" ar="لا يوجد زبناء مسجلون" />} description={<AdminText fr="Les nouveaux comptes clients apparaîtront ici." ar="ستظهر حسابات الزبناء الجديدة هنا." />} /></div> : (
          <div className="overflow-hidden rounded-2xl border border-[#E6D8C8] bg-white shadow-sm">
            <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-start"><thead><tr className="border-b border-[#E6D8C8] bg-[#FBF8F3] text-xs uppercase tracking-wider text-[#8B735F]"><th className="px-6 py-4"><AdminText fr="Client" ar="الزبون" /></th><th className="px-6 py-4"><AdminText fr="Inscription" ar="التسجيل" /></th><th className="px-6 py-4"><AdminText fr="Commandes" ar="الطلبات" /></th><th className="px-6 py-4"><AdminText fr="Total commandé" ar="مجموع الطلبات" /></th></tr></thead><tbody className="divide-y divide-[#EEE3D8]">{customers.map((customer) => <tr key={customer.id}><td className="px-6 py-4"><strong className="block text-sm text-[#3B281F]">{customer.name}</strong><span className="text-xs text-gray-500">{customer.email}</span></td><td className="px-6 py-4 text-sm text-gray-600"><AdminDate value={customer.createdAt.toISOString()} /></td><td className="px-6 py-4 text-sm font-semibold">{customer._count.orders}</td><td className="px-6 py-4 text-sm font-bold text-[#9A6743]">{customer.orders.reduce((sum, order) => sum + Number(order.total), 0)} DH</td></tr>)}</tbody></table></div>
          </div>
        )}
      </div>
    </AdminLayoutClient>
  );
}
