"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { useToast } from "../../providers";
import { Plus, Trash2, Upload, Save } from "lucide-react";

export default function AddRecipePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [recipeName, setRecipeName] = useState("");
  const [category, setCategory] = useState("Breakfast");
  const [cuisineType, setCuisineType] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Medium");
  const [preparationTime, setPreparationTime] = useState(30);
  const [instructions, setInstructions] = useState("");

  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const addIngredient = (e) => {
    e.preventDefault();
    if (!ingredientInput.trim()) return;
    if (ingredients.includes(ingredientInput.trim())) {
      showToast("Ingredient already added", "info");
      return;
    }
    setIngredients([...ingredients, ingredientInput.trim()]);
    setIngredientInput("");
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadToImgBB = async (file) => {
    const apiKey =
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      "c8bc238c92a95c80521e422502693246";
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "ImgBB upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !recipeName.trim() ||
      !category ||
      !cuisineType.trim() ||
      !instructions.trim()
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    if (!imageFile) {
      showToast("Please upload an image for the recipe", "error");
      return;
    }
    if (ingredients.length === 0) {
      showToast("Please add at least one ingredient", "error");
      return;
    }

    setSubmitting(true);
    let finalImageUrl = "";

    try {
      if (imageFile) {
        setUploadingImage(true);
        finalImageUrl = await uploadToImgBB(imageFile);
        setUploadingImage(false);
      }

      const newRecipe = {
        recipeName,
        recipeImage:
          finalImageUrl ||
          "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500",
        category,
        cuisineType,
        difficultyLevel,
        preparationTime,
        ingredients,
        instructions,
      };

      await api.post("/recipes", newRecipe);
      showToast("Recipe added successfully!", "success");
      router.push("/dashboard/my-recipes");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to add recipe";
      showToast(msg, "error");
    } finally {
      setUploadingImage(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white dark:bg-zinc-950">
      {/* Page Minimal Header info */}
      <div className="mb-10">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Add New Recipe
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
          Create and publish your custom culinary creations.
        </p>
      </div>

      {/* Main Structural Input Form Grid */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-none transition-colors"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Recipe Name *
            </label>
            <input
              type="text"
              placeholder="E.G. GRANDMA'S APPLE PIE"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
                <option key={cat} value={cat} className="dark:bg-zinc-950">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Cuisine Type *
            </label>
            <input
              type="text"
              placeholder="E.G. ITALIAN, MEXICAN"
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
              className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Difficulty Level
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 dark:bg-zinc-950 cursor-pointer rounded-none transition-colors"
            >
              <option value="Easy" className="dark:bg-zinc-950">
                Easy
              </option>
              <option value="Medium" className="dark:bg-zinc-950">
                Medium
              </option>
              <option value="Hard" className="dark:bg-zinc-950">
                Hard
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Prep Time (mins) *
            </label>
            <input
              type="number"
              placeholder="30"
              value={preparationTime}
              onChange={(e) =>
                setPreparationTime(parseInt(e.target.value) || 0)
              }
              min="1"
              className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
              required
            />
          </div>
        </div>

        {/* Media Attach Section layout */}
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-6">
          <div className="flex flex-col gap-1.5 max-w-md">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <Upload className="h-3.5 w-3.5 text-zinc-400" />
              <span>Upload Image (imgbb) *</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:border file:border-zinc-200 dark:file:border-zinc-800 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-zinc-50 dark:file:bg-zinc-900 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-900 hover:file:text-white dark:hover:file:bg-zinc-50 dark:hover:file:text-zinc-950 file:transition-colors cursor-pointer rounded-none"
              required
            />
          </div>
        </div>

        {/* Dynamic Ingredient Input Elements */}
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-6 flex flex-col gap-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Ingredients *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="E.G. 2 CUPS FLOUR (PRESS ENTER)"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIngredient(e)}
              className="flex-grow px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
            />
            <button
              onClick={addIngredient}
              type="button"
              className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 hover:bg-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-50 text-zinc-800 dark:text-zinc-200 hover:text-white dark:hover:text-zinc-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1 transition-colors cursor-pointer rounded-none"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Ingredient Render Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold uppercase tracking-wider rounded-none"
              >
                <span>{ing}</span>
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="hover:text-red-500 transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Recipe Instructions Box */}
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-6 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Instructions / Cooking Directions *
          </label>
          <textarea
            rows="6"
            placeholder="STEP 1: PREHEAT OVEN... STEP 2: MIX INGREDIENTS..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full px-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 whitespace-pre-wrap rounded-none transition-colors"
            required
          />
        </div>

        {/* Submission Trigger Button */}
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-6">
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-none border-0 transition-colors"
          >
            {submitting ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-none animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>
                  {uploadingImage
                    ? "Uploading image..."
                    : "Save and Publish Recipe"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
