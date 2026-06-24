"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "../../lib/auth-client";
import api from "../../lib/api";
import { useToast } from "../providers";
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  UserPlus,
  ArrowRight,
  Utensils,
  Upload,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const uploadToImgBB = async (file) => {
    const apiKey =
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      "c8bc238c92a95c80521e422502693246";
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "ImgBB upload failed");
    }
  };

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters long";
    if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd))
      return "Password must contain at least one lowercase letter";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("Name, email, and password are required", "error");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      showToast(passwordError, "error");
      return;
    }

    setLoading(true);
    let finalImageUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

    try {
      if (imageFile) {
        finalImageUrl = await uploadToImgBB(imageFile);
      }

      await signUp.email(
        {
          email,
          password,
          name,
          image: finalImageUrl,
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
              showToast("Registration successful!", "success");
              router.push("/dashboard");
              router.refresh();
            } catch (syncErr) {
              console.error("JWT synchronization failed:", syncErr);
              showToast(
                "Registration succeeded but session sync failed",
                "error",
              );
            }
          },
          onError: (ctx) => {
            showToast(ctx.error.message || "Registration failed", "error");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 py-16 bg-white dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-8 transition-colors">
        {/* Header Icon Layout */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-none text-zinc-900 dark:text-zinc-50">
            <Utensils className="h-6 w-6 stroke-[2]" />
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
            Create an account
          </h2>
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
            Join our platform of culinary creators
          </p>
        </div>

        {/* Input Fields Forms */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="JOHN DOE"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                required
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <Upload className="h-3.5 w-3.5 text-zinc-400" />
              <span>Profile Image (imgbb)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:border file:border-zinc-200 dark:file:border-zinc-800 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-zinc-50 dark:file:bg-zinc-900 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-900 hover:file:text-white dark:hover:file:bg-zinc-50 dark:hover:file:text-zinc-950 file:transition-colors cursor-pointer rounded-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                placeholder="MINIMUM 6 CHARACTERS"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Action Trigger Block Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-none transition-colors"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-none animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link section */}
        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-zinc-900 hover:underline dark:text-zinc-100 inline-flex items-center gap-1"
          >
            Log in <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}
