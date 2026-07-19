'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { loginTranslations } from '@/data/auth-translations';
import { useLanguageStore } from '@/store/language-store';

export default function CustomerLoginForm({ callbackUrl = '/account' }: { callbackUrl?: string }) {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const t = loginTranslations[language];
  const isArabic = language === 'AR';
  const registerHref = `/inscription?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });
        if (result?.error) {
          setError(t.invalidCredentials);
          return;
        }
        const session = await getSession();
        router.push(session?.user?.role === 'ADMIN' ? '/admin' : callbackUrl);
        router.refresh();
      } catch {
        setError(t.unavailable);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-brand-brown">{t.email}</span>
        <span className="relative block"><Mail size={18} className={`absolute top-1/2 -translate-y-1/2 text-brand-caramel ${isArabic ? 'right-4' : 'left-4'}`} /><input type="text" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder={t.emailPlaceholder} className={`h-12 w-full rounded-xl border border-brand-sand bg-brand-cream/60 text-sm outline-none focus:border-brand-caramel ${isArabic ? 'pl-4 pr-11 text-right' : 'pl-11 pr-4'}`} /></span>
      </label>
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-brand-brown">{t.password}</span>
        <span className="relative block"><Lock size={18} className={`absolute top-1/2 -translate-y-1/2 text-brand-caramel ${isArabic ? 'right-4' : 'left-4'}`} /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder={t.passwordPlaceholder} className={`h-12 w-full rounded-xl border border-brand-sand bg-brand-cream/60 text-sm outline-none focus:border-brand-caramel ${isArabic ? 'pl-12 pr-11 text-right' : 'pl-11 pr-12'}`} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className={`absolute top-1/2 -translate-y-1/2 text-brand-gray-text ${isArabic ? 'left-4' : 'right-4'}`} aria-label={showPassword ? t.hidePassword : t.showPassword}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span>
      </label>
      <button type="submit" disabled={isPending} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-espresso text-sm font-bold text-brand-cream transition-colors hover:bg-brand-brown disabled:opacity-60">
        {isPending && <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-cream/30 border-t-brand-cream" />}
        {isPending ? t.submitting : t.submit}
      </button>
      <p className="pt-2 text-center text-sm text-brand-gray-text">{t.noAccount} <Link href={registerHref} className="font-bold text-brand-brown hover:text-brand-caramel">{t.createAccount}</Link></p>
    </form>
  );
}
