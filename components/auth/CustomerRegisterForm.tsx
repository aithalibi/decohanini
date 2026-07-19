'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { registerCustomer } from '@/actions/customer-auth';
import { registerTranslations } from '@/data/auth-translations';
import { useLanguageStore } from '@/store/language-store';

export default function CustomerRegisterForm({ callbackUrl = '/account' }: { callbackUrl?: string }) {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const t = registerTranslations[language];
  const isArabic = language === 'AR';
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get('password') || '');

    startTransition(async () => {
      const result = await registerCustomer(formData);
      if (!result.success || !result.email) {
        if (language === 'AR') {
          const serverError = result.error || '';
          setError(serverError.includes('existe déjà')
            ? 'يوجد حساب مسجل بهذا البريد الإلكتروني.'
            : serverError.includes('correspondent pas')
              ? 'كلمتا المرور غير متطابقتين.'
              : serverError.includes('8 caractères')
                ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.'
                : t.genericError);
        } else {
          setError(result.error || t.genericError);
        }
        return;
      }
      const loginResult = await signIn('credentials', { email: result.email, password, redirect: false });
      if (loginResult?.error) {
        router.push(`/connexion?inscription=success&callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    });
  };

  const fieldClass = `h-12 w-full rounded-xl border border-brand-sand bg-brand-cream/60 text-sm outline-none focus:border-brand-caramel ${isArabic ? 'pl-4 pr-11 text-right' : 'pl-11 pr-4'}`;
  const labelClass = 'mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-brand-brown';
  const iconClass = `absolute top-1/2 -translate-y-1/2 text-brand-caramel ${isArabic ? 'right-4' : 'left-4'}`;
  const loginHref = `/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block"><span className={labelClass}>{t.fullName}</span><span className="relative block"><User size={18} className={iconClass} /><input name="name" type="text" autoComplete="name" required minLength={2} placeholder={t.fullNamePlaceholder} className={fieldClass} /></span></label>
      <label className="block"><span className={labelClass}>{t.email}</span><span className="relative block"><Mail size={18} className={iconClass} /><input name="email" type="email" autoComplete="email" required placeholder={t.emailPlaceholder} className={fieldClass} /></span></label>
      <label className="block"><span className={labelClass}>{t.password}</span><span className="relative block"><Lock size={18} className={iconClass} /><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} placeholder={t.passwordPlaceholder} className={`${fieldClass} ${isArabic ? 'pl-12' : 'pr-12'}`} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className={`absolute top-1/2 -translate-y-1/2 text-brand-gray-text ${isArabic ? 'left-4' : 'right-4'}`} aria-label={showPassword ? t.hidePassword : t.showPassword}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
      <label className="block"><span className={labelClass}>{t.confirmPassword}</span><span className="relative block"><Lock size={18} className={iconClass} /><input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} placeholder={t.confirmPasswordPlaceholder} className={fieldClass} /></span></label>
      <button type="submit" disabled={isPending} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-espresso text-sm font-bold text-brand-cream transition-colors hover:bg-brand-brown disabled:opacity-60">
        {isPending && <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-cream/30 border-t-brand-cream" />}
        {isPending ? t.submitting : t.submit}
      </button>
      <p className="pt-2 text-center text-sm text-brand-gray-text">{t.existingAccount} <Link href={loginHref} className="font-bold text-brand-brown hover:text-brand-caramel">{t.login}</Link></p>
    </form>
  );
}
