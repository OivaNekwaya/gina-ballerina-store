"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DownloadPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<"loading" | "error" | "redirect">("loading");

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/download/${token}`, { redirect: "manual" })
      .then((res) => {
        if (res.status === 302) {
          const location = res.headers.get("location");
          if (location) window.location.href = location;
          setStatus("redirect");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink mx-auto"></div>
        <p className="mt-4 text-darkgrey">Preparing your download...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold text-red-500">Invalid or Expired Link</h2>
        <p className="text-gray-600 mt-2">Your download link may have expired or been used too many times.</p>
        <Link href="/lookup" className="btn-primary inline-block mt-6">Order Lookup</Link>
      </div>
    );
  }

  return null; // redirecting
}