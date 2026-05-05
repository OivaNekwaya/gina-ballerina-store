"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className="relative z-10 min-h-screen">{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  );
}