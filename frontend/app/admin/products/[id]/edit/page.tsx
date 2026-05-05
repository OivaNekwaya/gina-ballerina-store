"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import {
  Tag,
  DollarSign,
  FolderOpen,
  Package,
  Image as ImageIcon,
  Save,
  ArrowLeft,
} from "lucide-react";

type ProductForm = {
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  download_limit: number;
  is_bundle: string;
  tags: string;
  image_url: string;
};

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<ProductForm | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await adminFetch(`/admin/products/${id}`);
        const data = await res.json();
        let tags = data.tags;
        if (Array.isArray(tags)) tags = tags.join(",");
        else if (typeof tags === "string" && tags.startsWith("[")) {
          try { tags = JSON.parse(tags).join(","); } catch { tags = ""; }
        } else if (!tags) tags = "";
        setForm({
          slug: data.slug,
          title: data.title,
          description: data.description || "",
          price: data.price,
          category: data.category,
          download_limit: data.download_limit,
          is_bundle: data.is_bundle ? "true" : "false",
          tags: tags,
          image_url: data.image_url || "",
        });
      } catch (err: any) {
        setError(err.message);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
    if (file) data.append("file", file);
    if (imageFile) data.append("image", imageFile);
    try {
      await adminFetch(`/admin/products/${id}`, { method: "PUT", body: data });
      router.push("/admin/dashboard");
    } catch (err: any) {
      alert("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  if (!form) return <div className="text-center py-20">Loading product...</div>;

  return (
    <div className="min-h-screen bg-pink-light py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-pink hover:text-purple transition"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        {/* White card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-pink/20">
          {/* Header – solid pink */}
          <div className="bg-pink px-6 py-4">
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              <Package size={18} /> Edit Product
            </h1>
            <p className="text-white/80 text-sm mt-0.5">Update product details, file or image</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Slug + Title */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink focus:border-pink"
                  required
                />
                <p className="text-xs text-gray-500 mt-0.5">Unique identifier (no spaces)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink"
              />
            </div>

            {/* Price + Category */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <DollarSign size={14} /> Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="kids">Kids</option>
                  <option value="adult">Adult</option>
                  <option value="printable">Printable</option>
                </select>
              </div>
            </div>

            {/* Download limit + Bundle */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Download limit</label>
                <input
                  type="number"
                  value={form.download_limit}
                  onChange={(e) => setForm({ ...form, download_limit: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Bundle</label>
                <select
                  value={form.is_bundle}
                  onChange={(e) => setForm({ ...form, is_bundle: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Tag size={14} /> Tags
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g., pink, purple, dance"
              />
            </div>

            {/* Product file */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FolderOpen size={14} /> Product File (ZIP/PDF)
              </label>
              <input
                type="file"
                accept=".pdf,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-pink/10 file:text-pink hover:file:bg-pink/20"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current file</p>
            </div>

            {/* Product image */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <ImageIcon size={14} /> Product Image
              </label>
              {form.image_url && (
                <div className="mt-1">
                  <img
                    src={form.image_url}
                    alt="Current product image"
                    className="h-20 w-auto rounded border object-cover"
                  />
                  <p className="text-xs text-gray-500 mt-0.5">Current image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple/10 file:text-purple hover:file:bg-purple/20"
              />
            </div>

            {/* Pink button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink hover:bg-purple text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
              >
                <Save size={18} />
                {loading ? "Updating..." : "UPDATE PRODUCT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}