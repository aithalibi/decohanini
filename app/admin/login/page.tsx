'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { getSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { AdminLanguageSwitch } from '@/components/admin/AdminI18n';
import { useLanguageStore } from '@/store/language-store';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const language = useLanguageStore((state) => state.language);
  const isArabic = language === 'AR';
  const copy = isArabic ? {
    invalid: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
    forbidden: 'هذا الحساب لا يملك صلاحيات الإدارة.',
    back: 'العودة إلى المتجر',
    reserved: 'فضاء خاص',
    title: 'تسجيل دخول الإدارة',
    description: 'سجل الدخول لإدارة المنتجات والفئات والصور والطلبات.',
    username: 'اسم المستخدم',
    usernamePlaceholder: 'أدخل اسم المستخدم',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    hide: 'إخفاء',
    show: 'إظهار',
    loading: 'جاري تسجيل الدخول...',
    submit: 'تسجيل الدخول',
    footer: 'إدارة آمنة',
  } : {
    invalid: 'Identifiant ou mot de passe incorrect.',
    forbidden: 'Ce compte ne possède pas les droits administrateur.',
    back: 'Retour à la boutique',
    reserved: 'Espace réservé',
    title: 'Connexion administrateur',
    description: 'Connectez-vous pour gérer les produits, catégories, photos et commandes.',
    username: 'Identifiant',
    usernamePlaceholder: 'Entrez votre identifiant',
    password: 'Mot de passe',
    passwordPlaceholder: 'Entrez votre mot de passe',
    hide: 'Masquer',
    show: 'Afficher',
    loading: 'Connexion en cours...',
    submit: 'Se connecter',
    footer: 'Administration sécurisée',
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError(copy.invalid);
        return;
      }

      const session = await getSession();
      if (session?.user?.role !== 'ADMIN') {
        await signOut({ redirect: false });
        setError(copy.forbidden);
        return;
      }

      router.push('/admin');
      router.refresh();
    });
  };

  return (
    <div className="warm-speckle relative flex min-h-screen items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'fr'}>
      <div className="absolute right-4 top-4"><AdminLanguageSwitch /></div>
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center" aria-label={copy.back}><Logo /></Link>
        <div className="rounded-[28px] border border-brand-sand bg-brand-white p-6 shadow-[0_20px_60px_rgba(68,47,35,0.12)] sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-caramel">{copy.reserved}</p>
          <h1 className="mt-2 font-serif text-3xl text-brand-espresso">{copy.title}</h1>
          <p className="mt-2 text-sm leading-6 text-brand-gray-text">{copy.description}</p>

          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-brand-brown">{copy.username}</span>
              <span className="relative block"><User size={18} className={`absolute top-1/2 -translate-y-1/2 text-brand-caramel ${isArabic ? 'right-4' : 'left-4'}`} /><input id="email" type="text" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={copy.usernamePlaceholder} required className={`h-12 w-full rounded-xl border border-brand-sand bg-brand-cream/60 text-sm outline-none focus:border-brand-caramel ${isArabic ? 'pl-4 pr-11' : 'pl-11 pr-4'}`} /></span>
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-brand-brown">{copy.password}</span>
              <span className="relative block"><Lock size={18} className={`absolute top-1/2 -translate-y-1/2 text-brand-caramel ${isArabic ? 'right-4' : 'left-4'}`} /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.passwordPlaceholder} required className={`h-12 w-full rounded-xl border border-brand-sand bg-brand-cream/60 text-sm outline-none focus:border-brand-caramel ${isArabic ? 'pl-12 pr-11' : 'pl-11 pr-12'}`} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className={`absolute top-1/2 -translate-y-1/2 text-brand-gray-text hover:text-brand-brown ${isArabic ? 'left-4' : 'right-4'}`} aria-label={showPassword ? copy.hide : copy.show}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span>
            </label>
            <button type="submit" disabled={isPending} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-espresso text-sm font-bold text-brand-cream transition-colors hover:bg-brand-brown disabled:opacity-60">
              {isPending && <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-cream/30 border-t-brand-cream" />}
              {isPending ? copy.loading : copy.submit}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.12em] text-brand-gray-text">Déco Hanini © 2026 · {copy.footer}</p>
      </div>
    </div>
  );
}
