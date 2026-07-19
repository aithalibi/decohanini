'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useLanguageStore } from '@/store/language-store';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  title: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
}

export default function AdminLayoutClient({ children, title, titleAr, subtitle, subtitleAr }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';

  return (
    <div className="admin-shell flex h-screen bg-brand-light-gray text-brand-espresso" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'fr'}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onMenuOpen={() => setSidebarOpen(true)}
          title={isArabic ? titleAr || title : title}
          subtitle={isArabic ? subtitleAr || subtitle : subtitle}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
