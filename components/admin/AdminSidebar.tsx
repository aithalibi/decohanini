'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Eye, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Tag, Users, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Logo from '@/components/layout/Logo';
import { useLanguageStore } from '@/store/language-store';

const navItems = [
  { href: '/admin', label: 'Tableau de bord', labelAr: 'لوحة التحكم', icon: LayoutDashboard, exact: true },
  { href: '/admin/produits', label: 'Produits', labelAr: 'المنتجات', icon: Package },
  { href: '/admin/categories', label: 'Categories', labelAr: 'الفئات', icon: Tag },
  { href: '/admin/commandes', label: 'Commandes', labelAr: 'الطلبات', icon: ShoppingCart },
  { href: '/admin/clients', label: 'Clients', labelAr: 'الزبناء', icon: Users },
  { href: '/admin/apercu-site', label: 'Voir le site', labelAr: 'معاينة الموقع', icon: Eye },
  { href: '/admin/parametres', label: 'Parametres', labelAr: 'الإعدادات', icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const isActive = (href: string, exact = false) => (exact ? pathname === href : pathname.startsWith(href));

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-brand-espresso/55 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 z-40 flex h-full w-72 flex-col bg-brand-beige text-brand-espresso transition-transform duration-300 ${
          isArabic
            ? 'right-0 border-l border-brand-taupe/45 shadow-[-12px_0_35px_rgba(68,47,35,0.12)]'
            : 'left-0 border-r border-brand-taupe/45 shadow-[12px_0_35px_rgba(68,47,35,0.12)]'
        } ${isOpen ? 'translate-x-0' : isArabic ? 'translate-x-full' : '-translate-x-full'} lg:static lg:z-auto lg:translate-x-0`}
      >
        <div className="flex min-h-[86px] items-center justify-between border-b border-brand-taupe/35 bg-brand-cream/65 px-5 py-4">
          <Logo compact className="items-start" />
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-brand-brown text-brand-cream lg:hidden"
            aria-label={isArabic ? 'Fermer le menu' : 'Fermer le menu'}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pt-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-brand-caramel">
            {isArabic ? 'Administration' : 'Administration'}
          </p>
        </div>

        <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand-brown text-brand-cream shadow-lg shadow-brand-brown/15'
                    : 'text-brand-brown hover:bg-brand-sand hover:text-brand-espresso'
                }`}
              >
                <item.icon size={19} strokeWidth={1.8} />
                <span className="flex-1">{isArabic ? item.labelAr : item.label}</span>
                {active && <ChevronRight size={15} className={isArabic ? 'rotate-180' : ''} />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-brand-taupe/35 bg-brand-cream/45 p-4">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-sand hover:text-brand-espresso disabled:opacity-50"
          >
            <LogOut size={19} />
            <span>
              {isSigningOut ? (isArabic ? 'Connexion...' : 'Connexion...') : (isArabic ? 'Se deconnecter' : 'Se deconnecter')}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
