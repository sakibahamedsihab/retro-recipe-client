"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RecipeCard from "@/components/RecipeCard";
import { FaHeart, FaSpinner, FaTrash } from "react-icons/fa";

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorites`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    if (!confirm("Remove this recipe from favorites?")) return;
    setRemovingId(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorites/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f._id !== id));
        showToast("Removed from favorites!");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to remove.", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-xl font-black uppercase p-8">
        <FaSpinner className="animate-spin" /> Loading favorites...
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
      <div className="mb-8 border-b-4 border-black pb-4 flex items-center gap-4">
        <FaHeart className="text-red-500 text-3xl" />
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            My Favorites
          </h1>
          <p className="font-medium text-lg text-black mt-1">
            Your personal collection of saved recipes.{" "}
            <span className="font-black">({favorites.length})</span>
          </p>
        </div>
      </div>

      {/* Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((fav) => (
            <div key={fav._id} className="relative">
              <RecipeCard
                recipe={{
                  ...fav.recipe,
                  _id: fav.recipeId,
                }}
              />
              <button
                onClick={() => handleRemove(fav._id)}
                disabled={removingId === fav._id}
                className="absolute top-2 right-2 bg-red-500 text-white font-black px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all z-10 cursor-pointer disabled:opacity-60 flex items-center gap-1 text-xs"
                title="Remove from favorites"
              >
                {removingId === fav._id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-4 border-black border-dashed p-16 text-center">
          <FaHeart className="text-6xl mx-auto mb-4 text-red-300" />
          <p className="font-bold text-xl uppercase text-black mb-6">
            Your favorites list is empty!
          </p>
          <Link
            href="/recipes"
            className="font-black uppercase bg-[#FFC900] px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all inline-block"
          >
            Explore Recipes →
          </Link>
        </div>
      )}
    </div>
  );
}
