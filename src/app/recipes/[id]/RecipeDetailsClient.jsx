"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaBookmark,
  FaExclamationTriangle,
  FaShoppingCart,
  FaClock,
  FaUserAlt,
  FaUtensils,
  FaFire,
} from "react-icons/fa";

export default function RecipeDetailsClient({ recipe }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [likes, setLikes] = useState(recipe.likesCount);

  // সিম্পল লাইক হ্যান্ডলার (পরবর্তীতে API কানেক্ট হবে)
  const handleLike = () => setLikes(likes + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="bg-[#FFF9E6] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12 flex flex-col md:flex-row gap-8 items-center">
        {/* Image */}
        <div className="w-full md:w-1/2 h-64 md:h-80 bg-[#FDFBF7] border-4 border-black flex items-center justify-center overflow-hidden">
          {recipe.recipeImage ? (
            <img
              src={recipe.recipeImage}
              alt={recipe.recipeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-black text-black uppercase tracking-widest opacity-50 text-2xl">
              No Image
            </span>
          )}
        </div>

        {/* Title & Meta */}
        <div className="w-full md:w-1/2">
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="bg-[#FFC900] text-black text-sm font-bold px-3 py-1 border-2 border-black uppercase">
              {recipe.category}
            </span>
            <span className="bg-white text-black text-sm font-bold px-3 py-1 border-2 border-black uppercase">
              {recipe.cuisineType}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black mb-6">
            {recipe.recipeName}
          </h1>

          <div className="grid grid-cols-2 gap-4 text-black font-bold uppercase mb-8">
            <div className="flex items-center gap-2">
              <FaUserAlt /> {recipe.authorName}
            </div>
            <div className="flex items-center gap-2">
              <FaClock /> {recipe.preparationTime} Min
            </div>
            <div className="flex items-center gap-2">
              <FaFire /> {recipe.difficultyLevel}
            </div>
            <div className="flex items-center gap-2">
              <FaHeart className="text-red-500" /> {likes} Likes
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 bg-white text-black font-black uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#FFC900] transition-all"
            >
              <FaHeart className="text-red-500" /> Like
            </button>
            <button className="flex items-center gap-2 bg-white text-black font-black uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#FFC900] transition-all">
              <FaBookmark /> Favorite
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 bg-black text-white font-black uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              <FaExclamationTriangle className="text-[#FFC900]" /> Report
            </button>
          </div>
        </div>
      </div>

      {/* Content Section (Ingredients & Instructions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Ingredients */}
        <div className="col-span-1">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
            Ingredients
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 font-medium text-lg"
              >
                <FaUtensils className="text-[#FFC900] mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
            Instructions
          </h2>
          <div className="bg-[#FDFBF7] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-medium text-lg leading-relaxed whitespace-pre-line">
              {recipe.instructions}
            </p>
          </div>

          {/* Purchase Recipe Section */}
          <div className="mt-12 bg-[#FFC900] border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase mb-4 text-black">
              Unlock Full Access
            </h3>
            <p className="font-medium mb-6">
              Want to download and save this recipe permanently? Purchase it
              now!
            </p>
            <button className="bg-black text-white text-xl font-black uppercase px-8 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto">
              <FaShoppingCart /> Buy Recipe for $4.99
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#FDFBF7] border-4 border-black p-8 w-full max-w-md shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative"
          >
            <h3 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-4 text-black">
              Report Recipe
            </h3>
            <select className="w-full border-4 border-black p-3 font-bold uppercase mb-6 focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white">
              <option value="">Select a Reason</option>
              <option value="Spam">Spam</option>
              <option value="Offensive Content">Offensive Content</option>
              <option value="Copyright Issue">Copyright Issue</option>
            </select>
            <div className="flex gap-4">
              <button
                className="w-full bg-black text-white font-black uppercase py-2 border-2 border-black hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => setIsReportModalOpen(false)}
              >
                Submit
              </button>
              <button
                className="w-full bg-white text-black font-black uppercase py-2 border-2 border-black hover:-translate-y-1 hover:bg-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => setIsReportModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
