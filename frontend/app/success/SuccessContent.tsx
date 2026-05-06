"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle } from "lucide-react";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-pink-100">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
        <h1 className="girly-heading text-4xl mb-2">Thank you, dancer!</h1>
        <p className="text-gray-600">Your order is confirmed. 💖</p>
        <p className="text-gray-500 text-sm mt-1">Check your email for instant download links.</p>
        <div className="mt-6 space-y-3">
          <Link href="/" className="btn-primary inline-block">Continue Dancing</Link>
          <Link href="/lookup" className="block text-sm text-purple-500 underline">Order lookup (re‑download)</Link>
        </div>
        <p className="mt-6 text-xs text-gray-400">✨ You'll receive a separate email within minutes. Check spam folder if needed.</p>
      </div>
    </div>
  );
}