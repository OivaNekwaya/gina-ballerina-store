"use client";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

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

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      slug: product.slug,
      image_url: product.image_url,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100">
      {/* Image / placeholder area – smaller height */}
      <div className="relative h-48 bg-gradient-to-br from-pink/5 to-purple/5 flex items-center justify-center rounded-t-xl overflow-hidden group">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition duration-500"
          />
        ) : (
          <span className="text-5xl">🩰</span>
        )}
        {/* Category badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium text-pink shadow-sm">
          {product.category === "kids"
            ? "👧 Kids"
            : product.category === "adult"
            ? "🧘 Adult"
            : "📅 Printable"}
        </div>
      </div>

      {/* Content – less padding */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-base line-clamp-1">{product.title}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-pink">${product.price}</span>
          <button
            onClick={handleAdd}
            className="bg-pink hover:bg-purple text-white text-xs font-medium px-3 py-1.5 rounded-full transition shadow-sm"
            disabled={isAdding}
          >
            {isAdding ? "✨ Added!" : "Add to Cart"}
          </button>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="text-center text-xs text-gray-400 hover:text-pink mt-2 transition"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}