"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../../lib/api";
import Loader from "../../../../components/Loader";
import { useToast } from "../../../providers";
import { Trash2, Star, Eye, Sparkles } from "lucide-react";

export default function AdminRecipesPage() {
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadRecipes = async () => {
    try {
      const response = await api.get("/admin/recipes");
      setRecipes(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load recipes list", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await api.delete(`/recipes/${id}`);
      showToast("Recipe deleted successfully", "success");
      setRecipes(recipes.filter((r) => r._id !== id));
    } catch (error) {
      console.error(error);
      showToast("Failed to delete recipe", "error");
    }
  };

  const handleToggleFeature = async (recipe) => {
    setUpdatingId(recipe._id);
    const newFeaturedState = !recipe.isFeatured;
    try {
      await api.patch(`/recipes/${recipe._id}/feature`, {
        isFeatured: newFeaturedState,
      });
      showToast(
        `Recipe successfully ${newFeaturedState ? "added to featured" : "removed from featured"}!`,
        "success",
      );
      setRecipes(
        recipes.map((r) =>
          r._id === recipe._id ? { ...r, isFeatured: newFeaturedState } : r,
        ),
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to update recipe feature state", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
      {/* Header Segment info */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Manage Recipes
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
          Moderate recipe submissions and manage featured content.
        </p>
      </div>

      {/* Structural Data Table Box */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-none">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                <th className="px-6 py-4.5">Recipe</th>
                <th className="px-6 py-4.5">Author</th>
                <th className="px-6 py-4.5">Category</th>
                <th className="px-6 py-4.5">Featured</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {recipes.map((recipe) => (
                <tr
                  key={recipe._id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  {/* Recipe Cover Cell */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={
                        recipe.recipeImage ||
                        "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100"
                      }
                      alt={recipe.recipeName}
                      className="h-9 w-12 object-cover rounded-none filter grayscale contrast-125 border border-zinc-200 dark:border-zinc-800"
                    />
                    <span className="font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50">
                      {recipe.recipeName}
                    </span>
                  </td>

                  {/* Author Meta Details */}
                  <td className="px-6 py-4">
                    <div className="font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200">
                      {recipe.authorName}
                    </div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 lowercase tracking-normal">
                      {recipe.authorEmail}
                    </div>
                  </td>

                  {/* Category Badge Layout */}
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 rounded-none">
                      {recipe.category}
                    </span>
                  </td>

                  {/* Feature Status Indicators */}
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                        recipe.isFeatured
                          ? "text-zinc-900 dark:text-zinc-50"
                          : "text-zinc-400"
                      }`}
                    >
                      <Sparkles
                        className={`h-3.5 w-3.5 ${recipe.isFeatured ? "fill-current text-zinc-900 dark:text-zinc-50" : "text-zinc-400"}`}
                      />
                      <span>{recipe.isFeatured ? "Featured" : "Standard"}</span>
                    </span>
                  </td>

                  {/* Dashboard Action Controls */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-1.5 justify-end">
                      <Link
                        href={`/recipes/${recipe._id}`}
                        className="p-2 border border-zinc-200 hover:border-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-100 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors rounded-none"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => handleToggleFeature(recipe)}
                        disabled={updatingId === recipe._id}
                        className={`p-2 border transition-colors cursor-pointer rounded-none ${
                          recipe.isFeatured
                            ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950"
                            : "border-zinc-200 hover:border-zinc-900 text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-100"
                        }`}
                        title={
                          recipe.isFeatured
                            ? "Remove from featured"
                            : "Add to featured"
                        }
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${recipe.isFeatured ? "fill-current" : ""}`}
                        />
                      </button>

                      <button
                        onClick={() => handleDelete(recipe._id)}
                        className="p-2 border border-zinc-200 hover:border-red-600 text-zinc-400 hover:text-red-600 dark:border-zinc-800 dark:hover:border-red-500 transition-colors cursor-pointer rounded-none"
                        title="Delete recipe"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
