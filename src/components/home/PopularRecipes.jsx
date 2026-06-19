"use client";

import { motion } from "framer-motion";
import RecipeCard from "../RecipeCard";

export default function PopularRecipes() {
  const dummyPopularRecipes = [
    {
      _id: "4",
      recipeName: "Retro Pepperoni Pizza",
      category: "Dinner",
      cuisineType: "Italian",
      preparationTime: 45,
      authorName: "Alex",
      likesCount: 320,
    },
    {
      _id: "5",
      recipeName: "Vintage Velvet Cake",
      category: "Dessert",
      cuisineType: "American",
      preparationTime: 60,
      authorName: "Maria",
      likesCount: 285,
    },
    {
      _id: "6",
      recipeName: "Spicy Ramen Bowl",
      category: "Lunch",
      cuisineType: "Asian",
      preparationTime: 20,
      authorName: "Sakib",
      likesCount: 250,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="my-16 md:my-24 bg-[#FFF9E6] border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black bg-[#FFC900] inline-block px-4 py-2 border-2 border-black">
          Popular Recipes
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyPopularRecipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </motion.section>
  );
}
