// src/lib/actions/recipes.js
"use server";

import { serverMutation } from "../core/server";
import { revalidatePath } from "next/cache";

// ১. নতুন রেসিপি তৈরি করা (POST)
export const createRecipeAction = async (newRecipeData) => {
  const result = await serverMutation("/api/recipes", newRecipeData, "POST");
  revalidatePath("/"); // হোমপেজ বা ব্রাউজ পেজের ক্যাশ ক্লিয়ার করা যাতে নতুন রেসিপি সাথে সাথে দেখায়
  return result;
};

// ২. রেসিপি সফট ডিলিট করা (DELETE)
export const deleteRecipeAction = async (recipeId) => {
  const result = await serverMutation(`/api/recipes/${recipeId}`, {}, "DELETE");
  revalidatePath("/");
  return result;
};

// ৩. রেಸಿপি ফেভারিটে যুক্ত করা (POST)
export const addToFavoritesAction = async (recipeId) => {
  return serverMutation("/api/favorites", { recipeId }, "POST");
};
