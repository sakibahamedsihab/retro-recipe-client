// src/lib/core/session.js
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

// কারেন্ট লগইন থাকা ইউজারের সেশন ডেটা আনা (সার্ভার সাইড)
export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
};

// টোকেন আইডি রিট্রিভ করা (ফেচ রিকোয়েস্টের হেডারে পাঠানোর জন্য)
export const getUserToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.session?.token || null;
};

// কঠোর রোল ভ্যালিডেশন গার্ড (যেমন: অ্যাডমিন পেজ বা ড্যাশবোর্ড প্রোটেকশন)
export const requireRole = async (role) => {
  const user = await getUserSession();
  if (!user) {
    redirect("/auth/signin");
  }
  if (user?.role !== role) {
    redirect("/unauthorized"); // রোল ম্যাচ না করলে সরাসরি আনঅথরাইজড পেজে রিডাইরেক্ট
  }
  return user;
};
