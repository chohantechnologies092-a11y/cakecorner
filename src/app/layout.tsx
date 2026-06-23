import type { Metadata } from "next";
import { Playfair_Display, Outfit, Pacifico } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-heading',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-body',
});

const pacifico = Pacifico({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-script',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // Replace with actual domain later
  title: "Cake Corner | Premium Cake Shop & Bakery",
  description: "Welcome to Cake Corner, your premium destination for occasion cakes, cupcakes, macarons, and bite-sized pastries.",
  keywords: ["cakes", "bakery", "cupcakes", "macarons", "wedding cakes", "cake corner", "custom cakes", "birthday cakes"],
  openGraph: {
    title: "Cake Corner | Premium Cake Shop & Bakery",
    description: "Welcome to Cake Corner, your premium destination for occasion cakes, cupcakes, macarons, and bite-sized pastries.",
    url: "/",
    siteName: "Cake Corner",
    images: [
      {
        url: "/logo.webp", // Replace with high-res OG image later
        width: 800,
        height: 600,
        alt: "Cake Corner Premium Bakery",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cake Corner | Premium Bakery",
    description: "Order premium custom cakes online.",
    images: ["/logo.webp"],
  },
};

import Footer from "@/components/layout/Footer";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import LayoutContent from "@/components/layout/LayoutContent";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} ${pacifico.variable}`} suppressHydrationWarning>
        <AnalyticsTracker />
        <CartProvider>
          <LayoutContent header={<HeaderWrapper />} footer={<Footer />}>
            {children}
          </LayoutContent>
        </CartProvider>
      </body>
    </html>
  );
}
