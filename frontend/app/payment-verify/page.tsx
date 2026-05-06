"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionToken = searchParams.get("TransactionToken");
  const orderUuid = searchParams.get("order");

  useEffect(() => {
    if (transactionToken && orderUuid) {
      // Call backend verification endpoint, which will redirect after verification
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/verify-payment/verify?transactionToken=${transactionToken}&orderUuid=${orderUuid}`;
    } else {
      router.push("/cart");
    }
  }, [transactionToken, orderUuid, router]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink border-b-2 border-purple"></div>
      <p className="ml-3 text-gray-600">Verifying your payment...</p>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentVerifyContent />
    </Suspense>
  );
}