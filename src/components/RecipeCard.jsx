import Link from "next/link";
import { FaClock, FaHeart, FaUserAlt } from "react-icons/fa";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full">
      {/* Recipe Image Fallback */}
      <div className="h-48 w-full bg-[#FFC900] border-2 border-black mb-4 flex items-center justify-center overflow-hidden">
        {recipe?.recipeImage ? (
          <img
            src={recipe.recipeImage}
            alt={recipe.recipeName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-black text-black uppercase tracking-widest opacity-50">
            No Image
          </span>
        )}
      </div>

      {/* Category & Cuisine Tags */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className="bg-[#FFC900] text-black text-xs font-bold px-2 py-1 border border-black uppercase">
          {recipe?.category || "Category"}
        </span>
        <span className="bg-white text-black text-xs font-bold px-2 py-1 border border-black uppercase">
          {recipe?.cuisineType || "Cuisine"}
        </span>
      </div>

      {/* Recipe Title */}
      <h3 className="text-xl font-black text-black uppercase tracking-tight mb-2 line-clamp-1">
        {recipe?.recipeName || "Recipe Name"}
      </h3>

      {/* Meta Info */}
      <div className="flex justify-between items-center text-sm font-medium border-t-2 border-black pt-3 mt-auto mb-4">
        <div className="flex items-center gap-1">
          <FaUserAlt className="text-black" />
          <span className="line-clamp-1">{recipe?.authorName || "Author"}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <FaClock className="text-black" />
            <span>{recipe?.preparationTime || "0"} min</span>
          </div>
          <div className="flex items-center gap-1">
            <FaHeart className="text-red-500" />
            <span>{recipe?.likesCount || "0"}</span>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <Link
        href={`/recipes/${recipe?._id || "#"}`}
        className="block text-center w-full bg-black text-white font-bold uppercase py-2 hover:bg-[#FFC900] hover:text-black hover:border-black border-2 border-transparent transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
