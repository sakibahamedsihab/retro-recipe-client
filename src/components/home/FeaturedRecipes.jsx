"use client";

import { motion } from "framer-motion";
import RecipeCard from "../RecipeCard";

export default function FeaturedRecipes() {
  const dummyRecipes = [
    {
      _id: "1",
      recipeName: "Spicy Beef Taco",
      category: "Dinner",
      cuisineType: "Mexican",
      preparationTime: 30,
      authorName: "Shihab",
      likesCount: 120,
    },
    {
      _id: "2",
      recipeName: "Classic Cheeseburger",
      category: "Lunch",
      cuisineType: "American",
      preparationTime: 25,
      authorName: "John Doe",
      likesCount: 95,
    },
    {
      _id: "3",
      recipeName: "Creamy Pasta",
      category: "Dinner",
      cuisineType: "Italian",
      preparationTime: 40,
      authorName: "Jane Smith",
      likesCount: 150,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="my-16 md:my-24"
    >
      <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
          Featured Recipes
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyRecipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </motion.section>
  );
}
