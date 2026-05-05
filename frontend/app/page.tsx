"use client";
import Link from "next/link";
import VisualEnhancements from "@/components/VisualEnhancements";
import LandingHeader from "@/components/LandingHeader"; // ✅ ADD THIS

/* =========================
   MOVING COLLECTION STRIP
========================= */

const collections = [
  { title: "Kids Collection", icon: "🧸", desc: "Coloring, puzzles, and fun dance activities" },
  { title: "Adult Collection", icon: "🧘", desc: "Relaxing journals and mandala art" },
  { title: "Planners", icon: "📅", desc: "Organise your life beautifully" },
  { title: "Dance Packs", icon: "💃", desc: "Creative dance bundles" },
  { title: "Mindfulness", icon: "🌿", desc: "Calm and focus printable kits" },
];

function MovingCollections() {
  return (
    <div className="relative mt-28 w-full overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="flex gap-6 animate-scroll">
        {[...collections, ...collections].map((item, i) => (
          <div
            key={i}
            className="min-w-[260px] bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 
                       hover:scale-110 hover:z-20 transition-all duration-500 cursor-pointer"
          >
            <div className="text-5xl mb-3">{item.icon}</div>
            <h3 className="text-lg font-semibold text-purple">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */

export default function LandingPage() {
  return (
    <>
      {/* ✅ LANDING HEADER */}
      <LandingHeader />

      {/* Background visuals */}
      <VisualEnhancements />

      {/* ✅ Add top padding so content doesn't hide under fixed header */}
      <div className="relative min-h-screen flex flex-col items-center justify-center z-0 px-6 pt-32 pb-20 text-center">
        
        <div className="max-w-4xl mx-auto">
          {/* HERO */}
          <h1 className="text-5xl md:text-7xl font-dancing font-bold bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent mb-4">
            Gina Ballerina
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            Digital dance magic — instant downloads
          </p>

          <p className="text-md text-gray-500 max-w-2xl mx-auto mb-10">
            Beautifully designed activity bundles, journals, planners, and coloring books for kids and adults.
            Download, print, and let your creativity twirl.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-pink to-purple text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Explore the Store
            </Link>

            <Link
              href="#collections"
              className="px-8 py-3 rounded-full border-2 border-pink text-pink font-semibold hover:bg-pink/10 transition-all duration-300"
            >
              See Collections
            </Link>
          </div>

          {/* COLLECTIONS */}
          <div id="collections">
            <MovingCollections />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}