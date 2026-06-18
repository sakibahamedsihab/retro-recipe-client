// src/lib/core/server.js
import { redirect } from "next/navigation";
import { getUserToken } from "./session";

// আপনার ব্যাকএন্ড রেন্ডার সার্ভারের লাইভ বেইজ URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// Better-Auth এর টোকেন রিড করে Authorization হেডার তৈরি করার মেথড
export const authHeader = async () => {
  const token = await getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ১. সাধারণ পাবলিক ডেটা ফেচিং (GET)
export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);
  return handleStatusCode(res);
};

// ২. টোকেন-সিকিউরড প্রাইভেট ডেটা ফেচিং (GET + Auth Token)
export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: await authHeader(),
  });
  return handleStatusCode(res);
};

// ৩. ডাটা রাইট/মিউটেশন মেথড (POST, PATCH, PUT, DELETE)
export const serverMutation = async (path, data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });
  return handleStatusCode(res);
};

// ৪. সেন্ট্রাল স্ট্যাটাস কোড ও রিডাইরেক্ট গেটওয়ে হ্যান্ডলার
const handleStatusCode = (res) => {
  if (res.status === 401) {
    redirect("/unauthorized"); // টোকেন ইনভ্যালিড হলে সরাসরি রিডাইরেক্ট
  }
  if (res.status === 403) {
    redirect("/forbidden"); // ব্লকড বা রেস্ট্রিক্টেড হলে সরাসরি রিডাইরেক্ট
  }
  return res.json();
};
