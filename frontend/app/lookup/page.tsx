"use client";
import { useState } from "react";

export default function LookupPage() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, orderUuid: orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      setDownloads(data.downloads);
    } catch (err: any) {
      setError(err.message);
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-pink-100">
        <h1 className="girly-heading text-4xl text-center mb-2">Find Your Downloads</h1>
        <p className="text-center text-gray-500 mb-8">Enter your email and order ID to retrieve files.</p>

        <form onSubmit={handleLookup} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-pink-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="text"
            placeholder="Order ID (e.g., 123e4567-e89b...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-pink-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Searching..." : "Retrieve Downloads"}
          </button>
        </form>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        {downloads.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-purple-700 mb-3">Your active downloads</h2>
            <ul className="space-y-3">
              {downloads.map((d, idx) => (
                <li key={idx} className="border-b border-pink-100 pb-2">
                  <a href={`${process.env.NEXT_PUBLIC_API_URL}/download/${d.token}`} className="text-pink-500 hover:underline flex items-center gap-2">
                    <span>🩰</span> {d.product_title}
                  </a>
                  <span className="text-xs text-gray-400">({d.remaining_downloads} downloads left, expires {new Date(d.expires_at).toLocaleString()})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}