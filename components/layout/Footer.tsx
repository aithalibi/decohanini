'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
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

function FacebookSticker() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.5 20v-6.5H16l.5-2.5h-3v-1.7c0-.7.2-1.3 1.4-1.3H16V5.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H6v2.5h2.8V20h4.7Z"
      />
    </svg>
  );
}

function InstagramSticker() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.75" cy="7.25" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TikTokSticker() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.3 4c.6 1.9 1.8 3.2 3.7 3.6v2.5c-1.3 0-2.6-.4-3.7-1.1v5.5c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.1-.9-.1-1.3 0-2.3 1-2.3 2.3 0 1.3 1 2.3 2.3 2.3s2.3-1 2.3-2.3V4h2.7Z"
      />
    </svg>
  );
}

export default function Footer({ settings }: { settings: FooterSettings }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const isArabic = language === 'AR';
  const whatsappNumber = settings.whatsappNumber.replace(/\D/g, '') || '212714516493';
  const displayPhone = settings.phone || whatsappNumber.replace(/^212/, '0');
  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/deco_hanini?igsh=MXgwaGthMGF4dGV4aA==';
  const facebookUrl = settings.facebookUrl || 'https://www.facebook.com/profile.php?id=61566350369524&mibextid=rS40aB7S9Ucbxw6v';
  const tiktokUrl = 'https://www.tiktok.com/@decohanini?_r=1&_t=ZS-98MVwLeH7VB';
  const headingClass = 'mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#D8B47A]';

  return (
    <footer id="contact-section" className="w-full border-t border-[#A77A4E]/35 bg-[#0b0a09] text-[#F7F0E6]" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto grid w-full max-w-[1400px] gap-x-8 gap-y-9 px-6 py-10 sm:grid-cols-2 md:px-8 lg:grid-cols-12 lg:gap-x-10 lg:py-12">
        <div id="about-section" className="sm:col-span-2 lg:col-span-4">
          <Logo light className="items-start" />
          <p className="mt-4 max-w-sm text-[13px] leading-6 text-[#F7F0E6]/70">{t.brandDescription}</p>
        </div>

        <div className="lg:col-span-2">
          <h3 className={headingClass}>{t.quickLinks}</h3>
          <nav className="flex flex-col gap-2.5 text-[13px] text-[#F7F0E6]/78">
            <Link href="/" className="transition-colors hover:text-[#D8B47A]">
              {t.accueil}
            </Link>
            <Link href="/boutique" className="transition-colors hover:text-[#D8B47A]">
              {t.boutique}
            </Link>
            <Link href="/#categories-section" className="transition-colors hover:text-[#D8B47A]">
              {t.categories}
            </Link>
            <Link href="/#contact-section" className="transition-colors hover:text-[#D8B47A]">
              {t.contact}
            </Link>
          </nav>
        </div>

        <div className="lg:col-span-3">
          <h3 className={headingClass}>{t.informations}</h3>
          <div className="flex flex-col gap-2.5 text-[13px] leading-5 text-[#F7F0E6]/78">
            <Link href="/livraison-retours" className="transition-colors hover:text-[#D8B47A]">
              {t.deliveryReturns}
            </Link>
            <span className="text-[#D8B47A]">{t.cod}</span>
            <Link href="/conditions" className="transition-colors hover:text-[#D8B47A]">
              {t.terms}
            </Link>
            <Link href="/confidentialite" className="transition-colors hover:text-[#D8B47A]">
              {t.privacy}
            </Link>
            <Link href="/faq" className="transition-colors hover:text-[#D8B47A]">
              FAQ
            </Link>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <h3 className={headingClass}>{t.contactUs}</h3>
          <div className="flex flex-col gap-3 text-[13px] text-[#F7F0E6]/78">
            <a href={`tel:${displayPhone}`} className="flex items-center gap-3 transition-colors hover:text-[#D8B47A]">
              <Phone size={16} className="shrink-0 text-[#D8B47A]" />
              {displayPhone}
            </a>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#D8B47A]">
              Instagram
            </a>
            <a href={tiktokUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#D8B47A]">
              TikTok
            </a>
            <a href={facebookUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#D8B47A]">
              Facebook
            </a>
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 break-all transition-colors hover:text-[#D8B47A]"
              >
                <Mail size={16} className="shrink-0 text-[#D8B47A]" />
                {settings.email}
              </a>
            )}
            <span className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#D8B47A]" />
              {settings.address || (isArabic ? 'المغرب' : 'Maroc')}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#D8B47A]/15 px-4 py-4 text-center text-[10px] tracking-[0.18em] text-[#F7F0E6]/48">
        © 2026 {settings.storeName}. {t.rightsReserved}
      </div>
    </footer>
  );
}
