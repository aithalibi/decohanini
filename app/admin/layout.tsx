import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Admin — Déco Hanini',
  robots: { index: false, follow: false },
};

// This layout wraps ONLY the auth children (login page)
// The main admin layout is handled per-page using AdminLayoutClient
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
