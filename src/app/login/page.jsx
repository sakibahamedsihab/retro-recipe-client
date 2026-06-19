"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Invalid email or password!");
    } else {
      // লগিন সফল হলে ড্যাশবোর্ডে চলে যাবে
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#FFF9E6] border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase text-black inline-block border-b-4 border-black pb-2">
            Welcome Back
          </h2>
          <p className="mt-4 font-medium text-black">
            Login to manage your recipes and favorites.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-black p-3 mb-6 font-bold text-red-700 text-sm uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="chef@recipehub.com"
            />
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC900] text-black font-black uppercase py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b-2 border-black w-1/5"></span>
          <span className="text-xs text-center font-bold uppercase text-gray-600">
            OR
          </span>
          <span className="border-b-2 border-black w-1/5"></span>
        </div>

        <button
          onClick={async () => {
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
            });
          }}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white text-black font-black uppercase py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <FaGoogle className="text-xl text-red-500" /> Sign in with Google
        </button>

        <p className="mt-8 text-center font-medium text-black">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-bold underline decoration-2 underline-offset-4 hover:text-[#FFC900] transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
