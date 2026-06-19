"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "../lib/api";
import Loader from "../components/Loader";
import {
  ChefHat,
  ArrowRight,
  Heart,
  Clock,
  Award,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, popularRes] = await Promise.all([
          api.get("/recipes/featured"),
          api.get("/recipes/popular"),
        ]);
        setFeatured(featuredRes.data);
        setPopular(popularRes.data);
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-zinc-950">
      {/* Banner / Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 text-white py-28 md:py-36 px-6 border-b border-zinc-900">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-none"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover the Art of Cooking</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-none uppercase"
          >
            Share Recipes. Inspire Foodies.{" "}
            <span className="text-zinc-400 block md:inline">
              Cook Together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs md:text-sm text-zinc-400 max-w-xl uppercase tracking-wider font-medium leading-relaxed"
          >
            Welcome to RecipeHub, the premier social space where culinary
            hobbyists and professional chefs alike share recipes, favorite
            details, and learn new cooking secrets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-4"
          >
            <Link
              href="/browse"
              className="px-8 py-3.5 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-black uppercase tracking-widest flex items-center gap-2 rounded-none transition-colors"
            >
              <span>Browse Recipes</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-200 text-xs font-black uppercase tracking-widest rounded-none transition-colors"
            >
              Join the Hub
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Section 1: Featured Recipes */}
      <section className="py-24 bg-white dark:bg-zinc-950 px-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Handpicked for you
              </span>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight mt-1">
                Featured Recipes
              </h2>
            </div>
            <Link
              href="/browse"
              className="text-xs font-bold uppercase tracking-widest text-zinc-900 hover:underline dark:text-zinc-50 flex items-center gap-1 mt-4 md:mt-0"
            >
              View all recipes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16 text-xs uppercase tracking-wider font-bold text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800">
              No featured recipes yet. Admins feature them from the dashboard!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none overflow-hidden group flex flex-col h-full hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors duration-200"
                >
                  <div className="relative h-48 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900">
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
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 uppercase tracking-wide line-clamp-1 mb-3">
                      {recipe.recipeName}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{recipe.preparationTime} mins</span>
                      </div>
                      <span>{recipe.cuisineType}</span>
                    </div>
                    <Link
                      href={`/recipes/${recipe._id}`}
                      className="mt-4 w-full py-2.5 text-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-950 font-bold text-xs uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-transparent dark:hover:border-transparent transition-colors text-zinc-800 dark:text-zinc-200 rounded-none"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Section 2: Popular Recipes */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Trending recipes
            </span>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight mt-1">
              Popular Recipes
            </h2>
          </div>

          {popular.length === 0 ? (
            <div className="text-center py-16 text-xs uppercase tracking-wider font-bold text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800">
              No recipes added yet. Be the first!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popular.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none overflow-hidden group flex flex-col h-full hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors duration-200"
                >
                  <div className="relative h-48 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900">
                    <img
                      src={
                        recipe.recipeImage ||
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"
                      }
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute top-0 left-0 px-2.5 py-1 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 rounded-none">
                      <Heart className="h-3 w-3 fill-current" />
                      <span>{recipe.likesCount}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 uppercase tracking-wide line-clamp-1 mb-1">
                      {recipe.recipeName}
                    </h3>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
                      By {recipe.authorName}
                    </p>
                    <Link
                      href={`/recipes/${recipe._id}`}
                      className="mt-auto w-full py-2.5 text-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-950 font-bold text-xs uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-transparent dark:hover:border-transparent transition-colors text-zinc-800 dark:text-zinc-200 rounded-none"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Static Section 1: Membership Benefits */}
      <section className="py-24 bg-zinc-950 text-white px-6 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-left"
          >
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Become a premium member
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-2 mb-6 leading-none">
              Unlock Unlimited Sharing & Get Your Badge
            </h2>
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium leading-relaxed mb-8">
              Are you a foodie with tons of custom recipes to share? Free
              members can publish up to 2 recipes, but upgrading to Premium
              gives you unlimited uploads, a verified premium badge, and
              exclusive community features.
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-black uppercase tracking-widest rounded-none transition-colors"
            >
              <span>Get Premium Membership</span>
              <Award className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
          >
            {[
              {
                Icon: Sparkles,
                title: "Unlimited Recipes",
                desc: "Share your entire cookbook with our global community without limits.",
              },
              {
                Icon: Award,
                title: "Premium Badge",
                desc: "Get a premium badge on your profile and recipe cards to stand out.",
              },
              {
                Icon: ShieldCheck,
                title: "Stripe Checkout",
                desc: "Safe, secure one-click checkout powered by Stripe systems.",
              },
              {
                Icon: ChefHat,
                title: "Exclusive Purchases",
                desc: "Earn income by placing paywalls on your masterpiece recipes.",
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="p-6 border border-zinc-800 bg-zinc-900/40 rounded-none"
              >
                <benefit.Icon className="h-5 w-5 text-zinc-400 mb-4" />
                <h3 className="font-bold uppercase tracking-wider text-sm mb-2">
                  {benefit.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Additional Static Section 2: How It Works */}
      <section className="py-24 bg-white dark:bg-zinc-950 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Simple & Easy
          </span>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight mt-1 mb-20">
            How RecipeHub Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                num: "1",
                title: "Join & Customize",
                desc: "Create your account in seconds. Customize your chef name, picture, and toggle dark/light theme to fit your look.",
              },
              {
                num: "2",
                title: "Share & Publish",
                desc: "Write recipes with detailed instructions, preparation time, and upload photos. Edit or delete them anytime.",
              },
              {
                num: "3",
                title: "Discover & Support",
                desc: "Find recipes through filters, add them to favorites, like them, or buy exclusive recipes using Stripe payments.",
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div className="h-12 w-12 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 flex items-center justify-center font-black text-sm mb-6 rounded-none bg-zinc-50 dark:bg-zinc-900">
                  {step.num}
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
