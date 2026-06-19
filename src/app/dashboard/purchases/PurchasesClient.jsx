"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUnlockAlt,
  FaReceipt,
  FaSpinner,
  FaClock,
  FaUtensils,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function PurchasesClient() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/purchased-recipes`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setPurchases(data);
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const totalSpent = purchases.reduce((sum, item) => sum + (item.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-xl font-black uppercase p-8">
        <FaSpinner className="animate-spin" /> Loading purchased recipes...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-6 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-[#FFC900] text-black"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8 border-b-4 border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex items-center gap-4">
          <FaUnlockAlt className="text-3xl text-black" />
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
              My Purchases
            </h1>
            <p className="font-medium text-lg text-black mt-1">
              Premium recipes you have unlocked.
            </p>
          </div>
        </div>
        {purchases.length > 0 && (
          <div className="bg-[#FFC900] border-4 border-black px-5 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <FaReceipt className="text-xl" />
            Total Spent: ${totalSpent.toFixed(2)}
          </div>
        )}
      </div>

      {/* Purchases Grid */}
      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchases.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#FFC900] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black">
                    {item.category || "Recipe"}
                  </span>
                  <span className="text-black font-bold text-xs bg-[#FFF9E6] px-2 py-1 border border-black">
                    {item.paidAt
                      ? new Date(item.paidAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase text-black mb-2 line-clamp-1">
                  {item.recipeName}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm font-bold text-black mb-4">
                  <span className="flex items-center gap-1">
                    <FaUtensils className="text-[#FFC900]" /> {item.authorName}
                  </span>
                  {item.preparationTime && (
                    <span className="flex items-center gap-1">
                      <FaClock /> {item.preparationTime} min
                    </span>
                  )}
                </div>
                <p className="font-black text-black text-lg">
                  Paid: ${(item.amount || 0).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Link
                  href={`/recipes/${item.recipeId}`}
                  className="flex-1 bg-black text-white font-black uppercase py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,201,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <FaExternalLinkAlt /> View Recipe
                </Link>
                <button
                  onClick={() => showToast("PDF download coming soon!", "success")}
                  className="flex-1 bg-white text-black font-black uppercase py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFC900] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  PDF
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FFF9E6] border-4 border-black border-dashed p-16 text-center">
          <FaUnlockAlt className="text-6xl mx-auto mb-4 text-black opacity-30" />
          <p className="font-bold text-xl uppercase text-black mb-6">
            You haven&apos;t unlocked any premium recipes yet!
          </p>
          <Link
            href="/recipes"
            className="font-black uppercase bg-black text-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] hover:-translate-y-1 transition-all inline-block"
          >
            Browse Recipes →
          </Link>
        </div>
      )}
    </div>
  );
}
