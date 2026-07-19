'use client';

import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Logo from './Logo';
import { useLanguageStore } from '@/store/language-store';
import { translations } from '@/data/translations';

type FooterSettings = {
  storeName: string;
  whatsappNumber: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
};

export default function Footer({ settings }: { settings: FooterSettings }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const isArabic = language === 'AR';
  const whatsappNumber = settings.whatsappNumber.replace(/\D/g, '') || '212777422673';
  const displayPhone = settings.phone || whatsappNumber.replace(/^212/, '0');
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const headingClass = 'mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8B47A]';

  return (
    <footer id="contact-section" className="w-full border-t-4 border-[#A77A4E] bg-[#090909] text-[#F7F0E6]" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto grid w-full max-w-[1240px] gap-x-8 gap-y-9 px-6 py-10 sm:grid-cols-2 md:px-8 lg:grid-cols-12 lg:gap-x-10 lg:py-11">
        <div id="about-section" className="sm:col-span-2 lg:col-span-4">
          <Logo light className="items-start" />
          <p className="mt-4 max-w-sm text-[13px] leading-6 text-[#F7F0E6]/75">{t.brandDescription}</p>
          <div className="mt-4 flex gap-2.5">
            {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-[#D8B47A]/40 text-xs font-bold text-[#D8B47A] transition-colors hover:bg-[#A77A4E] hover:text-white" aria-label="Facebook">f</a>}
            {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-[#D8B47A]/40 text-[10px] font-bold text-[#D8B47A] transition-colors hover:bg-[#A77A4E] hover:text-white" aria-label="Instagram">ig</a>}
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-[#D8B47A]/40 text-[#D8B47A] transition-colors hover:bg-[#A77A4E] hover:text-white" aria-label="WhatsApp"><MessageCircle size={15} /></a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className={headingClass}>{t.quickLinks}</h3>
          <nav className="flex flex-col gap-2.5 text-[13px] text-[#F7F0E6]/80">
            <Link href="/" className="transition-colors hover:text-[#D8B47A]">{t.accueil}</Link>
            <Link href="/boutique" className="transition-colors hover:text-[#D8B47A]">{t.boutique}</Link>
            <Link href="/#categories-section" className="transition-colors hover:text-[#D8B47A]">{t.categories}</Link>
            <Link href="/#about-section" className="transition-colors hover:text-[#D8B47A]">{t.aPropos}</Link>
          </nav>
        </div>

        <div className="lg:col-span-3">
          <h3 className={headingClass}>{t.informations}</h3>
          <div className="flex flex-col gap-2.5 text-[13px] leading-5 text-[#F7F0E6]/80">
            <Link href="/livraison-retours" className="transition-colors hover:text-[#D8B47A]">{t.deliveryReturns}</Link>
            <span className="text-[#D8B47A]">{t.cod}</span>
            <Link href="/conditions" className="transition-colors hover:text-[#D8B47A]">{t.terms}</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-[#D8B47A]">{t.privacy}</Link>
            <Link href="/faq" className="transition-colors hover:text-[#D8B47A]">FAQ</Link>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <h3 className={headingClass}>{t.contactUs}</h3>
          <div className="flex flex-col gap-3 text-[13px] text-[#F7F0E6]/80">
            <a href={`tel:${displayPhone}`} className="flex items-center gap-3 transition-colors hover:text-[#D8B47A]"><Phone size={16} className="shrink-0 text-[#D8B47A]" />{displayPhone}</a>
            {settings.email && <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all transition-colors hover:text-[#D8B47A]"><Mail size={16} className="shrink-0 text-[#D8B47A]" />{settings.email}</a>}
            <span className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-[#D8B47A]" />{settings.address || (isArabic ? 'المغرب' : 'Maroc')}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#D8B47A]/15 px-4 py-4 text-center text-[10px] tracking-wide text-[#F7F0E6]/50">
        © 2026 {settings.storeName}. {t.rightsReserved}
      </div>
    </footer>
  );
}
