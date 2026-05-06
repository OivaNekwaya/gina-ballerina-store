import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Gina Ballerina – Digital Dance Boutique",
  description: "Beautiful digital downloads for little dancers and grown-up ballerinas. Pink, purple, and grey magic.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}