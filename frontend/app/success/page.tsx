import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

function LoadingFallback() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-pink-100">
        <div className="animate-pulse">Loading your order details...</div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}