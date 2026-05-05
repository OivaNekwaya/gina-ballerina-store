"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag } from "lucide-react";

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
  file_key: string;
  download_limit: number;
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        // Parse tags if it's a JSON string
        if (data.tags && typeof data.tags === 'string') {
          try {
            data.tags = JSON.parse(data.tags);
          } catch (e) {
            data.tags = [];
          }
        } else if (!data.tags) {
          data.tags = [];
        }
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink border-b-2 border-purple"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🩰</div>
        <h1 className="text-2xl font-bold text-purple">Product not found</h1>
        <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
        <Link href="/" className="btn-primary inline-block mt-6">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-pink hover:text-purple mb-6 transition"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8 border border-pink/20">
        {/* Left column: image/icon */}
        <div className="flex items-center justify-center bg-gradient-to-br from-pink/10 to-purple/10 rounded-xl p-8 min-h-[300px]">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.title}
              className="max-w-full max-h-80 object-contain rounded-lg"
            />
          ) : (
            <div className="text-center text-7xl floating-icon">🩰</div>
          )}
        </div>

        {/* Right column: details */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-purple">{product.title}</h1>
            <span className="text-2xl font-bold text-pink">${product.price}</span>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-pink/10 text-pink px-2 py-1 rounded-full">
              {product.category === "kids" ? "👧 Kids" : product.category === "adult" ? "🧘 Adult" : "📅 Printable"}
            </span>
            {product.tags && product.tags.length > 0 && product.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          <div className="border-t border-pink/20 my-6 pt-4">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>📥</span> Instant digital download – you'll receive a secure link after purchase
            </p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <span>🔒</span> Link expires in 24 hours, up to {product.download_limit} downloads
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`btn-primary w-full flex justify-center items-center gap-2 ${isAdding ? 'sparkle' : ''}`}
            disabled={isAdding}
          >
            <ShoppingBag size={18} />
            {isAdding ? "✨ Added!" : "Add to Cart"}
          </button>
          <Link href="/cart" className="block text-center text-sm text-purple/70 hover:text-purple underline mt-4">
            View Cart →
          </Link>
        </div>
      </div>
    </div>
  );
}