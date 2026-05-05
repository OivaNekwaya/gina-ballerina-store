"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
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
  download_limit: number;
};

export default function AdminPreviewProduct() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const res = await adminFetch(`/products/${slug}`);
        const data = await res.json();
        // Parse tags if needed
        if (data.tags && typeof data.tags === "string") {
          try { data.tags = JSON.parse(data.tags); } catch { data.tags = []; }
        } else if (!data.tags) data.tags = [];
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading product...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-500">{error || "Not found"}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-pink hover:text-purple mb-6 transition"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="grid md:grid-cols-2 gap-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8 border border-pink/20">
        <div className="flex items-center justify-center bg-gradient-to-br from-pink/10 to-purple/10 rounded-xl p-8 min-h-[300px]">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.title} className="max-w-full max-h-80 object-contain rounded-lg" />
          ) : (
            <div className="text-center text-7xl floating-icon">🩰</div>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-purple">{product.title}</h1>
            <span className="text-2xl font-bold text-pink">${product.price}</span>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-pink/10 text-pink px-2 py-1 rounded-full">
              {product.category === "kids" ? "👧 Kids" : product.category === "adult" ? "🧘 Adult" : "📅 Printable"}
            </span>
            {product.tags?.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          <div className="border-t border-pink/20 my-6 pt-4">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              📥 Instant digital download – after purchase, you receive a secure link.
            </p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              🔒 Link expires in 24 hours, up to {product.download_limit} downloads.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href={`/product/${product.slug}`}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              <ShoppingBag size={18} />
              View on Storefront (as customer)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}