"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/40 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* ================= LOGO ================= */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:scale-105 transition"
        >
          {/* Bunny Logo */}
          <img
            src="/images/bu.png"
            alt="Gina Ballerina Logo"
            className="w-10 h-10 object-contain drop-shadow-sm"
          />

          {/* Brand Text */}
          <span className="text-2xl sm:text-3xl font-dancing font-bold bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent">
            Gina Ballerina
          </span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/about"
            className="text-gray-700 hover:text-pink transition font-medium"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="text-gray-700 hover:text-pink transition font-medium"
          >
            Contact
          </Link>

          <Link
            href="/shop"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-pink to-purple text-white text-sm font-semibold shadow-md hover:scale-105 transition"
          >
            Shop
          </Link>

          <Link
            href="/admin/login"
            className="text-xs text-gray-400/30 hover:text-pink/80 transition ml-2"
            title="Admin access"
          >
            ⚙️
          </Link>
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-gray-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="sm:hidden bg-white/90 backdrop-blur-md border-b border-pink/20 px-4 py-4 flex flex-col gap-3">
          <Link
            href="/about"
            className="text-gray-700 hover:text-pink py-1"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="text-gray-700 hover:text-pink py-1"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          <Link
            href="/shop"
            className="inline-block text-center bg-gradient-to-r from-pink to-purple text-white px-4 py-2 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
        </div>
      )}
    </header>
  );
}