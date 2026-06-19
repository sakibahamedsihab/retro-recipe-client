"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import RecipeCard from "@/components/RecipeCard";

export default function RecipeClientHelper({ initialRecipes }) {
  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snacks",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  // ক্যাটাগরি অনুযায়ী রেসিপি ফিল্টার করা
  const filteredRecipes =
    activeCategory === "All"
      ? initialRecipes
      : initialRecipes.filter((recipe) => recipe.category === activeCategory);

  return (
    <>
      {/* Filter Section */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 border-2 border-black font-bold uppercase transition-all ${
              activeCategory === cat
                ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white text-black hover:bg-[#FFC900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipes Grid */}
      <motion.div
        key={activeCategory} // ক্যাটাগরি চেঞ্জ হলে অ্যানিমেশন আবার ট্রিগার করবে
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
      >
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 border-4 border-black border-dashed bg-[#FDFBF7]">
            <p className="text-xl font-bold uppercase text-black">
              No recipes found for this category.
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination (Static UI for now, will connect to API later) */}
      <div className="flex justify-center items-center gap-4 border-t-4 border-black pt-8">
        <button className="bg-white text-black font-black uppercase px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFC900] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <span className="font-bold text-lg bg-[#FDFBF7] px-4 py-2 border-2 border-black">
          Page 1 of 5
        </span>
        <button className="bg-white text-black font-black uppercase px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFC900] transition-all">
          Next
        </button>
      </div>
    </>
  );
}
