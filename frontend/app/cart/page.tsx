"use client";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  const handleCheckout = async () => {
    if (!customerEmail) {
      alert("Please enter your email to receive download links");
      return;
    }
    if (items.length === 0) return;

    setCheckoutLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          customerEmail,
          customerName,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || "Checkout failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4 floating-icon">🛍️</div>
        <h2 className="text-3xl font-bold text-purple-700">Your cart is twirling empty</h2>
        <p className="text-gray-500 mt-2">Add some ballet magic to your day!</p>
        <Link href="/" className="btn-primary inline-block mt-6">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-8 flex items-center gap-2">
        <ShoppingBag className="text-pink-500" /> Your Cart
      </h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.productId} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex gap-4 shadow-sm border border-pink-100">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl">
                🎀
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-700">{item.title}</h3>
                <p className="text-pink-500 font-bold">${item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="text-gray-400 hover:text-pink-500"><Minus size={16} /></button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="text-gray-400 hover:text-pink-500"><Plus size={16} /></button>
                  <button onClick={() => removeItem(item.productId)} className="ml-4 text-red-300 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-gray-400 underline">Clear cart</button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-pink-100 h-fit">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Order Summary</h2>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span className="text-pink-500">${totalPrice.toFixed(2)}</span></div>
          </div>
          <div className="mt-6 space-y-3">
            <input
              type="email"
              placeholder="Your email *"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="text"
              placeholder="Your name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || items.length === 0}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {checkoutLoading ? '✨ Processing...' : 'Proceed to Checkout →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}