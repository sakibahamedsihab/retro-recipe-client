"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../../lib/auth-client";
import api from "../../../lib/api";
import Loader from "../../../components/Loader";
import { useToast } from "../../providers";
import {
  User,
  Image as ImageIcon,
  Save,
  Award,
  Sparkles,
  ShieldCheck,
  Upload,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { showToast } = useToast();

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/users/me");
        setDbUser(response.data);
        setName(response.data.name || "");
        setImage(response.data.image || "");
      } catch (error) {
        console.error(error);
        showToast("Failed to load profile details", "error");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    setSaving(true);
    let finalImageUrl = image;

    try {
      if (imageFile) {
        setUploadingImage(true);
        finalImageUrl = await uploadToImgBB(imageFile);
        setUploadingImage(false);
      }

      const response = await api.patch("/users/profile", { name, image: finalImageUrl });
      setDbUser(response.data);
      setImage(response.data.image || "");
      setImageFile(null);
      showToast("Profile updated successfully!", "success");
      await updateSession();
    } catch (error) {
      console.error(error);
      showToast("Failed to update profile", "error");
    } finally {
      setUploadingImage(false);
      setSaving(false);
    }
  };

  const handleUpgradeToPremium = () => {
    router.push("/dashboard/upgrade");
  };

  if (loading) return <Loader />;

  const isPremium = dbUser?.isPremium;

  return (
    <div className="max-w-2xl mx-auto space-y-10 bg-white dark:bg-zinc-950 p-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Profile Settings
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
          Update your public profile details and manage subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 transition-colors">
          <div className="relative">
            {dbUser?.image ? (
              <img
                src={dbUser.image}
                alt={dbUser.name}
                className="h-24 w-24 object-cover rounded-none border border-zinc-200 dark:border-zinc-800"
              />
            ) : (
              <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-black text-2xl rounded-none">
                {dbUser?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {isPremium && (
              <span className="absolute bottom-0 right-0 p-1.5 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 rounded-none border border-zinc-200 dark:border-zinc-800">
                <Award className="h-4 w-4" />
              </span>
            )}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-base font-black flex items-center justify-center sm:justify-start gap-2 uppercase tracking-wide">
              <span className="text-zinc-900 dark:text-zinc-50">
                {dbUser?.name}
              </span>
              {isPremium && (
                <span className={`px-2.5 py-0.5 border text-[10px] font-bold uppercase tracking-widest rounded-none ${
                  dbUser?.premiumType === "bronze"
                    ? "bg-amber-100 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                    : dbUser?.premiumType === "silver"
                    ? "bg-slate-100 dark:bg-slate-950/20 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-900"
                    : "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900"
                }`}>
                  {dbUser?.premiumType ? `${dbUser.premiumType} Premium` : "Premium"}
                </span>
              )}
            </h2>
            <p className="text-xs font-semibold lowercase tracking-normal text-zinc-500 dark:text-zinc-400">
              {dbUser?.email}
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-black">
              Role: {dbUser?.role}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-6 sm:p-8 space-y-5 transition-colors"
        >
          <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">
            Edit Profile
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="FULL NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <Upload className="h-3.5 w-3.5 text-zinc-400" />
              <span>Upload Avatar Image (imgbb)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:border file:border-zinc-200 dark:file:border-zinc-800 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-zinc-50 dark:file:bg-zinc-900 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-900 hover:file:text-white dark:hover:file:bg-zinc-50 dark:hover:file:text-zinc-950 file:transition-colors cursor-pointer rounded-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="w-full mt-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-none border-0 transition-colors"
          >
            {saving || uploadingImage ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-none animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Profile Settings</span>
              </>
            )}
          </button>
        </form>

        {dbUser?.role !== "admin" && (!isPremium || (dbUser?.recipeLimit || 0) < 9999) && (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-6 sm:p-8 space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
                <Award className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <span>{isPremium ? "Upgrade Your Membership" : "Upgrade to Premium Membership"}</span>
                  <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                </h3>
                <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed">
                  {isPremium
                    ? `You are currently on the ${dbUser?.premiumType?.toUpperCase() || "Premium"} plan. Upgrade your plan to increase your recipe posting limit and get a premium verified badge.`
                    : "Enjoy recipe creations limits based on Bronze, Silver, and Gold tiers, a premium verified profile badge, and support the community."
                  }
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
              <button
                onClick={handleUpgradeToPremium}
                className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer rounded-none border-0"
              >
                {isPremium ? "Upgrade Plan" : "View Plans"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
