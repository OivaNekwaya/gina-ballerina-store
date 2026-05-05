"use client";

/* =========================
   GIRLY BACKGROUND DECOR (pink + gray theme)
========================= */
const GirlyDecor = () => {
  return (
    <div
      suppressHydrationWarning
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      <div className="absolute w-96 h-96 bg-pink-400/20 blur-3xl rounded-full top-10 left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-gray-400/10 blur-3xl rounded-full bottom-10 right-10 animate-pulse" />
      <div className="absolute w-80 h-80 bg-pink-300/15 blur-3xl rounded-full top-1/2 left-1/3 animate-pulse delay-300" />

      <div className="absolute top-20 right-20 text-pink-400 animate-ping">✨</div>
      <div className="absolute bottom-32 left-32 text-gray-400 animate-ping delay-500">✨</div>
      <div className="absolute top-40 left-1/4 text-pink-300 animate-ping delay-700">✨</div>

      <div className="absolute top-1/3 left-10 text-pink-300 text-2xl animate-bounce">💖</div>
      <div className="absolute bottom-20 right-16 text-gray-300 text-2xl animate-bounce delay-700">💗</div>
      <div className="absolute top-2/3 right-1/4 text-pink-400 text-xl animate-bounce delay-300">🌸</div>
      <div className="absolute bottom-1/3 left-1/5 text-gray-300 text-xl animate-bounce delay-500">🎀</div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div
      suppressHydrationWarning
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-gray-100 to-pink-100"
    >
      <GirlyDecor />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* HERO - Pink heading like top-left brand */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-dancing font-bold text-pink-600 mb-4 drop-shadow-md">
            About Gina Ballerina
          </h1>
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-2xl">✨</span>
            <div className="w-24 h-0.5 bg-pink-400 rounded-full"></div>
            <span className="text-2xl">🩰</span>
            <div className="w-24 h-0.5 bg-pink-400 rounded-full"></div>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-xl text-gray-700 max-w-xl mx-auto font-medium bg-gray-200/60 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
            A dreamy little world of creativity, sparkle, and graceful inspiration ✨
          </p>
        </div>

        {/* FEATURE BUBBLES */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: "🩰", title: "Dance Inspired", text: "Every design moves with grace." },
            { icon: "🎀", title: "Cute & Creative", text: "Soft, playful, and full of charm." },
            { icon: "✨", title: "Magical Feel", text: "Designed to spark joy instantly." },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-200/80 backdrop-blur-lg rounded-full p-8 shadow-lg border border-pink-300 text-center hover:scale-105 transition duration-300"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-pink-600 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>

        {/* STORY */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div className="bg-gray-200/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-pink-300">
            <h2 className="text-2xl font-semibold text-pink-600 mb-4">Our Story 💕</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Gina Ballerina started as a tiny dream — a love for dance, creativity,
              and all things soft and beautiful. It began with a few printable designs
              for a little ballerina… and grew into something magical.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, it’s a whole world of journals, planners, and activity kits designed
              to make life feel lighter, prettier, and more joyful.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300/30 to-gray-300/30 rounded-3xl blur-2xl" />
            <div className="relative bg-gray-200/80 rounded-3xl p-10 shadow-xl text-center">
              <div className="text-7xl">🩰</div>
              <p className="mt-4 text-pink-500 text-sm font-medium">Grace • Beauty • Creativity</p>
            </div>
          </div>
        </div>

        {/* PROMISE CARDS */}
        <div className="mb-20">
          <h2 className="text-3xl text-center font-semibold text-pink-700 mb-10">Our Promise 💖</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "⚡", title: "Instant Downloads", text: "Get your files immediately." },
              { icon: "🔒", title: "Safe Checkout", text: "Your payments are protected." },
              { icon: "🎨", title: "Unique Designs", text: "Made with love and creativity." },
              { icon: "📂", title: "Forever Access", text: "Download anytime you need." },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-gray-200/80 backdrop-blur-md rounded-2xl p-5 shadow border border-pink-300 hover:shadow-lg transition"
              >
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h4 className="font-semibold text-pink-600">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUOTE */}
        <div className="text-center mb-12">
          <p className="text-lg text-gray-700 italic max-w-xl mx-auto font-medium bg-gray-200/60 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
            “A little sparkle, a little creativity… and a whole lot of joy.”
          </p>
        </div>

        {/* SIGNATURE */}
        <div className="text-center">
          <p className="font-dancing text-3xl text-pink-500">Keep dancing,</p>
          <p className="font-dancing text-2xl text-gray-500">~ Gina 💕</p>
        </div>
      </div>
    </div>
  );
}