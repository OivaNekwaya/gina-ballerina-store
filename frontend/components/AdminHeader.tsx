"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const [pathname, setPathname] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    setPathname(window.location.pathname);
    setIsMounted(true);
  }, []);

  const isLoginPage = pathname === "/admin/login";

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  // During SSR and before mount, render a static placeholder that matches
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-dancing font-bold text-pink">Gina Ballerina</span>
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Admin</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Placeholder to keep layout stable */}
              <div className="w-24 h-8 invisible" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            {isLoginPage ? (
              <span className="text-2xl font-dancing font-bold text-pink">
                Gina Ballerina
              </span>
            ) : (
              <Link href="/admin" className="text-2xl font-dancing font-bold text-pink">
                Gina Ballerina
              </Link>
            )}
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-3 py-1.5 rounded-full flex items-center gap-1 transition text-sm"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to Store</span>
            </Link>

            {!isLoginPage && (
              <button
                onClick={logout}
                className="border border-pink bg-pink hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}