"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard"; // আমাদের আগে বানানো রেসিপি কার্ড

export default function FavoritesClient({ initialFavorites }) {
  const [favorites, setFavorites] = useState(initialFavorites);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="mb-8 border-b-4 border-black pb-4">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
          My Favorites
        </h1>
        <p className="font-medium text-lg text-black mt-2">
          Your personal collection of mouth-watering recipes.
        </p>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((recipe) => (
            <div key={recipe._id} className="relative">
              <RecipeCard recipe={recipe} />
              {/* চাইলে এখানে কার্ডের উপর একটি Remove বাটনও দেওয়া যায় */}
              <button
                onClick={() =>
                  setFavorites(favorites.filter((f) => f._id !== recipe._id))
                }
                className="absolute top-2 right-2 bg-red-500 text-white font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all z-10"
                title="Remove from favorites"
              >
                X
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Fallback */
        <div className="bg-white border-4 border-black border-dashed p-12 text-center">
          <p className="font-bold text-xl uppercase text-black mb-4">
            Your favorite list is empty!
          </p>
          <Link
            href="/recipes"
            className="font-black uppercase bg-[#FFC900] px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all inline-block mt-2"
          >
            Explore Recipes
          </Link>
        </div>
      )}
    </div>
  );
}
