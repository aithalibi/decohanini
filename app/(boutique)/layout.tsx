import Header from '@/components/layout/Header';
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
      <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(180deg,#fffdfa_0%,#fbf7f0_42%,#f4ecdf_100%)]">
        <Header categories={navigationCategories} />
        <main className="flex-1">{children}</main>
        <Footer settings={footerSettings} />
        <CartDrawer />
        <FloatingWhatsApp phone={settings.whatsappNumber} />
      </div>
    </LanguageProvider>
  );
}
