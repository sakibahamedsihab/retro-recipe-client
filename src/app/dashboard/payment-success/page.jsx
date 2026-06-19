"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../lib/api";
import Loader from "../../../components/Loader";
import { useToast } from "../../providers";
import { CheckCircle2, ShoppingBag, ArrowRight, Award } from "lucide-react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type");
  const recipeId = searchParams.get("recipeId");

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    async function confirmPayment() {
      if (!sessionId) {
        showToast("Invalid checkout session", "error");
        router.push("/dashboard");
        return;
      }
      try {
        const response = await api.post("/payments/confirm", { sessionId });
        if (response.data.success) {
          setTransaction(response.data.payment);
          showToast("Payment verified successfully!", "success");
        } else {
          showToast("Payment verification failed", "error");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(error);
        showToast("Failed to verify payment", "error");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    confirmPayment();
  }, [sessionId]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6 bg-white dark:bg-zinc-950 px-6">
      <div className="relative inline-block mb-2 p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-none text-zinc-900 dark:text-zinc-50">
        <CheckCircle2 className="h-12 w-12 stroke-[1.5]" />
      </div>

      <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
        Payment Successful!
      </h1>

      {type === "premium" ? (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-6 space-y-4">
          <Award className="h-6 w-6 text-zinc-900 dark:text-zinc-50 mx-auto" />
          <h2 className="font-bold text-sm uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
            Welcome to Premium Club
          </h2>
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 leading-relaxed">
            Your account has been upgraded to Premium membership. You now have
            unlimited recipe uploads and a verified chef badge!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-6 space-y-4">
          <ShoppingBag className="h-6 w-6 text-zinc-900 dark:text-zinc-50 mx-auto" />
          <h2 className="font-bold text-sm uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
            Recipe Unlocked
          </h2>
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 leading-relaxed">
            You have successfully purchased this recipe. You now have lifetime
            access to the step-by-step cooking directions!
          </p>
        </div>
      )}

      {transaction && (
        <div className="text-left text-xs uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 p-5 rounded-none space-y-2 font-bold text-zinc-600 dark:text-zinc-400">
          <p>
            <span className="text-zinc-400 dark:text-zinc-500">
              Transaction ID:
            </span>{" "}
            <span className="font-mono lowercase tracking-normal">
              {transaction.transactionId}
            </span>
          </p>
          <p>
            <span className="text-zinc-400 dark:text-zinc-500">
              Amount Paid:
            </span>{" "}
            ${transaction.amount?.toFixed(2)} USD
          </p>
          <p>
            <span className="text-zinc-400 dark:text-zinc-500">Paid At:</span>{" "}
            <span className="tracking-normal font-semibold">
              {new Date(transaction.paidAt).toLocaleString()}
            </span>
          </p>
        </div>
      )}

      <div className="pt-4 flex flex-col gap-3">
        {type === "recipe" && recipeId ? (
          <Link
            href={`/recipes/${recipeId}`}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-none transition-colors border-0 text-center"
          >
            <span>Go to Unlocked Recipe</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-none transition-colors border-0 text-center"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
