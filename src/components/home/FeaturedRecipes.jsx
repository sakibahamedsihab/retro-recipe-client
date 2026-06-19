"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import RecipeCard from "../RecipeCard";
import { FaSpinner } from "react-icons/fa";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch latest 3 active recipes
        const res = await fetch(
          `${BACKEND_URL}/api/recipes?limit=3&page=1`
        );
        if (res.ok) {
          const data = await res.json();
          setRecipes(data.recipes || []);
        }
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

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
        <Link
          href="/recipes"
          className="bg-black text-white font-black uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] hover:-translate-y-1 hover:bg-[#FFC900] hover:text-black transition-all text-sm whitespace-nowrap"
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <FaSpinner className="text-3xl text-black animate-spin" />
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-4 border-dashed border-black">
          <p className="font-bold uppercase text-black">
            No recipes yet. Be the first to add one!
          </p>
          <Link
            href="/dashboard/add-recipe"
            className="inline-block mt-4 font-bold underline decoration-2 hover:text-[#FFC900] transition-colors"
          >
            Add a Recipe
          </Link>
        </div>
      )}
    </motion.section>
  );
}
