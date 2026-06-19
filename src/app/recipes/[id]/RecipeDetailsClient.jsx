"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
  FaHeart,
  FaBookmark,
  FaExclamationTriangle,
  FaShoppingCart,
  FaClock,
  FaUserAlt,
  FaUtensils,
  FaFire,
  FaCheckCircle,
} from "react-icons/fa";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RecipeDetailsClient({ recipe }) {
  const { data: session } = authClient.useSession();

  const [likes, setLikes] = useState(recipe.likesCount || 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favoritedId, setFavoritedId] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // ── Like Toggle ─────────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!session) return alert("Please log in to like a recipe.");
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/recipes/${recipe._id}/like`,
        { method: "PATCH", credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likesCount);
        setLiked(data.liked);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to like recipe.");
      }
    } catch {
      alert("Something went wrong!");
    } finally {
      setLikeLoading(false);
    }
  };

  // ── Favorite Toggle ──────────────────────────────────────────────────────────
  const handleFavorite = async () => {
    if (!session) return alert("Please log in to save favorites.");
    if (favLoading) return;
    setFavLoading(true);
    try {
      if (favorited && favoritedId) {
        // Remove from favorites
        const res = await fetch(
          `${BACKEND_URL}/api/favorites/${favoritedId}`,
          { method: "DELETE", credentials: "include" }
        );
        if (res.ok) {
          setFavorited(false);
          setFavoritedId(null);
        } else {
          const data = await res.json().catch(() => ({}));
          alert(data.message || "Failed to remove favorite.");
        }
      } else {
        // Add to favorites
        const res = await fetch(`${BACKEND_URL}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ recipeId: recipe._id }),
        });
        if (res.ok) {
          const data = await res.json();
          setFavorited(true);
          setFavoritedId(data.favoriteId || null);
        } else {
          const data = await res.json().catch(() => ({}));
          alert(data.message || "Failed to add to favorites.");
        }
      }
    } catch {
      alert("Something went wrong!");
    } finally {
      setFavLoading(false);
    }
  };

  // ── Report Submit ────────────────────────────────────────────────────────────
  const handleReportSubmit = async () => {
    if (!session) return alert("Please log in to report a recipe.");
    if (!reportReason) return alert("Please select a reason.");
    setReportLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recipeId: recipe._id, reason: reportReason }),
      });
      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setIsReportModalOpen(false);
          setReportSuccess(false);
          setReportReason("");
        }, 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to submit report.");
      }
    } catch {
      alert("Something went wrong!");
    } finally {
      setReportLoading(false);
    }
  };

  // ── Purchase Recipe ──────────────────────────────────────────────────────────
  const handlePurchase = async () => {
    if (!session) return alert("Please log in to purchase a recipe.");
    setPurchaseLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ type: "recipe", recipeId: recipe._id }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to initiate purchase.");
      }
    } catch {
      alert("Something went wrong connecting to payment gateway!");
    } finally {
      setPurchaseLoading(false);
    }
  };

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
          <div className="flex flex-wrap gap-3">
            {/* Like */}
            <button
              id="btn-like"
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 font-black uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-60 cursor-pointer ${
                liked
                  ? "bg-red-500 text-white"
                  : "bg-white text-black hover:bg-[#FFC900]"
              }`}
            >
              <FaHeart className={liked ? "text-white" : "text-red-500"} />
              {liked ? "Liked!" : "Like"}
            </button>

            {/* Favorite */}
            <button
              id="btn-favorite"
              onClick={handleFavorite}
              disabled={favLoading}
              className={`flex items-center gap-2 font-black uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-60 cursor-pointer ${
                favorited
                  ? "bg-[#FFC900] text-black"
                  : "bg-white text-black hover:bg-[#FFC900]"
              }`}
            >
              <FaBookmark />
              {favLoading ? "..." : favorited ? "Saved!" : "Favorite"}
            </button>

            {/* Report */}
            <button
              id="btn-report"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 bg-black text-white font-black uppercase px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer"
            >
              <FaExclamationTriangle className="text-[#FFC900]" /> Report
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Ingredients */}
        <div className="col-span-1">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
            Ingredients
          </h2>
          <ul className="space-y-3">
            {(recipe.ingredients || []).map((item, index) => (
              <li key={index} className="flex items-start gap-3 font-medium text-lg">
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

          {/* Purchase Section */}
          <div className="mt-12 bg-[#FFC900] border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase mb-4 text-black">
              Unlock Full Access
            </h3>
            <p className="font-medium mb-6">
              Want to save this recipe permanently to your collection? Purchase
              it now!
            </p>
            <button
              id="btn-purchase"
              onClick={handlePurchase}
              disabled={purchaseLoading}
              className="bg-black text-white text-xl font-black uppercase px-8 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-60 cursor-pointer"
            >
              <FaShoppingCart />
              {purchaseLoading ? "Redirecting..." : "Buy Recipe for $4.99"}
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
            {reportSuccess ? (
              <div className="text-center py-6">
                <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                <p className="font-black uppercase text-black text-xl">
                  Report Submitted!
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-4 text-black">
                  Report Recipe
                </h3>
                <select
                  id="report-reason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full border-4 border-black p-3 font-bold uppercase mb-6 focus:outline-none bg-white text-black"
                >
                  <option value="">Select a Reason</option>
                  <option value="Spam">Spam</option>
                  <option value="Offensive Content">Offensive Content</option>
                  <option value="Copyright Issue">Copyright Issue</option>
                  <option value="Misleading Information">Misleading Information</option>
                </select>
                <div className="flex gap-4">
                  <button
                    id="btn-report-submit"
                    onClick={handleReportSubmit}
                    disabled={reportLoading}
                    className="w-full bg-black text-white font-black uppercase py-2 border-2 border-black hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60 cursor-pointer"
                  >
                    {reportLoading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    id="btn-report-cancel"
                    onClick={() => setIsReportModalOpen(false)}
                    className="w-full bg-white text-black font-black uppercase py-2 border-2 border-black hover:-translate-y-1 hover:bg-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
