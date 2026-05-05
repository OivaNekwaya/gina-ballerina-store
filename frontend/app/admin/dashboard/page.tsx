"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { Edit, Trash2, Eye, Package, Layers, Activity } from "lucide-react";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  slug: string;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await adminFetch("/admin/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product? This action cannot be undone.")) return;
    await adminFetch(`/admin/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple border-b-2 border-pink"></div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.category)).size;

  return (
    <div className="relative min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="absolute inset-0 opacity-5 pointer-events-none 
        bg-[radial-gradient(circle,#000_1px,transparent_1px)] 
        bg-[size:20px_20px]" />

      <div className="relative z-10 sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your digital products and monitor system activity.</p>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-md border border-pink bg-white px-4 py-2 text-sm font-medium text-pink shadow-sm hover:bg-pink/10 transition"
          >
            <Activity className="h-4 w-4" />
            Orders
          </Link>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-md bg-pink px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink/80 transition"
          >
            <Package className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow border flex items-center gap-4">
          <Package className="text-purple" />
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <h2 className="text-2xl font-bold">{totalProducts}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow border flex items-center gap-4">
          <Layers className="text-pink" />
          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <h2 className="text-2xl font-bold">{totalCategories}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow border flex items-center gap-4">
          <Activity className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">System Status</p>
            <h2 className="text-green-500 font-bold">Active</h2>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="relative z-10 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Title</th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Price (USD)</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900">Category</th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-pink/10 transition duration-200">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.title}</td>
                <td className="py-4 px-4 text-right text-sm text-gray-600">${product.price.toFixed(2)}</td>
                <td className="py-4 px-4 text-center text-sm text-gray-500 capitalize">{product.category}</td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-purple hover:text-purple/80 transition" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-700 transition" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link href={`/admin/preview/${product.slug}`} className="text-gray-400 hover:text-gray-600 transition" title="Preview">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}