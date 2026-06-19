"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import RecipeCard from "../RecipeCard";
import { FaSpinner, FaFire } from "react-icons/fa";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PopularRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        // Fetch a larger set then sort by likes client-side
        // (server doesn't have a sort-by-likes param yet)
        const res = await fetch(
          `${BACKEND_URL}/api/recipes?limit=20&page=1`
        );
        if (res.ok) {
          const data = await res.json();
          const sorted = (data.recipes || [])
            .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
            .slice(0, 3);
          setRecipes(sorted);
        }
      } catch (error) {
        console.error("Error fetching popular recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="my-16 md:my-24 bg-[#FFF9E6] border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black bg-[#FFC900] inline-flex items-center gap-3 px-4 py-2 border-2 border-black">
          <FaFire className="text-red-500" /> Popular Recipes
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
            No popular recipes yet. Start liking some!
          </p>
        </div>
      )}
    </motion.section>
  );
}
