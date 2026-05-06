"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const orderUuid = searchParams.get("order");
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    if (!orderUuid) return;
    setLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/verify-payment/verify?order=${orderUuid}&mock=true`;
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-purple mb-4">Test Payment (Mock)</h1>
      <p className="text-gray-600 mb-4">Simulated payment for development.</p>
      <div className="border rounded p-4 mb-4">
        <div className="mb-2"><label className="block text-sm font-medium">Card Number</label><input type="text" placeholder="4242 4242 4242 4242" className="w-full border rounded px-3 py-2 mt-1" disabled /></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="block text-sm font-medium">Expiry</label><input type="text" placeholder="12/24" className="w-full border rounded px-3 py-2 mt-1" disabled /></div><div><label className="block text-sm font-medium">CVV</label><input type="text" placeholder="123" className="w-full border rounded px-3 py-2 mt-1" disabled /></div></div>
      </div>
      <button onClick={handlePay} disabled={loading} className="w-full bg-pink hover:bg-purple text-white font-semibold py-2 rounded-lg">{loading ? "Processing..." : "Pay Now (Mock)"}</button>
      <p className="text-xs text-gray-400 mt-4 text-center">Mock payment – no real charge</p>
    </div>
  );
}