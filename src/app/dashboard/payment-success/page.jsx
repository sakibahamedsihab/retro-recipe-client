"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type");
  const recipeId = searchParams.get("recipeId");

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("No session ID found in the URL.");
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/confirm`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ sessionId }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          setPaymentInfo(data.payment);
          setStatus("success");
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus("error");
          setErrorMessage(data.message || "Failed to confirm payment.");
        }
      } catch (error) {
        console.error("Payment confirmation error:", error);
        setStatus("error");
        setErrorMessage("Something went wrong connecting to server.");
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (status === "verifying") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-8 border-t-8 border-gray-200 border-t-black rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black uppercase text-black">Verifying Payment...</h2>
        <p className="font-medium text-black mt-2">Please do not refresh this page.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-100 border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-3xl font-black uppercase text-black mb-2">Verification Failed</h2>
          <p className="font-medium text-black mb-6">{errorMessage}</p>
          <Link
            href="/dashboard"
            className="inline-block bg-black text-white font-black uppercase px-6 py-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-[#FFF9E6] border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-3xl font-black uppercase text-black mb-2">Payment Successful!</h2>
        <p className="font-medium text-lg text-black mb-6">
          {type === "premium"
            ? "Your premium membership is now active! Enjoy unlimited uploads."
            : "Recipe has been successfully unlocked and added to your purchases."}
        </p>

        {paymentInfo && (
          <div className="bg-white border-2 border-black p-4 text-left font-medium space-y-2 mb-8 text-sm">
            <p className="border-b border-gray-300 pb-1">
              <span className="font-bold">Transaction ID:</span> {paymentInfo.transactionId}
            </p>
            <p className="border-b border-gray-300 pb-1">
              <span className="font-bold">Amount Paid:</span> ${paymentInfo.amount?.toFixed(2)}
            </p>
            <p>
              <span className="font-bold">Date:</span> {new Date(paymentInfo.paidAt).toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link
            href={type === "premium" ? "/dashboard" : `/recipes/${recipeId}`}
            className="flex items-center gap-2 bg-[#FFC900] text-black font-black uppercase px-6 py-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm"
          >
            {type === "premium" ? "Go to Dashboard" : "View Recipe"} <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black uppercase text-black animate-pulse">Loading payment details...</h2>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
