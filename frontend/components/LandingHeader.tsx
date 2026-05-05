"use client";
import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/40 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-dancing font-bold bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent hover:scale-105 transition"
        >
          Gina Ballerina
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-8">
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

          {/* Shop CTA */}
          <Link
            href="/" // change to "/shop" if you have a dedicated shop page
            className="px-5 py-2 rounded-full bg-gradient-to-r from-pink to-purple text-white text-sm font-semibold shadow-md hover:scale-105 transition"
          >
            Shop
          </Link>

          {/* Hidden admin link (only visible on hover or low opacity) */}
          <Link
            href="/admin/login"
            className="text-xs text-gray-400/30 hover:text-pink/80 transition ml-2"
            title="Admin access"
          >
            ⚙️
          </Link>
        </div>
      </div>
    </header>
  );
}