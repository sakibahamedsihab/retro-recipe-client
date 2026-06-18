// src/lib/api/admin.js
import { protectedFetch } from "../core/server";

// ১. অ্যাডমিনের জন্য সমস্ত রিপোর্টেড রেসিপির তালিকা আনা
export const getReportedRecipes = async () => {
  return protectedFetch("/api/admin/reports");
};

// ২. সিস্টেমের মোট রেসিপি, ইউজার এবং প্রিমিয়াম মেম্বারদের স্ট্যাটস আনা
export const getSystemStats = async () => {
  return protectedFetch("/api/admin/stats");
};

// ৩. অ্যাডমিন প্যানেল থেকে সমস্ত পেমেন্ট হিস্ট্রি ট্র্যাক করা
export const getAllPaymentHistory = async () => {
  return protectedFetch("/api/admin/payments");
};
