"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorites`,
          {
            credentials: "include",
          }
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
    if (confirm("Are you sure you want to remove this from favorites?")) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorites/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (res.ok) {
          setFavorites(favorites.filter((f) => f._id !== id));
        } else {
          const data = await res.json().catch(() => ({}));
          alert(data.message || "Failed to remove from favorites.");
        }
      } catch (error) {
        console.error("Error removing favorite:", error);
        alert("Something went wrong connecting to server!");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-xl font-black uppercase animate-pulse p-8">
        Loading favorites...
      </div>
    );
  }

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
          {favorites.map((fav) => (
            <div key={fav._id} className="relative">
              <RecipeCard recipe={{ ...fav.recipe, _id: fav.recipeId }} />
              <button
                onClick={() => handleRemove(fav._id)}
                className="absolute top-2 right-2 bg-red-500 text-white font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all z-10 cursor-pointer"
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
