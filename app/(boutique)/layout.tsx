import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import LanguageProvider from '@/components/layout/LanguageProvider';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import { getCategories } from '@/actions/categories';
import { getSettings } from '@/actions/settings';

export const dynamic = 'force-dynamic';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const navigationCategories = categories
    .filter((category) => category.isVisible)
    .map(({ id, name, slug }) => ({ id, name, slug }));

  const footerSettings = {
    storeName: settings.storeName,
    whatsappNumber: settings.whatsappNumber,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    instagramUrl: settings.instagramUrl,
    facebookUrl: settings.facebookUrl,
  };

  return (
    <LanguageProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col bg-brand-white shadow-[0_0_55px_rgba(45,34,27,0.12)]">
        <Header categories={navigationCategories} />
        <Navbar categories={navigationCategories} />
        <main className="flex-1">{children}</main>
        <Footer settings={footerSettings} />
        <CartDrawer />
        <FloatingWhatsApp phone={settings.whatsappNumber} />
      </div>
    </LanguageProvider>
  );
}
