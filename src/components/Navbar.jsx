"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  // Better Auth এর হুক ব্যবহার করে সেশন এবং লোডিং স্টেট নেওয়া
  const { data: session, isPending } = authClient.useSession();

  // সেশন চেঞ্জ হলে ব্যাকএন্ডের সাথে JWT সিঙ্ক করার জন্য useEffect
  useEffect(() => {
    const syncSession = async () => {
      if (session?.user) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jwt`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image || "",
            }),
          });
        } catch (error) {
          console.error("Failed to sync session with backend:", error);
        }
      }
    };
    syncSession();
  }, [session]);

  // লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to logout from backend:", error);
    }

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // লগআউট হলে লগইন পেজে রিডাইরেক্ট হবে
        },
      },
    });
  };

  return (
    <nav className="bg-[#FDFBF7] border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-black text-black uppercase tracking-tight"
          >
            RecipeHub
          </Link>

          {/* Quick Links */}
          <div className="hidden md:flex space-x-8 font-medium">
            <Link
              href="/"
              className="text-black hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Home
            </Link>
            <Link
              href="/recipes"
              className="text-black hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Browse Recipes
            </Link>
            {/* ইউজার লগইন থাকলে মেনুবারে ড্যাশবোর্ড লিংক দেখাবে */}
            {session && (
              <Link
                href="/dashboard"
                className="text-black hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Links Area */}
          <div className="flex space-x-4 items-center font-bold">
            {isPending ? (
              // সেশন চেক করার সময় ছোট্ট একটা রেট্রো টেক্সট লোডার
              <span className="text-xs font-bold uppercase animate-pulse tracking-wider">
                Checking...
              </span>
            ) : session ? (
              // ইউজার লগইন থাকলে এই অংশটুকু দেখাবে
              <div className="flex items-center gap-4">
                {/* User Profile Info Badge */}
                <div className="flex items-center gap-2 border-2 border-black bg-[#FFF9E6] px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-6 h-6 border border-black object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-[#FFC900] border border-black flex items-center justify-center text-xs font-black">
                      {session.user.name?.[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-black hidden sm:inline-block max-w-[100px] truncate uppercase tracking-tight">
                    {session.user.name}
                  </span>
                </div>

                {/* Retro Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-black text-white text-xs px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            ) : (
              // ইউজার লগইন না থাকলে আগের মতো Login/Register দেখাবে
              <>
                <Link
                  href="/login"
                  className="text-black hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#FFC900] text-black px-5 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
