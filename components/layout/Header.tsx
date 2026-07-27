'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useFavoriteStore } from '@/store/favorite-store';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';
import { localizeCategoryName } from '@/lib/catalog-i18n';
import Logo from './Logo';

type NavigationCategory = { id: number; name: string; slug: string };

export default function Header({ categories = [] }: { categories?: NavigationCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState('');
  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const favorites = useFavoriteStore((state) => state.favorites);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = translations[language];

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const totalCartCount = isMounted ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  const favoritesCount = isMounted ? favorites.length : 0;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/boutique?recherche=${encodeURIComponent(query)}` : '/boutique');
    setIsMobileMenuOpen(false);
  };

  const counter = (count: number) =>
    count > 0 && (
      <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-caramel px-1 text-[9px] font-bold text-white">
        {count}
      </span>
    );

  const navItemClass = (active = false) =>
    `transition-colors ${
      active ? 'text-brand-caramel' : 'text-brand-espresso hover:text-brand-caramel'
    }`;

  const navUnderlineClass = (active = false) =>
    `relative pb-1 transition-colors ${
      active ? 'text-brand-caramel after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-brand-caramel' : 'text-brand-espresso hover:text-brand-caramel'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-sand bg-brand-cream/96 backdrop-blur-xl">
      <div className="overflow-hidden border-b border-brand-sand/80 bg-brand-espresso text-brand-cream">
        <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-10">
          <div className="overflow-hidden py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
            <div className="animate-marquee-left flex w-max items-center gap-2 whitespace-nowrap will-change-transform">
              <span className="shrink-0 text-brand-sand/70">Décoration Hanini</span>
              <span className="shrink-0 text-brand-cream/90">· Livraison partout au Maroc</span>
              <span className="shrink-0 text-brand-cream/90">· Paiement à la livraison</span>
              <span className="shrink-0 text-brand-cream/90">· Produits premium</span>
              <span className="shrink-0 text-brand-sand/70">Décoration Hanini</span>
              <span className="shrink-0 text-brand-cream/90">· Livraison partout au Maroc</span>
              <span className="shrink-0 text-brand-cream/90">· Paiement à la livraison</span>
              <span className="shrink-0 text-brand-cream/90">· Produits premium</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid h-[82px] grid-cols-[1fr_auto_1fr] items-center px-4 md:hidden">
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-brand-espresso transition-colors hover:bg-brand-sand/70"
            aria-label={t.openMenu}
          >
            <Menu size={23} strokeWidth={1.7} />
          </button>
        </div>

        <Link href="/" aria-label="Déco Hanini - Accueil" className="justify-self-center">
          <Logo compact />
        </Link>

        <div className="flex items-center justify-self-end">
          <div className="mr-2 flex items-center rounded-full border border-brand-sand bg-white/85 p-0.5 text-[10px] font-bold uppercase tracking-[0.14em] shadow-[0_8px_20px_rgba(83,58,42,0.05)]">
            <button
              type="button"
              onClick={() => setLanguage('FR')}
              className={`rounded-full px-2.5 py-1.5 transition-colors ${
                language === 'FR' ? 'bg-brand-brown text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'
              }`}
              aria-pressed={language === 'FR'}
              aria-label="Français"
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLanguage('AR')}
              className={`rounded-full px-2.5 py-1.5 transition-colors ${
                language === 'AR' ? 'bg-brand-brown text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'
              }`}
              aria-pressed={language === 'AR'}
              aria-label="العربية"
            >
              AR
            </button>
          </div>
          <button
            type="button"
            onClick={() => router.push('/boutique')}
            className="grid h-10 w-10 place-items-center rounded-full text-brand-espresso transition-colors hover:bg-brand-sand/70"
            aria-label="Rechercher"
          >
            <Search size={21} strokeWidth={1.7} />
          </button>
          <Link href="/favoris" className="relative grid h-10 w-10 place-items-center text-brand-espresso" aria-label={t.favoris}>
            <span className="relative">
              <Heart size={21} strokeWidth={1.7} />
              {counter(favoritesCount)}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => toggleCart(true)}
            className="relative grid h-10 w-10 place-items-center text-brand-espresso"
            aria-label={t.panier}
          >
            <span className="relative">
              <ShoppingBag size={21} strokeWidth={1.7} />
              {counter(totalCartCount)}
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-[1400px] grid-cols-[240px_minmax(0,1fr)_300px] items-center gap-6 px-5 py-4 lg:grid lg:px-10">
        <Link href="/" aria-label="Déco Hanini - Accueil" className="justify-self-start">
          <Logo />
        </Link>

        <div className="flex min-w-0 flex-col items-center gap-3 justify-self-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
            <Link href="/" className={navUnderlineClass(pathname === '/')}>
              {t.accueil}
            </Link>
            <Link href="/boutique" className={navUnderlineClass(pathname.startsWith('/boutique'))}>
              {t.boutique}
            </Link>
            <div className="group relative flex items-center gap-1 transition-colors hover:text-brand-caramel">
              <Link href="/#categories-section" className={navUnderlineClass(pathname.startsWith('/categorie'))}>
                {t.categories}
              </Link>
              <ChevronDown size={12} />
              <div className="invisible absolute left-1/2 top-full z-20 mt-3 w-64 -translate-x-1/2 rounded-[18px] border border-brand-sand bg-white p-2 opacity-0 shadow-[0_10px_30px_rgba(45,34,27,0.08)] transition-all group-hover:visible group-hover:opacity-100">
                {categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.id}
                    href={`/categorie/${category.slug}`}
                    className="block rounded-full px-4 py-2 text-[10px] font-medium normal-case tracking-normal text-brand-brown transition-colors hover:bg-brand-cream"
                  >
                    {localizeCategoryName(category.slug, category.name, language)}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/#about-section" className={navItemClass(false)}>
              {t.aPropos}
            </Link>
            <Link href="/#contact-section" className={navItemClass(false)}>
              {t.contact}
            </Link>
          </nav>

          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-[760px] overflow-hidden rounded-full border border-brand-taupe bg-white/85 shadow-[0_10px_26px_rgba(83,58,42,0.06)]"
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder={t.searchPlaceholder}
              className="h-12 min-w-0 flex-1 bg-transparent px-5 text-sm text-brand-espresso outline-none placeholder:text-brand-gray-text"
            />
            <button
              type="submit"
              className="grid h-12 w-14 place-items-center bg-brand-espresso text-brand-cream transition-colors hover:bg-brand-brown"
              aria-label="Rechercher"
            >
              <Search size={19} />
            </button>
          </form>
        </div>

        <div className="flex items-center justify-end gap-4 xl:gap-5">
          <div className="flex items-center rounded-full border border-brand-sand bg-white/80 p-1 text-[10px] font-bold uppercase tracking-[0.16em] shadow-[0_8px_20px_rgba(83,58,42,0.05)]">
            <button
              type="button"
              onClick={() => setLanguage('FR')}
              className={`rounded-full px-3.5 py-2 transition-colors ${
                language === 'FR' ? 'bg-brand-brown text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'
              }`}
              aria-pressed={language === 'FR'}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLanguage('AR')}
              className={`rounded-full px-3.5 py-2 transition-colors ${
                language === 'AR' ? 'bg-brand-brown text-brand-cream' : 'text-brand-gray-text hover:text-brand-brown'
              }`}
              aria-pressed={language === 'AR'}
            >
              AR
            </button>
          </div>
          <Link href="/account" className="flex min-w-[76px] flex-col items-center gap-1 text-brand-espresso transition-colors hover:text-brand-caramel">
            <User size={22} strokeWidth={1.7} />
            <span className="text-[10px] leading-none whitespace-nowrap">{t.monCompte}</span>
          </Link>
          <Link href="/favoris" className="flex flex-col items-center gap-1 text-brand-espresso transition-colors hover:text-brand-caramel">
            <span className="relative">
              <Heart size={22} strokeWidth={1.7} />
              {counter(favoritesCount)}
            </span>
            <span className="text-[10px]">{t.favoris}</span>
          </Link>
          <button
            type="button"
            onClick={() => toggleCart(true)}
            className="flex flex-col items-center gap-1 text-brand-espresso transition-colors hover:text-brand-caramel"
          >
            <span className="relative">
              <ShoppingBag size={22} strokeWidth={1.7} />
              {counter(totalCartCount)}
            </span>
            <span className="text-[10px]">{t.panier}</span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-brand-espresso/55 transition-opacity md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside
        className={`fixed top-0 z-[60] h-dvh w-[min(88vw,360px)] overflow-y-auto bg-brand-cream p-5 shadow-2xl transition-transform duration-300 md:hidden ${
          language === 'AR' ? 'right-0' : 'left-0'
        } ${isMobileMenuOpen ? 'translate-x-0' : language === 'AR' ? 'translate-x-full' : '-translate-x-full'}`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-brand-sand pb-5">
          <Logo compact className="items-start" />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand-sand/60 text-brand-espresso"
            aria-label={t.closeMenu}
          >
            <X size={21} />
          </button>
        </div>
        <form onSubmit={handleSearch} className="mb-6 flex overflow-hidden rounded-full border border-brand-taupe bg-white/70">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="search"
            placeholder={t.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
          />
          <button type="submit" className="bg-brand-espresso px-4 text-brand-cream" aria-label="Rechercher">
            <Search size={18} />
          </button>
        </form>
        <nav className="flex flex-col text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-espresso">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-brand-sand py-3.5">
            {t.accueil}
          </Link>
          <Link href="/boutique" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-brand-sand py-3.5">
            {t.boutique}
          </Link>
          <p className="pt-5 text-[10px] tracking-[0.2em] text-brand-caramel">{t.categories}</p>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorie/${category.slug}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="border-b border-brand-sand/70 py-3 font-normal normal-case tracking-normal text-brand-brown"
            >
              {localizeCategoryName(category.slug, category.name, language)}
            </Link>
          ))}
          <Link href="/#about-section" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 border-b border-brand-sand py-3.5">
            {t.aPropos}
          </Link>
          <Link href="/#contact-section" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-brand-sand py-3.5">
            {t.contact}
          </Link>
          <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-brand-sand py-3.5 text-brand-caramel">
            {t.monCompte}
          </Link>
        </nav>
        <div className="mt-6 flex items-center gap-2 text-xs font-bold">
          <button type="button" onClick={() => setLanguage('FR')} className={language === 'FR' ? 'text-brand-caramel' : 'text-brand-gray-text'}>
            FR
          </button>
          <span className="text-brand-taupe">|</span>
          <button type="button" onClick={() => setLanguage('AR')} className={language === 'AR' ? 'text-brand-caramel' : 'text-brand-gray-text'}>
            AR
          </button>
        </div>
      </aside>
    </header>
  );
}
