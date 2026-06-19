"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import api from "../../lib/api";
import Loader from "../../components/Loader";
import {
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Heart,
} from "lucide-react";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Salad",
  "Beverage",
  "Snack",
];

function BrowseRecipesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const selectedCategories = searchParams.get("category")
    ? searchParams.get("category").split(",")
    : [];
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", page);
        queryParams.set("limit", 6);
        if (search) queryParams.set("search", search);
        if (selectedCategories.length > 0)
          queryParams.set("category", selectedCategories.join(","));
        if (sortBy) {
          queryParams.set("sortBy", sortBy);
          queryParams.set("order", order);
        }

        const response = await api.get(`/recipes?${queryParams.toString()}`);
        setRecipes(response.data.recipes);
        setTotal(response.data.total);
        setPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, [page, search, searchParams.get("category"), sortBy, order]);

  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/browse?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURL({ search: searchInput, page: 1 });
  };

  const toggleCategory = (cat) => {
    let updatedCats;
    if (selectedCategories.includes(cat)) {
      updatedCats = selectedCategories.filter((c) => c !== cat);
    } else {
      updatedCats = [...selectedCategories, cat];
    }
    updateURL({ category: updatedCats.join(","), page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      updateURL({ page: newPage });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-white dark:bg-zinc-950">
      <div className="mb-12 text-center">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Browse Recipes
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Filter by category, search by name, or sort to find your next favorite
          meal.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-6 mb-10 transition-colors">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:w-96"
          >
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="SEARCH RECIPES..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-24 py-3 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer rounded-none"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [sort, ord] = e.target.value.split("-");
                updateURL({ sortBy: sort, order: ord, page: 1 });
              }}
              className="px-4 py-3 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-250 dark:bg-zinc-950 cursor-pointer rounded-none transition-colors"
            >
              <option value="createdAt-desc" className="dark:bg-zinc-950">
                Newest First
              </option>
              <option value="createdAt-asc" className="dark:bg-zinc-950">
                Oldest First
              </option>
              <option value="preparationTime-asc" className="dark:bg-zinc-950">
                Time: Low to High
              </option>
              <option value="preparationTime-desc" className="dark:bg-zinc-950">
                Time: High to Low
              </option>
              <option value="likesCount-desc" className="dark:bg-zinc-950">
                Popularity (Most Liked)
              </option>
            </select>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-6">
          <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">
            Categories Filter
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-none ${
                    isSelected
                      ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 font-black"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 rounded-none">
          <p className="text-xs uppercase tracking-widest font-black text-zinc-400 dark:text-zinc-500">
            No recipes found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 overflow-hidden flex flex-col h-full rounded-none group hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors duration-200"
              >
                <div className="relative h-56 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900">
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
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-zinc-950/80 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-none">
                    <Heart className="h-3 w-3 fill-current text-white" />
                    <span>{recipe.likesCount}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 uppercase tracking-wide line-clamp-1 mb-1">
                    {recipe.recipeName}
                  </h3>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
                    By Chef {recipe.authorName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-900 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{recipe.preparationTime} mins</span>
                    </div>
                    <span className="px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-none text-zinc-700 dark:text-zinc-300">
                      {recipe.cuisineType}
                    </span>
                  </div>
                  <Link
                    href={`/recipes/${recipe._id}`}
                    className="mt-5 w-full py-2.5 text-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-950 font-bold text-xs uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-transparent dark:hover:border-transparent transition-colors rounded-none"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 disabled:opacity-30 disabled:hover:border-zinc-200 dark:disabled:hover:border-zinc-800 transition-colors cursor-pointer rounded-none bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pages }).map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = pNum === page;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`h-10 w-10 border text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer rounded-none ${
                        isCurrent
                          ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 font-black"
                          : "border-zinc-200 hover:border-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-100 bg-transparent"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pages}
                className="p-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 disabled:opacity-30 disabled:hover:border-zinc-200 dark:disabled:hover:border-zinc-800 transition-colors cursor-pointer rounded-none bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BrowseRecipesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowseRecipesContent />
    </Suspense>
  );
}
