import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'),
  title: "Déco Hanini - L'élégance dans chaque détail | Décoration Marocaine",
  description:
    "Découvrez Déco Hanini, boutique marocaine de décoration d'intérieur premium. Commandez en ligne nos horloges DIY, vaisselle artisanale, vases de pampas et tableaux. Paiement à la livraison partout au Maroc.",
  keywords: "décoration, maroc, décoration marocaine, salon moderne, horloge diy, artisanat marocain, déco hanini, e-commerce maroc",
  authors: [{ name: "Déco Hanini" }],
  openGraph: {
    title: "Déco Hanini - Décoration Marocaine Premium",
    description: "L'élégance dans chaque détail. Découvrez notre sélection unique de décoration pour un intérieur qui vous ressemble.",
    type: "website",
    locale: "fr_FR",
    siteName: "Déco Hanini",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#EEEAE4] font-sans text-brand-espresso">{children}</body>
    </html>
  );
}
