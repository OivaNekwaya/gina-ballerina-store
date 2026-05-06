"use client";
import Link from "next/link";
import LandingHeader from "@/components/LandingHeader";

const collections = [
  { title: "Kids Collection", icon: "🧸", desc: "Coloring, puzzles, and fun dance activities" },
  { title: "Adult Collection", icon: "🧘", desc: "Relaxing journals and mandala art" },
  { title: "Planners", icon: "📅", desc: "Organise your life beautifully" },
  { title: "Dance Packs", icon: "💃", desc: "Creative dance bundles" },
  { title: "Mindfulness", icon: "🌿", desc: "Calm and focus printable kits" },
];

function MovingCollections() {
  return (
    <div className="relative mt-8 sm:mt-12 md:mt-20 w-full overflow-hidden">
      {/* Fade edges – smaller on mobile */}
      <div className="absolute left-0 top-0 h-full w-8 sm:w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-8 sm:w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />
      
      <div className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll">
        {[...collections, ...collections].map((item, i) => (
          <div
            key={i}
            className="min-w-[180px] sm:min-w-[220px] md:min-w-[260px] bg-white/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg border border-white/30 hover:scale-105 transition-all duration-500 cursor-pointer"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2">{item.icon}</div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple">{item.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      
      {/* BACKGROUND IMAGE – fixed layer behind content */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/6.jpg')" }}
      />
      {/* Optional overlay for better text readability */}
      <div className="fixed inset-0 -z-10 bg-white/30 backdrop-blur-[1px]" />

      <div className="relative min-h-screen flex flex-col items-center justify-center z-0 px-4 sm:px-6 pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-dancing font-bold bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent mb-2 sm:mb-4">
            Gina Ballerina
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-grey-600 mb-3 sm:mb-4 md:mb-6">
            Digital dance magic — instant downloads
          </p>
          <p className="text-sm sm:text-base text-grey-500 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-2">
            Beautifully designed activity bundles, journals, planners, and coloring books for kids and adults.
            Download, print, and let your creativity twirl.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/shop"
              className="px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full bg-gradient-to-r from-pink to-purple text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              Explore the Store
            </Link>
            <Link
              href="#collections"
              className="px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full border-2 border-pink text-pink font-semibold hover:bg-pink/10 transition-all duration-300 text-sm sm:text-base"
            >
              See Collections
            </Link>
          </div>
          <div id="collections">
            <MovingCollections />
          </div>
        </div>
        {/* Scroll hint – hide on very small screens */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
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