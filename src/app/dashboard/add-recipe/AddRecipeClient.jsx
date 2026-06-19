"use client";

import { useState } from "react";
import {
  FaUtensils,
  FaImage,
  FaClock,
  FaFire,
  FaListUl,
  FaSave,
} from "react-icons/fa";

export default function AddRecipeClient() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipeName: "",
    recipeImage: "",
    category: "",
    cuisineType: "",
    preparationTime: "",
    difficultyLevel: "Easy",
    ingredients: "",
    instructions: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Porobortite ekhane back-end API call hobe
    console.log("Recipe Data:", formData);

    setTimeout(() => {
      setLoading(false);
      alert("Recipe Added Successfully!");
      setFormData({
        recipeName: "",
        recipeImage: "",
        category: "",
        cuisineType: "",
        preparationTime: "",
        difficultyLevel: "Easy",
        ingredients: "",
        instructions: "",
      });
    }, 1000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-8 border-b-4 border-black pb-4">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
          Add New Recipe
        </h1>
        <p className="font-medium text-lg text-black mt-2">
          Share your culinary secret with the world. Fill out the details below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#FFF9E6] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8"
      >
        {/* Row 1: Recipe Name & Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="flex items-center gap-2 text-black font-bold uppercase mb-2">
              <FaUtensils /> Recipe Name
            </label>
            <input
              type="text"
              required
              value={formData.recipeName}
              onChange={(e) =>
                setFormData({ ...formData, recipeName: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="e.g. Classic Beef Burger"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-black font-bold uppercase mb-2">
              <FaImage /> Image URL
            </label>
            <input
              type="url"
              required
              value={formData.recipeImage}
              onChange={(e) =>
                setFormData({ ...formData, recipeImage: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Row 2: Category, Cuisine, Time & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-bold uppercase focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black appearance-none"
            >
              <option value="">Select</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Cuisine
            </label>
            <input
              type="text"
              required
              value={formData.cuisineType}
              onChange={(e) =>
                setFormData({ ...formData, cuisineType: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="e.g. Italian"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-black font-bold uppercase mb-2">
              <FaClock /> Time (Min)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.preparationTime}
              onChange={(e) =>
                setFormData({ ...formData, preparationTime: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="e.g. 45"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-black font-bold uppercase mb-2">
              <FaFire /> Difficulty
            </label>
            <select
              required
              value={formData.difficultyLevel}
              onChange={(e) =>
                setFormData({ ...formData, difficultyLevel: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-bold uppercase focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black appearance-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Row 3: Ingredients & Instructions */}
        <div className="space-y-8 border-t-4 border-black pt-8 mt-8">
          <div>
            <label className="flex items-center gap-2 text-black font-bold uppercase mb-2">
              <FaListUl /> Ingredients
            </label>
            <p className="text-xs font-bold text-gray-700 mb-2 uppercase">
              * Put each ingredient on a new line
            </p>
            <textarea
              required
              rows="4"
              value={formData.ingredients}
              onChange={(e) =>
                setFormData({ ...formData, ingredients: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black resize-none"
              placeholder="1 cup of flour&#10;2 eggs&#10;1 tsp salt"
            ></textarea>
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Instructions
            </label>
            <textarea
              required
              rows="6"
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black resize-none"
              placeholder="Step 1: Mix the ingredients...&#10;Step 2: Bake for 30 minutes..."
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-black text-white font-black uppercase text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,201,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,201,0,1)] transition-all disabled:opacity-70"
          >
            <FaSave className="text-2xl text-[#FFC900]" />
            {loading ? "Publishing Recipe..." : "Publish Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
