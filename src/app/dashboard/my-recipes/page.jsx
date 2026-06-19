"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import Loader from "../../../components/Loader";
import { useToast } from "../../providers";
import {
  Edit3,
  Trash2,
  Clock,
  ChefHat,
  Eye,
  Save,
  X,
  Plus,
} from "lucide-react";

export default function MyRecipesPage() {
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCuisine, setEditCuisine] = useState("");
  const [editPrepTime, setEditPrepTime] = useState(30);
  const [editIngredients, setEditIngredients] = useState([]);
  const [editIngInput, setEditIngInput] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadRecipes = async () => {
    try {
      const response = await api.get("/recipes/my-recipes");
      setRecipes(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load your recipes", "error");
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

  const openEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setEditName(recipe.recipeName);
    setEditCategory(recipe.category);
    setEditCuisine(recipe.cuisineType);
    setEditPrepTime(recipe.preparationTime);
    setEditIngredients(recipe.ingredients);
    setEditInstructions(recipe.instructions);
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!editIngInput.trim()) return;
    if (editIngredients.includes(editIngInput.trim())) return;
    setEditIngredients([...editIngredients, editIngInput.trim()]);
    setEditIngInput("");
  };

  const handleRemoveIngredient = (idx) => {
    setEditIngredients(editIngredients.filter((_, i) => i !== idx));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const updates = {
        recipeName: editName,
        category: editCategory,
        cuisineType: editCuisine,
        preparationTime: editPrepTime,
        ingredients: editIngredients,
        instructions: editInstructions,
      };

      await api.patch(`/recipes/${editingRecipe._id}`, updates);
      showToast("Recipe updated successfully", "success");
      setEditingRecipe(null);
      loadRecipes();
    } catch (error) {
      console.error(error);
      showToast("Failed to update recipe", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
            My Recipes
          </h1>
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
            Update, manage, or delete your publications.
          </p>
        </div>
        <Link
          href="/dashboard/add-recipe"
          className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest transition-colors text-center cursor-pointer rounded-none"
        >
          Add New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-none">
          <p className="text-xs uppercase tracking-widest font-black text-zinc-400 dark:text-zinc-500 mb-4">
            You haven't created any recipes yet.
          </p>
          <Link
            href="/dashboard/add-recipe"
            className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:underline dark:text-zinc-50 inline-flex items-center gap-1.5"
          >
            Create your first recipe <Plus className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 overflow-hidden flex flex-col h-full rounded-none group hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors duration-200"
            >
              <div className="relative h-44 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900">
                <img
                  src={
                    recipe.recipeImage ||
                    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500"
                  }
                  alt={recipe.recipeName}
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute top-0 left-0 px-2.5 py-1 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-none">
                  {recipe.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 uppercase tracking-wide line-clamp-1 mb-3">
                  {recipe.recipeName}
                </h3>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{recipe.preparationTime} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-3.5 w-3.5" />
                    <span>{recipe.cuisineType}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  <Link
                    href={`/recipes/${recipe._id}`}
                    className="flex-1 py-2.5 bg-zinc-50 hover:bg-zinc-900 hover:text-white dark:bg-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 font-bold text-xs uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-transparent dark:hover:border-transparent transition-colors text-center flex items-center justify-center gap-1 text-zinc-800 dark:text-zinc-200 rounded-none"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => openEditModal(recipe)}
                    className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-950 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-none text-zinc-800 dark:text-zinc-200"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="py-2.5 px-3 border border-zinc-200 dark:border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-red-600 bg-transparent transition-colors cursor-pointer rounded-none"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm px-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-6 sm:p-8 shadow-xl my-8 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-4 mb-6">
              <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">
                Edit Recipe Details
              </h3>
              <button
                onClick={() => setEditingRecipe(null)}
                className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-950 cursor-pointer bg-transparent rounded-none transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Recipe Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 dark:bg-zinc-950 cursor-pointer rounded-none transition-colors"
                  >
                    {[
                      "Breakfast",
                      "Lunch",
                      "Dinner",
                      "Dessert",
                      "Salad",
                      "Beverage",
                      "Snack",
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Cuisine Type
                  </label>
                  <input
                    type="text"
                    value={editCuisine}
                    onChange={(e) => setEditCuisine(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    value={editPrepTime}
                    onChange={(e) =>
                      setEditPrepTime(parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-900 pt-5 flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Ingredients
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PRESS ENTER TO ADD INGREDIENT"
                    value={editIngInput}
                    onChange={(e) => setEditIngInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddIngredient(e)
                    }
                    className="flex-grow px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                  />
                  <button
                    onClick={handleAddIngredient}
                    type="button"
                    className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 hover:bg-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-50 text-zinc-800 dark:text-zinc-200 hover:text-white dark:hover:text-zinc-950 font-black text-xs uppercase tracking-widest flex items-center justify-center transition-colors cursor-pointer rounded-none"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {editIngredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold uppercase tracking-wider rounded-none"
                    >
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="hover:text-red-500 cursor-pointer bg-transparent border-0 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-900 pt-5 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Instructions / Cooking Directions
                </label>
                <textarea
                  rows="4"
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-900 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 border-0 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer rounded-none transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{savingEdit ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
