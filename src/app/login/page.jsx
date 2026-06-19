"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "../../lib/auth-client";
import api from "../../lib/api";
import { useToast } from "../providers";
import { Mail, Lock, LogIn, ArrowRight, Utensils } from "lucide-react";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="currentColor"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="currentColor"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="currentColor"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="currentColor"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      await signIn.email(
        {
          email,
          password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: async (ctx) => {
            try {
              await api.post("/jwt", {
                email: ctx.data.user.email,
                name: ctx.data.user.name,
                image: ctx.data.user.image,
              });
              showToast("Login successful!", "success");
              router.push("/dashboard");
              router.refresh();
            } catch (syncErr) {
              console.error("JWT synchronization failed:", syncErr);
              showToast("Login succeeded but session sync failed", "error");
            }
          },
          onError: (ctx) => {
            showToast(
              ctx.error.message || "Invalid email or password",
              "error",
            );
          },
        },
      );
    } catch (err) {
      console.error(err);
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      showToast("Google login failed", "error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-16 bg-white dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-8 transition-colors">
        {/* Top Minimal Header Header */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
            <Utensils className="h-6 w-6 stroke-[2]" />
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
            Log in to your artisan kitchen space
          </p>
        </div>

        {/* Credentials Form fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                placeholder="NAME@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-none transition-colors border-0"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-none animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Separator block lines */}
        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-zinc-200 dark:border-zinc-900"></div>
          <span className="flex-shrink mx-4 text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            Or continue with
          </span>
          <div className="flex-grow border-t border-zinc-200 dark:border-zinc-900"></div>
        </div>

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 px-4 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 bg-transparent text-zinc-800 dark:text-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-none"
        >
          <GoogleIcon />
          <span>Google Account</span>
        </button>

        {/* Footer Navigation Redirection */}
        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-zinc-900 hover:underline dark:text-zinc-100 inline-flex items-center gap-1"
          >
            Register free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}
