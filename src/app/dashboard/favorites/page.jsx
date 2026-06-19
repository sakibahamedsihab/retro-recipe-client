"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import Loader from "../../../components/Loader";
import { useToast } from "../../providers";
import { Heart, Eye, Trash2, Clock } from "lucide-react";

export default function FavoritesPage() {
  const { showToast } = useToast();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const response = await api.get("/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load favorites", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (recipeId) => {
    try {
      await api.delete(`/favorites/${recipeId}`);
      showToast("Removed from favorites", "success");
      setFavorites(favorites.filter((f) => f.recipeId !== recipeId));
    } catch (error) {
      console.error(error);
      showToast("Failed to remove from favorites", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Favorite Recipes
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
          Your saved collection of culinary inspirations.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-none">
          <Heart className="h-10 w-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-4 stroke-[1.5]" />
          <p className="text-xs uppercase tracking-widest font-black text-zinc-400 dark:text-zinc-500 mb-4">
            You haven't saved any favorites yet.
          </p>
          <Link
            href="/browse"
            className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:underline dark:text-zinc-50"
          >
            Explore recipes &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 overflow-hidden flex flex-col h-full rounded-none group hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors duration-200"
            >
              <div className="relative h-44 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900">
                <img
                  src={
                    fav.recipe?.recipeImage ||
                    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500"
                  }
                  alt={fav.recipe?.recipeName}
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute top-0 left-0 px-2.5 py-1 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-none">
                  {fav.recipe?.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 uppercase tracking-wide line-clamp-1 mb-3">
                  {fav.recipe?.recipeName}
                </h3>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{fav.recipe?.preparationTime} mins</span>
                  </div>
                  <span>{fav.recipe?.cuisineType}</span>
                </div>
                <div className="flex gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  <Link
                    href={`/recipes/${fav.recipeId}`}
                    className="flex-grow py-2.5 bg-zinc-50 hover:bg-zinc-900 hover:text-white dark:bg-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 font-bold text-xs uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-transparent dark:hover:border-transparent transition-colors text-center flex items-center justify-center gap-1.5 text-zinc-800 dark:text-zinc-200 rounded-none"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Details</span>
                  </Link>
                  <button
                    onClick={() => handleRemove(fav.recipeId)}
                    className="py-2.5 px-3 border border-zinc-200 dark:border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-red-600 bg-transparent transition-colors cursor-pointer rounded-none"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
