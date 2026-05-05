"use client";
import Link from "next/link";

export default function AdminLanding() {
  return (
    <>
      {/* Local background image */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/pink.png')", // change extension if needed
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="fixed inset-0 -z-15 bg-black/50" />

      {/* Content – same as before */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-xl w-full rounded-3xl p-10 shadow-2xl border"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.2)",
          }}
        >
          <div className="text-5xl mb-4">🩰</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg">
            Admin Access
          </h1>
          <p className="text-pink-100 text-base md:text-lg mb-8 font-light italic">
            Manage everything beautifully — products, orders, and settings, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin/dashboard" className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg hover:scale-105 transition">
              ⚡ Go to Dashboard
            </Link>
            <Link href="/admin/orders" className="px-8 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition">
              📋 View Orders
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-pink-300 text-xs">✦</span>
            <p className="text-white/50 text-xs tracking-widest uppercase">Secure · Authorised Personnel Only</p>
            <span className="text-pink-300 text-xs">✦</span>
          </div>
        </div>
        <div className="mt-6 text-white/40 text-xs tracking-wider uppercase">Gina Ballerina — Admin</div>
      </div>
    </>
  );
}