"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  image_url: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const kidsProducts = products.filter(p => p.category === "kids");
  const adultProducts = products.filter(p => p.category === "adult");
  const printableProducts = products.filter(p => p.category === "printable");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-pink border-b-2 border-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Unable to load products. Please try again later.</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Fixed background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.png')" }}
      />
      {/* Optional overlay for better readability */}
      <div className="fixed inset-0 -z-10 bg-white/30 backdrop-blur-[2px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {kidsProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-purple mb-4">👧 Kids Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {kidsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {adultProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-purple mb-4">🧘 Adult Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {adultProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {printableProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-purple mb-4">📅 Printables & Planners</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {printableProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}