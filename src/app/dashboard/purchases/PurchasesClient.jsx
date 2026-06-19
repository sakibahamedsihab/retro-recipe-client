"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaFileDownload, FaUnlockAlt, FaReceipt } from "react-icons/fa";

export default function PurchasesClient() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/purchased-recipes`,
          {
            credentials: "include",
          }
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
      <div className="text-xl font-black uppercase animate-pulse p-8">
        Loading purchased recipes...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="mb-8 border-b-4 border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            My Purchases
          </h1>
          <p className="font-medium text-lg text-black mt-2">
            Premium recipes you've unlocked.
          </p>
        </div>
        <div className="bg-[#FFF9E6] border-2 border-black px-4 py-2 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <FaReceipt className="text-xl" /> Total Spent: ${totalSpent.toFixed(2)}
        </div>
      </div>

      {/* Purchases Grid */}
      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchases.map((item) => (
            <div
              key={item._id}
              className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#FFC900] text-black text-xs font-black uppercase px-2 py-1 border-2 border-black">
                    {item.category}
                  </span>
                  <span className="text-black font-bold text-sm">
                    Purchased on: {item.paidAt ? new Date(item.paidAt).toLocaleDateString() : ""}
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase text-black mb-2 line-clamp-1">
                  {item.recipeName}
                </h3>
                <p className="font-medium text-black mb-6">
                  By {item.authorName} • {item.cuisineType}
                </p>
              </div>

              <div className="flex gap-3 mt-auto">
                <Link
                  href={`/recipes/${item.recipeId}`}
                  className="flex-1 bg-black text-white font-black uppercase py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <FaUnlockAlt /> View Full
                </Link>
                <button 
                  onClick={() => alert("PDF download feature coming soon!")}
                  className="flex-1 bg-white text-black font-black uppercase py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFC900] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <FaFileDownload /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Fallback */
        <div className="bg-[#FFF9E6] border-4 border-black border-dashed p-12 text-center">
          <FaUnlockAlt className="text-5xl mx-auto mb-4 text-black opacity-50" />
          <p className="font-bold text-xl uppercase text-black mb-4">
            You haven't unlocked any premium recipes yet!
          </p>
          <Link
            href="/recipes"
            className="font-black uppercase bg-black text-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] hover:-translate-y-1 transition-all inline-block mt-2"
          >
            Browse Premium Recipes
          </Link>
        </div>
      )}
    </div>
  );
}
