"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import LandingHeader from "./LandingHeader"; // make sure the file exists

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isLandingPage = pathname === "/";

  return (
    <>
      {!isAdminRoute && (isLandingPage ? <LandingHeader /> : <Header />)}
      <main className="relative z-10 min-h-screen">{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  );
}