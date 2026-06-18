// src/lib/api/recipes.js
import { serverFetch, protectedFetch } from "../core/server";

// ১. সমস্ত রেসিপি গেট করা (সার্চ, ফিল্টার ও পেজিনেশন কোয়েরি স্ট্রিং সহ)
export const getRecipes = async (queryString = "") => {
  return serverFetch(`/api/recipes?${queryString}`);
};

// ২. আইডি দিয়ে নির্দিষ্ট একটি রেসিপির ডিটেইলস আনা
export const getRecipeById = async (id) => {
  return serverFetch(`/api/recipes/${id}`);
};

// ৩. লগইন থাকা ইউজারের নিজস্ব ফেভারিট রেসিপি লিস্ট আনা (Protected)
export const getMyFavorites = async () => {
  return protectedFetch("/api/favorites");
};
