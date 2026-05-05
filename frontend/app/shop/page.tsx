"use client";
import { useEffect, useState } from "react";
import Link from "next/link";          // 👈 Add this line
import ProductCard from "@/components/ProductCard";
import ShopVisualEnhancements from "@/components/ShopVisualEnhancements";  // instead of VisualEnhancements

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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = {
    kids: products.filter((p) => p.category === "kids"),
    adult: products.filter((p) => p.category === "adult"),
    printable: products.filter((p) => p.category === "printable"),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-pink border-b-2 border-purple"></div>
      </div>
    );
  }

  return (
    <>
      <ShopVisualEnhancements /> 
      <div className="relative bg-gradient-to-b from-pink/5 to-white/0 z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header with back to landing link */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Link href="/" className="text-sm text-pink hover:underline">&larr; Back to Landing</Link>
            <h1 className="text-4xl md:text-5xl font-dancing font-bold bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent mt-2">
              Gina Ballerina
            </h1>
            <p className="text-gray-500 text-sm mt-2">Digital dance magic – instant downloads</p>
            <div className="flex justify-center gap-1.5 mt-3">
              <span className="block w-2 h-2 rounded-full bg-pink"></span>
              <span className="block w-2 h-2 rounded-full bg-purple"></span>
              <span className="block w-2 h-2 rounded-full bg-gray-300"></span>
            </div>
          </div>

          {/* Kids Collection */}
          {categories.kids.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-purple">Kids Collection</h2>
                <span className="text-xs text-pink bg-pink/10 px-2 py-0.5 rounded-full">dance & play</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categories.kids.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Adult Collection */}
          {categories.adult.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-purple">Adult Collection</h2>
                <span className="text-xs text-pink bg-pink/10 px-2 py-0.5 rounded-full">relax & create</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categories.adult.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Printables & Planners Collection */}
          {categories.printable.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-purple">Printables & Planners</h2>
                <span className="text-xs text-pink bg-pink/10 px-2 py-0.5 rounded-full">organise with grace</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categories.printable.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          <div className="text-center text-xs text-gray-400 mt-12 border-t border-gray-100 pt-6">
            ✨ Instant digital downloads · Secure checkout · 24h access
          </div>
        </div>
      </div>
    </>
  );
}