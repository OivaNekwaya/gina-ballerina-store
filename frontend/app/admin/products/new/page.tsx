"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    price: "",
    category: "kids",
    download_limit: "3",
    is_bundle: "false",
    tags: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("file", file);
    if (imageFile) data.append("image", imageFile);
    try {
      await adminFetch("/admin/products", { method: "POST", body: data });
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <Link href="/admin/dashboard" className="text-pink text-sm hover:underline">← Back</Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug (URL identifier) *</label>
          <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" required />
          <p className="text-xs text-gray-400">e.g., my-magazine (no spaces)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Price (USD) *</label>
            <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" required />
          </div>
          <div>
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="kids">Kids</option>
              <option value="adult">Adult</option>
              <option value="printable">Printable</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Download limit</label>
            <input type="number" value={form.download_limit} onChange={e => setForm({ ...form, download_limit: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label>Is Bundle?</label>
            <select value={form.is_bundle} onChange={e => setForm({ ...form, is_bundle: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
        <div>
          <label>Tags (comma separated)</label>
          <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div>
          <label>Product File (PDF/ZIP) *</label>
          <input type="file" accept=".pdf,.zip" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-1 w-full" required />
        </div>
        <div>
          <label>Product Image (JPG, PNG) *</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="mt-1 w-full" required />
          <p className="text-xs text-gray-400">Upload a product image (will be displayed on the storefront)</p>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-pink hover:bg-pink-700 text-white font-semibold py-2 rounded-md transition">
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}