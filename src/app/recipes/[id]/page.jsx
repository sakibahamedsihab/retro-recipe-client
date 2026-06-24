"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "../../../lib/auth-client";
import api from "../../../lib/api";
import Loader from "../../../components/Loader";
import { useToast } from "../../providers";
import {
  Clock,
  ChefHat,
  Heart,
  Star,
  ShieldAlert,
  ShoppingCart,
  Lock,
  Unlock,
  Sparkles,
  Send,
  Utensils,
} from "lucide-react";

export default function RecipeDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const recipeId = params.id;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    async function loadRecipeData() {
      try {
        const recipeRes = await api.get(`/recipes/${recipeId}`);
        setRecipe(recipeRes.data);

        if (session?.user) {
          const purchaseRes = await api.get(
            `/payments/check-purchase/${recipeId}`,
          );
          setPurchased(purchaseRes.data.purchased);

          const favsRes = await api.get("/favorites");
          const found = favsRes.data.some((fav) => fav.recipeId === recipeId);
          setIsFavorited(found);
        }
      } catch (error) {
        console.error("Error loading recipe details:", error);
        showToast("Failed to load recipe details", "error");
      } finally {
        setLoading(false);
      }
    }
    if (recipeId) {
      loadRecipeData();
    }
  }, [recipeId, session]);

  if (loading) return <Loader />;
  if (!recipe) {
    return (
      <div className="text-center py-24 bg-white dark:bg-zinc-950 px-6">
        <h2 className="text-lg font-black uppercase tracking-tight">
          Recipe not found
        </h2>
        <Link
          href="/browse"
          className="text-xs uppercase font-bold tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 underline mt-4 inline-block"
        >
          Back to browsing
        </Link>
      </div>
    );
  }

  const isAuthor = session?.user?.email === recipe.authorEmail;
  const isAdmin = session?.user?.role === "admin";
  const canViewInstructions = isAuthor || isAdmin || purchased;
  const hasLiked = recipe?.likedBy?.includes(session?.user?.email);

  const handleLike = async () => {
    if (!session) {
      showToast("Please login to like recipes", "info");
      router.push("/login");
      return;
    }
    try {
      const response = await api.post(`/recipes/${recipeId}/like`);
      setRecipe({
        ...recipe,
        likesCount: response.data.likesCount,
        likedBy: response.data.likedBy,
      });
      if (response.data.liked) {
        showToast("Recipe liked!", "success");
      } else {
        showToast("Recipe unliked!", "info");
      }
    } catch (error) {
      console.error(error);
      showToast("Error updating like state", "error");
    }
  };

  const handleFavorite = async () => {
    if (!session) {
      showToast("Please login to save favorites", "info");
      router.push("/login");
      return;
    }
    try {
      if (isFavorited) {
        await api.delete(`/favorites/${recipeId}`);
        setIsFavorited(false);
        showToast("Removed from favorites", "info");
      } else {
        await api.post("/favorites", { recipeId });
        setIsFavorited(true);
        showToast("Added to favorites!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Error updating favorites", "error");
    }
  };

  const handlePurchase = async () => {
    if (!session) {
      showToast("Please login to purchase recipes", "info");
      router.push("/login");
      return;
    }
    try {
      const response = await api.post("/payments/create-checkout-session", {
        type: "recipe",
        recipeId,
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      showToast("Failed to start checkout. Try again.", "error");
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!session) {
      showToast("Please login to report recipes", "info");
      router.push("/login");
      return;
    }
    setSubmittingReport(true);
    try {
      await api.post("/reports", { recipeId, reason: reportReason });
      showToast(
        "Recipe reported successfully. Thank you for your feedback.",
        "success",
      );
      setShowReportModal(false);
    } catch (error) {
      console.error(error);
      showToast("Failed to submit report", "error");
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-white dark:bg-zinc-950">
      {/* Top Banner Block Box */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none overflow-hidden mb-8">
        <div className="relative h-96 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900">
          <img
            src={
              recipe.recipeImage ||
              "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800"
            }
            alt={recipe.recipeName}
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-zinc-950/40 mix-blend-multiply"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
            <span className="px-2.5 py-1 bg-white text-zinc-950 text-[10px] font-bold uppercase tracking-widest rounded-none">
              {recipe.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mt-3">
              {recipe.recipeName}
            </h1>
            <p className="text-zinc-300 text-xs uppercase tracking-wider mt-2 font-bold">
              By Chef {recipe.authorName}
            </p>
          </div>
        </div>

        {/* Info & Micro Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-zinc-50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Prep: {recipe.preparationTime} mins
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ChefHat className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Cuisine: {recipe.cuisineType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`px-4 py-2 border flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-none ${
                hasLiked
                  ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950"
                  : "border-zinc-200 hover:border-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-100 text-zinc-800 dark:text-zinc-200 bg-transparent"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${hasLiked ? "fill-current text-red-500 dark:text-red-400" : ""}`} />
              <span>{recipe.likesCount} Likes</span>
            </button>

            <button
              onClick={handleFavorite}
              className={`p-2.5 border transition-colors cursor-pointer bg-transparent rounded-none ${
                isFavorited
                  ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950"
                  : "border-zinc-200 hover:border-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-100 text-zinc-800 dark:text-zinc-200"
              }`}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                className={`h-3.5 w-3.5 ${isFavorited ? "fill-current" : ""}`}
              />
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="p-2.5 border border-zinc-200 hover:border-red-600 hover:text-red-600 dark:border-zinc-800 transition-colors cursor-pointer bg-transparent rounded-none text-zinc-500 dark:text-zinc-400"
              title="Report Recipe"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Ingredients Block */}
        <div className="p-8 border-t border-zinc-200 dark:border-zinc-900">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span>Ingredients</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recipe.ingredients.map((ing, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs uppercase tracking-wider font-semibold text-zinc-700 dark:text-zinc-400"
              >
                <span className="h-1.5 w-1.5 bg-zinc-900 dark:bg-zinc-50 mt-1.5 flex-shrink-0 rounded-none"></span>
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cooking Directions Base Box */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-none relative overflow-hidden">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Cooking Directions</span>
        </h2>

        {canViewInstructions ? (
          <div>
            <div className="flex items-center gap-2 mb-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 px-3 py-1.5 text-[10px] w-fit font-bold uppercase tracking-widest rounded-none">
              <Unlock className="h-3.5 w-3.5" />
              <span>Full recipe details unlocked</span>
            </div>
            <p className="text-xs uppercase font-medium tracking-wide text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
              {recipe.instructions}
            </p>
          </div>
        ) : (
          <div className="relative py-8 flex flex-col items-center text-center">
            {/* Minimal Pattern Wireframe Mockup Text */}
            <div className="absolute inset-0 opacity-10 select-none pointer-events-none text-[10px] uppercase tracking-widest leading-loose text-zinc-400 dark:text-zinc-600 text-left overflow-hidden">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </div>

            <div className="relative z-10 max-w-sm flex flex-col items-center gap-4 border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-6 rounded-none">
              <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-black text-sm uppercase tracking-tight text-zinc-900 dark:text-zinc-50">
                Locked Directions
              </h3>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 leading-relaxed">
                Purchase this custom recipe for a one-time fee of{" "}
                <strong className="text-zinc-900 dark:text-zinc-50 font-black">
                  $4.99
                </strong>{" "}
                to unlock full chef directions.
              </p>
              <button
                onClick={handlePurchase}
                className="w-full mt-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-none border-0"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Buy Recipe - $4.99</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Modal Popover Grid Layout */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm px-6">
          <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-none p-6 border border-zinc-200 dark:border-zinc-900 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50 mb-1">
              Report Recipe
            </h3>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-6">
              Specify the reason why you are reporting this recipe card.
            </p>
            <form onSubmit={handleReport} className="space-y-4">
              <div className="flex flex-col gap-2">
                {["Spam", "Offensive Content", "Copyright Issue"].map(
                  (reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-none cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                        className="accent-zinc-900 dark:accent-zinc-50 h-3.5 w-3.5 cursor-pointer rounded-none"
                      />
                      <span className="text-xs uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-300">
                        {reason}
                      </span>
                    </label>
                  ),
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-6">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 border-0 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer rounded-none"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submittingReport ? "Submitting..." : "Submit"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
