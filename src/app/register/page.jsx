"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, image, password } = formData;

    // রিকোয়ারমেন্ট অনুযায়ী পাসওয়ার্ড ভ্যালিডেশন
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter!");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter!");
      return;
    }

    setLoading(true);

    // Better Auth এর মাধ্যমে সাইন আপ
    const { data, error: authError } = await authClient.signUp.email({
      email,
      password,
      name,
      image,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Registration failed!");
    } else {
      // রেজিস্ট্রেশন সফল হলে ড্যাশবোর্ডে রিডাইরেক্ট
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#FFF9E6] border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase text-black inline-block border-b-4 border-black pb-2">
            Join the Club
          </h2>
          <p className="mt-4 font-medium text-black">
            Create an account to save and share recipes.
          </p>
        </div>

        {/* এরর মেসেজ দেখানোর জন্য */}
        {error && (
          <div className="bg-red-100 border-2 border-black p-3 mb-6 font-bold text-red-700 text-sm uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="e.g. Gordon Ramsay"
            />
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="chef@recipehub.com"
            />
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-white text-black"
              placeholder="••••••••"
            />
            <p className="text-xs font-bold mt-2 text-gray-700">
              * Min 6 chars, 1 Uppercase, 1 Lowercase required.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC900] text-black font-black uppercase py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
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
          <FaGoogle className="text-xl text-red-500" /> Sign up with Google
        </button>

        <p className="mt-8 text-center font-medium text-black">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold underline decoration-2 underline-offset-4 hover:text-[#FFC900] transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
