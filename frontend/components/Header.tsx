"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // ✅ Hide this header on landing page and admin pages
  if (pathname === "/" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-pink/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex flex-col">
            <Link 
              href="/" 
              className="text-3xl md:text-4xl font-dancing font-bold bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent hover:scale-105 transition"
            >
              Gina Ballerina
            </Link>
            <span className="text-xs text-pink/70 font-quicksand -mt-1 hidden sm:block">
              ✨ digital dance magic – download, print, twirl ✨
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/shop" className="text-gray-600 hover:text-pink font-medium transition">
              Shop
            </Link>

            <Link href="/lookup" className="text-gray-600 hover:text-pink font-medium transition">
              Order Lookup
            </Link>

            <Link href="/cart" className="relative text-gray-600 hover:text-pink transition">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-600">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-pink/20 mt-2">
            <Link
              href="/shop"
              className="block text-gray-600 hover:text-pink py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>

            <Link
              href="/lookup"
              className="block text-gray-600 hover:text-pink py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Order Lookup
            </Link>

            <span className="block text-xs text-pink/70 text-center pt-2">
              ✨ digital dance magic ✨
            </span>
          </div>
        )}
      </div>
    </header>
  );
}