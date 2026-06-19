"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecipeCard from "@/components/RecipeCard";
import { FaSearch, FaSpinner } from "react-icons/fa";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"];
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RecipeClientHelper() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 6 });
      if (search) params.set("search", search);
      if (activeCategory !== "All") params.set("category", activeCategory);

      const res = await fetch(`${BACKEND_URL}/api/recipes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRecipes(data.recipes || []);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <>
      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-8 flex gap-2 max-w-xl mx-auto"
      >
        <div className="relative flex-1">
          <input
            type="text"
            id="recipe-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search recipes..."
            className="w-full px-5 py-3 border-4 border-black font-medium text-black bg-white focus:outline-none focus:bg-[#FFF9E6] uppercase placeholder:normal-case placeholder:font-medium pr-10"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-black hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-black text-white px-5 py-3 border-4 border-black font-black uppercase flex items-center gap-2 hover:bg-[#FFC900] hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <FaSearch />
          Search
        </button>
      </form>

      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase()}`}
            onClick={() => handleCategoryChange(cat)}
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

      {/* Results Count */}
      {!loading && (
        <p className="text-center font-bold text-black mb-6 uppercase text-sm">
          {total} Recipe{total !== 1 ? "s" : ""} Found
          {search && ` for "${search}"`}
        </p>
      )}

      {/* Recipes Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="text-4xl text-black animate-spin" />
            <p className="font-black uppercase text-black animate-pulse">
              Loading Recipes...
            </p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${search}-${page}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 border-4 border-black border-dashed bg-[#FDFBF7]">
                <p className="text-xl font-bold uppercase text-black">
                  No recipes found.
                </p>
                {(search || activeCategory !== "All") && (
                  <button
                    onClick={() => {
                      handleSearchClear();
                      handleCategoryChange("All");
                    }}
                    className="mt-4 font-bold underline decoration-2 underline-offset-4 hover:text-[#FFC900] transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-4 border-t-4 border-black pt-8">
          <button
            id="pagination-prev"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-white text-black font-black uppercase px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFC900] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="font-bold text-lg bg-[#FDFBF7] px-4 py-2 border-2 border-black">
            Page {page} of {totalPages}
          </span>
          <button
            id="pagination-next"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-white text-black font-black uppercase px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFC900] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
