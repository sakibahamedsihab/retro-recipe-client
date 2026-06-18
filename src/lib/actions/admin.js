// src/lib/actions/admin.js
"use server";

import { serverMutation } from "../core/server";
import { revalidatePath } from "next/cache";

// ১. কোনো ইউজার কোনো রেসিপির বিরুদ্ধে রিপোর্ট সাবমিট করলে (POST)
export const submitRecipeReportAction = async (reportData) => {
  return serverMutation("/api/reports", reportData, "POST");
};

// ২. অ্যাডমিন কোনো রিপোর্ট দেখে রেসিপি ডিলিট/ব্যান করে দিলে (DELETE)
export const adminBanRecipeAction = async (recipeId) => {
  const result = await serverMutation(
    `/api/admin/recipes/${recipeId}`,
    {},
    "DELETE",
  );
  revalidatePath("/dashboard/admin/reports"); // অ্যাডমিন ড্যাশবোর্ডের ক্যাশ রিভ্যালিডেট করা হলো
  return result;
};

// ৩. স্টাইপ পেমেন্ট সফল হওয়ার পর ইউজার সাবস্ক্রিপশন সিঙ্ক করা (POST)
export const syncPremiumSubscriptionAction = async (paymentInfo) => {
  const result = await serverMutation(
    "/api/payments/success",
    paymentInfo,
    "POST",
  );
  revalidatePath("/dashboard/seeker/billing");
  return result;
};
