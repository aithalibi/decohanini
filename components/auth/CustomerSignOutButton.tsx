'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useLanguageStore } from '@/store/language-store';

export default function CustomerSignOutButton() {
  const language = useLanguageStore((state) => state.language);
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="inline-flex items-center gap-2 rounded-full border border-brand-brown px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-brand-brown hover:bg-brand-sand">
      <LogOut size={15} />{language === 'AR' ? 'تسجيل الخروج' : 'Se déconnecter'}
    </button>
  );
}
