// src/lib/auth-client.js
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  plugins: [adminClient()],
});

// সহজে ব্যবহারের জন্য ডিভস্ট্রাকচার করে এক্সপোর্ট
export const { signIn, signUp, signOut, useSession } = authClient;
