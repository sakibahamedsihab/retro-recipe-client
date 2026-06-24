"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../../lib/auth-client";
import api from "../../../lib/api";
import Loader from "../../../components/Loader";
import { useToast } from "../../providers";
import { ShieldCheck, Award, Sparkles, Check, ChevronRight } from "lucide-react";

export default function UpgradePlansPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await api.get("/users/me");
        setDbUser(response.data);
      } catch (error) {
        console.error(error);
        showToast("Failed to load user details", "error");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleSelectPlan = async (planName) => {
    setCheckoutLoading(planName);
    try {
      const response = await api.post("/payments/create-checkout-session", {
        type: "premium",
        plan: planName,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        showToast("Failed to initiate payment session", "error");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Checkout session failed";
      showToast(errMsg, "error");
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) return <Loader />;

  const isPremium = dbUser?.isPremium;
  const currentPlan = dbUser?.premiumType || (isPremium ? "gold" : null); // Fallback to gold if isPremium but premiumType is not set
  const currentLimit = dbUser?.recipeLimit || (isPremium ? 9999 : 2);

  const plans = [
    {
      id: "bronze",
      name: "Bronze Plan",
      price: "$4.99",
      limit: 5,
      limitText: "Up to 5 recipe uploads",
      color: "bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      badgeColor: "bg-amber-500 text-white",
      features: [
        "Upload up to 5 recipes",
        "Bronze verified profile badge",
        "Standard community recipe access",
        "Lifetime membership",
      ],
      description: "Great for hobbyists who want a few extra recipes.",
    },
    {
      id: "silver",
      name: "Silver Plan",
      price: "$14.99",
      limit: 15,
      limitText: "Up to 15 recipe uploads",
      color: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-800",
      badgeColor: "bg-slate-500 text-white",
      features: [
        "Upload up to 15 recipes",
        "Silver verified profile badge",
        "Standard community recipe access",
        "Premium support channels",
        "Lifetime membership",
      ],
      description: "Our most popular tier for active food lovers.",
      popular: true,
    },
    {
      id: "gold",
      name: "Gold Plan",
      price: "$29.99",
      limit: 9999,
      limitText: "Unlimited recipe uploads",
      color: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800",
      badgeColor: "bg-yellow-500 text-black",
      features: [
        "Unlimited recipe uploads",
        "Gold verified profile badge",
        "Standard community recipe access",
        "Priority premium support",
        "Featured recipe placement badge",
        "Lifetime membership",
      ],
      description: "The ultimate package for professional chefs.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 bg-white dark:bg-zinc-950 p-6 font-sans">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-none">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Membership Upgrades</span>
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Choose Your Premium Plan
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 max-w-xl mx-auto leading-relaxed">
          Unlock recipe posting limits and show off your verified culinary badge. Support our community with a simple one-time payment.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isDowngradeOrCurrent = isPremium && currentLimit >= plan.limit;
          
          return (
            <div
              key={plan.id}
              className={`bg-white dark:bg-zinc-950 border-2 ${
                plan.popular ? "border-zinc-900 dark:border-zinc-50" : "border-zinc-200 dark:border-zinc-900"
              } rounded-none p-6 flex flex-col relative transition-all`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 text-[10px] font-black uppercase tracking-widest border border-black dark:border-white">
                  Most Popular
                </span>
              )}

              {/* Title & Badge */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900 dark:text-zinc-50">
                    {plan.name}
                  </h3>
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-none ${plan.color} border`}>
                    {plan.id}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal">
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {plan.price}
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
                  / lifetime
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {isCurrent ? (
                <div className="w-full py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-black uppercase tracking-widest text-center">
                  Your Current Plan
                </div>
              ) : isDowngradeOrCurrent ? (
                <div className="w-full py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-900 text-zinc-400 text-xs font-bold uppercase tracking-widest text-center cursor-not-allowed">
                  Higher Plan Active
                </div>
              ) : (
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={checkoutLoading !== null}
                  className={`w-full py-3 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 rounded-none ${
                    plan.popular
                      ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800"
                  } disabled:opacity-50`}
                >
                  {checkoutLoading === plan.id ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-none animate-spin" />
                  ) : (
                    <>
                      <span>Choose {plan.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Secure footer info */}
      <div className="border-t border-zinc-200 dark:border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-zinc-400" />
          <span>Secure payments powered by Stripe</span>
        </div>
        <div>
          <span>Need help? Contact support@recipehub.com</span>
        </div>
      </div>
    </div>
  );
}
