"use client";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  const handleCheckout = async () => {
    if (!customerEmail) {
      alert("Please enter your email address");
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
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-purple">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Add some dance magic to your life!</p>
        <Link href="/" className="btn-primary inline-block mt-6">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.productId} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-pink/20 to-purple/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💃</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple">{item.title}</h3>
                <p className="text-pink font-bold">N${item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="text-darkgrey hover:text-pink"><Minus size={16} /></button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="text-darkgrey hover:text-pink"><Plus size={16} /></button>
                  <button onClick={() => removeItem(item.productId)} className="ml-4 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-darkgrey underline">Clear cart</button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between border-b pb-2 mb-2">
            <span>Subtotal</span>
            <span>N${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span className="text-pink">N${totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-6 space-y-3">
            <input
              type="email"
              placeholder="Your email address *"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border border-grey rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink"
              required
            />
            <input
              type="text"
              placeholder="Your name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-grey rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink"
            />
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || items.length === 0}
              className="btn-primary w-full disabled:opacity-50"
            >
              {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}