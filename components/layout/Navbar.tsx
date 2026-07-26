'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import { localizeCategoryName } from '@/lib/catalog-i18n';

type NavigationCategory = { id: number; name: string; slug: string };

export default function Navbar({ categories = [] }: { categories?: NavigationCategory[] }) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = translations[language];

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  const links = [
    { label: t.accueil, href: '/', active: pathname === '/' },
    { label: t.boutique, href: '/boutique', active: pathname === '/boutique' },
    { label: t.aPropos, href: '/#about-section', active: false },
    { label: t.contact, href: '/#contact-section', active: false },
  ];
  const linkClass = (active = false) => `flex h-full items-center border-b-2 transition-colors hover:text-brand-taupe ${active ? 'border-brand-taupe text-brand-taupe' : 'border-transparent'}`;

  return (
    <nav className="relative z-30 hidden h-[52px] w-full bg-[#090909] text-brand-cream md:block">
      <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <div className="flex h-full items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.08em] lg:gap-10">
          {links.slice(0, 2).map((link) => <Link key={link.href} href={link.href} className={linkClass(link.active)}>{link.label}</Link>)}
          <div ref={dropdownRef} className="relative flex h-full items-center">
            <button type="button" onClick={() => setIsDropdownOpen((open) => !open)} className={linkClass(pathname.startsWith('/categorie'))}>
              <span className="flex items-center gap-1">{t.categories}<ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} /></span>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full min-w-64 overflow-hidden rounded-b-xl border border-brand-brown bg-brand-espresso py-2 shadow-2xl">
                {categories.map((category) => (
                  <Link key={category.id} href={`/categorie/${category.slug}`} onClick={() => setIsDropdownOpen(false)} className="block px-5 py-3 text-xs font-medium normal-case tracking-normal text-brand-sand transition-colors hover:bg-brand-brown hover:text-white">
                    {localizeCategoryName(category.slug, category.name, language)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {links.slice(2).map((link) => <Link key={link.href} href={link.href} className={linkClass()}>{link.label}</Link>)}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-brand-taupe">
          <button type="button" onClick={() => setLanguage('FR')} className={language === 'FR' ? 'text-white' : 'hover:text-white'}>FR</button>
          <span>|</span>
          <button type="button" onClick={() => setLanguage('AR')} className={language === 'AR' ? 'text-white' : 'hover:text-white'}>AR</button>
        </div>
      </div>
    </nav>
  );
}
