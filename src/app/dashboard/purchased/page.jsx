"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import Loader from "../../../components/Loader";
import { useToast } from "../../providers";
import { CreditCard, Eye, Calendar } from "lucide-react";

export default function PurchasedRecipesPage() {
  const { showToast } = useToast();

  const [purchased, setPurchased] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchased() {
      try {
        const response = await api.get("/payments/purchased");
        setPurchased(response.data);
      } catch (error) {
        console.error(error);
        showToast("Failed to load purchased recipes", "error");
      } finally {
        setLoading(false);
      }
    }
    loadPurchased();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Purchased Recipes
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
          Recipes you have unlocked via Stripe transactions.
        </p>
      </div>

      {purchased.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-none">
          <CreditCard className="h-10 w-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-4 stroke-[1.5]" />
          <p className="text-xs uppercase tracking-widest font-black text-zinc-400 dark:text-zinc-500 mb-4">
            You haven't purchased any recipes yet.
          </p>
          <Link
            href="/browse"
            className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:underline dark:text-zinc-50"
          >
            Explore paywalled recipes &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchased.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 overflow-hidden flex flex-col h-full rounded-none group hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors duration-200"
            >
              <div className="relative h-44 bg-zinc-55 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900">
                <img
                  src={
                    item.recipe?.recipeImage ||
                    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500"
                  }
                  alt={item.recipe?.recipeName}
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute top-0 left-0 px-2.5 py-1 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-none">
                  Paid
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 uppercase tracking-wide line-clamp-1 mb-1">
                  {item.recipe?.recipeName}
                </h3>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-555 mb-4">
                  By {item.recipe?.authorName}
                </p>

                <div className="flex flex-col gap-2 text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400 mb-4 border-t border-zinc-200 dark:border-zinc-900 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span>
                      Unlocked:{" "}
                      <span className="tracking-normal font-semibold text-zinc-700 dark:text-zinc-300">
                        {new Date(item.paidAt).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                    <span>
                      ID:{" "}
                      <span className="font-mono lowercase tracking-normal text-zinc-700 dark:text-zinc-300">
                        {item.transactionId?.substring(0, 15)}...
                      </span>
                    </span>
                  </div>
                </div>

                <Link
                  href={`/recipes/${item.recipeId}`}
                  className="mt-auto w-full py-2.5 bg-zinc-50 hover:bg-zinc-900 hover:text-white dark:bg-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 font-bold text-xs uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-transparent dark:hover:border-transparent transition-colors flex items-center justify-center gap-1.5 text-zinc-800 dark:text-zinc-200 rounded-none border-0 text-center"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Full Recipe</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
