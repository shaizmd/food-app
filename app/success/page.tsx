"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { useStore } from "@/store/store";

export default function SuccessPage() {
  const router = useRouter();
  const clearCart = useStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"> 
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Success Icon with Animation */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-green-200 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for your order. Your payment has been received and your order is now being processed.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/orders")}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center group cursor-pointer"
          >
            View My Orders
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}