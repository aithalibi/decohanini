'use client';

import { Bell, ExternalLink, Menu } from 'lucide-react';
import { AdminLanguageSwitch } from './AdminI18n';
import { useLanguageStore } from '@/store/language-store';

interface AdminHeaderProps {
  onMenuOpen: () => void;
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ onMenuOpen, title, subtitle }: AdminHeaderProps) {
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  return (
    <header className="sticky top-0 z-20 flex min-h-[74px] items-center gap-4 border-b border-brand-sand bg-brand-cream/95 px-4 py-3 backdrop-blur-lg sm:px-6">
      <button onClick={onMenuOpen} className="grid h-10 w-10 place-items-center rounded-xl bg-brand-sand/60 text-brand-brown lg:hidden" aria-label={isArabic ? 'فتح القائمة' : 'Ouvrir le menu'}><Menu size={21} /></button>
      <div className="min-w-0 flex-1"><h1 className="truncate font-serif text-xl text-brand-espresso sm:text-2xl">{title}</h1>{subtitle && <p className="mt-0.5 truncate text-xs text-brand-gray-text">{subtitle}</p>}</div>
      <div className="flex items-center gap-2">
        <AdminLanguageSwitch compact />
        <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full border border-brand-taupe bg-brand-white px-4 py-2 text-xs font-semibold text-brand-brown hover:bg-brand-sand sm:flex"><ExternalLink size={15} />{isArabic ? 'عرض الموقع' : 'Voir le site'}</a>
        <button className="relative hidden h-10 w-10 place-items-center rounded-full text-brand-brown hover:bg-brand-sand sm:grid" aria-label={isArabic ? 'الإشعارات' : 'Notifications'}><Bell size={19} /></button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-brown text-sm font-bold text-brand-cream">A</div>
      </div>
    </header>
  );
}
