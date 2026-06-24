"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "../../lib/auth-client";
import api from "../../lib/api";
import Loader from "../../components/Loader";
import { useToast } from "../providers";
import {
  ChefHat,
  Heart,
  Award,
  Sparkles,
  DollarSign,
  ArrowRight,
  Users,
  AlertOctagon,
  FileText,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);

  const [myRecipesCount, setMyRecipesCount] = useState(0);
  const [totalLikesReceived, setTotalLikesReceived] = useState(0);
  const [myFavoritesCount, setMyFavoritesCount] = useState(0);

  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const userRes = await api.get("/users/me");
        setDbUser(userRes.data);

        if (userRes.data.role === "admin") {
          const adminRes = await api.get("/admin/overview");
          setAdminStats(adminRes.data);
        } else {
          const [recipesRes, favsRes] = await Promise.all([
            api.get("/recipes/my-recipes"),
            api.get("/favorites"),
          ]);

          const recipes = recipesRes.data;
          setMyRecipesCount(recipes.length);

          const totalLikes = recipes.reduce(
            (sum, r) => sum + (r.likesCount || 0),
            0,
          );
          setTotalLikesReceived(totalLikes);
          setMyFavoritesCount(favsRes.data.length);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        showToast("Failed to load dashboard statistics", "error");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleUpgradeToPremium = () => {
    router.push("/dashboard/upgrade");
  };

  if (loading) return <Loader />;

  const isPremium = dbUser?.isPremium;
  const isAdmin = dbUser?.role === "admin";

  if (isAdmin) {
    return (
      <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
            Admin Console
          </h1>
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
            System status and community moderation overview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-900 rounded-none flex items-center gap-4">
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Total Users
              </p>
              <h3 className="text-xl font-black uppercase mt-0.5 text-zinc-900 dark:text-white">
                {adminStats?.totalUsers || 0}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-900 rounded-none flex items-center gap-4">
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Total Recipes
              </p>
              <h3 className="text-xl font-black uppercase mt-0.5 text-zinc-900 dark:text-white">
                {adminStats?.totalRecipes || 0}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-900 rounded-none flex items-center gap-4">
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Premium Members
              </p>
              <h3 className="text-xl font-black uppercase mt-0.5 text-zinc-900 dark:text-white">
                {adminStats?.totalPremiumMembers || 0}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-900 rounded-none flex items-center gap-4">
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Total Reports
              </p>
              <h3 className="text-xl font-black uppercase mt-0.5 text-zinc-900 dark:text-white">
                {adminStats?.totalReports || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
              <DollarSign className="h-6 w-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
                Total Revenue Generated
              </h2>
              <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
                Total payments collected from recipe purchases and upgrades.
              </p>
            </div>
          </div>
          <div className="text-2xl font-black tracking-wide text-zinc-900 dark:text-zinc-50">
            $
            {adminStats?.totalRevenue
              ? adminStats.totalRevenue.toFixed(2)
              : "0.00"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
              Welcome, {dbUser?.name}!
            </h1>
            {isPremium && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[10px] font-bold uppercase tracking-widest rounded-none ${
                dbUser?.premiumType === "bronze"
                  ? "bg-amber-100 dark:bg-amber-950/20 text-amber-800 border-amber-200 dark:border-amber-900"
                  : dbUser?.premiumType === "silver"
                  ? "bg-slate-100 dark:bg-slate-950/20 text-slate-800 border-slate-200 dark:border-slate-900"
                  : "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-800 border-yellow-200 dark:border-yellow-900"
              }`}>
                <Award className="h-3.5 w-3.5" />
                <span>{dbUser?.premiumType ? `${dbUser.premiumType} Member` : "Premium Member"}</span>
              </span>
            )}
          </div>
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
            Here is a quick snapshot of your kitchen dashboard.
          </p>
        </div>
        <Link
          href="/dashboard/add-recipe"
          className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest transition-colors text-center cursor-pointer rounded-none border-0"
        >
          Add New Recipe
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-900 rounded-none flex items-center gap-4">
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              My Recipes
            </p>
            <h3 className="text-xl font-black uppercase mt-0.5 text-zinc-900 dark:text-white">
              {myRecipesCount}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-900 rounded-none flex items-center gap-4">
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Likes Received
            </p>
            <h3 className="text-xl font-black uppercase mt-0.5 text-zinc-900 dark:text-white">
              {totalLikesReceived}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-900 rounded-none flex items-center gap-4">
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              My Favorites
            </p>
            <h3 className="text-xl font-black uppercase mt-0.5 text-zinc-900 dark:text-white">
              {myFavoritesCount}
            </h3>
          </div>
        </div>
      </div>

      {(!isPremium || (dbUser?.recipeLimit || 0) < 9999) && (
        <div className="bg-zinc-950 text-white border border-zinc-900 p-8 rounded-none relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-none mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Become Premium</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 leading-none">
              Upgrade to Unlock Higher Recipe Limits
            </h2>
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium leading-relaxed mt-2">
              {isPremium 
                ? `You are currently on the ${dbUser?.premiumType?.toUpperCase() || "Premium"} plan (Limit: ${dbUser?.recipeLimit || 0} recipes). Upgrade to a higher tier plan starting from just $4.99 to increase your limits!`
                : "Standard accounts are limited to publishing 2 recipes. Choose from Bronze, Silver, or Gold tiers starting at just $4.99 to publish more recipes and get a verified badge!"
              }
            </p>
          </div>
          <button
            onClick={handleUpgradeToPremium}
            className="relative z-10 px-8 py-3.5 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-black uppercase tracking-widest flex items-center gap-2 rounded-none border-0 transition-colors cursor-pointer"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
