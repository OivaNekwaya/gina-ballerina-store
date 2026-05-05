"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";

/* =========================
   TYPES
========================= */

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  order_uuid: string;
  customer_email: string;
  customer_name: string | null;
  total_amount: number;
  currency: string;
  payment_status: string;
  fulfillment_status?: string;
  created_at: string;
  items: OrderItem[];
};

/* =========================
   HELPERS
========================= */

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  failed: "bg-red-100 text-red-600",
};

/* =========================
   PAGE
========================= */

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await adminFetch("/admin/orders");
      const data = await res.json();

      const parsed = data.map((order: any) => ({
        ...order,
        items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
      }));

      setOrders(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, payload: any) => {
    await adminFetch(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    fetchOrders();
  };

  const resendLinks = async (orderId: number) => {
    if (!confirm("Resend download links?")) return;
    await adminFetch(`/admin/orders/${orderId}/resend`, { method: "POST" });
    alert("Links resent");
  };

  /* =========================
     GROUP ORDERS
  ========================= */

  const grouped = {
    paid: orders.filter(o => o.payment_status === "paid"),
    pending: orders.filter(o => o.payment_status === "pending"),
    failed: orders.filter(o => o.payment_status === "failed"),
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Manage customer purchases</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm text-purple-600 hover:underline">
          ← Dashboard
        </Link>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow">
          No orders yet.
        </div>
      )}

      {/* GROUPED SECTIONS */}
      {Object.entries(grouped).map(([status, group]) => (
        group.length > 0 && (
          <div key={status} className="mb-10">

            {/* SECTION HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold capitalize">
                {status} Orders
              </h2>
              <span className="text-sm text-gray-500">
                {group.length} orders
              </span>
            </div>

            <div className="space-y-5">
              {group.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow border p-5">

                  {/* TOP ROW */}
                  <div className="flex flex-wrap justify-between items-start border-b pb-3 mb-3">
                    
                    <div>
                      <p className="text-xs text-gray-400">
                        #{order.order_uuid.slice(0, 8)}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {order.customer_name || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer_email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        ${order.total_amount.toFixed(2)}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.payment_status]}`}>
                        {order.payment_status}
                      </span>
                    </div>

                  </div>

                  {/* ITEMS */}
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">
                      Items
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items?.map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{item.title} × {item.quantity}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap justify-between items-center pt-3 border-t">

                    <div className="flex gap-3">
                      <select
                        value={order.payment_status}
                        onChange={e => updateStatus(order.id, { payment_status: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>

                      <select
                        value={order.fulfillment_status || "pending"}
                        onChange={e => updateStatus(order.id, { fulfillment_status: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      onClick={() => resendLinks(order.id)}
                      className="text-sm px-3 py-1 rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
                    >
                      Resend
                    </button>

                  </div>

                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}