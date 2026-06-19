"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { showToast } = useToast();

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

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
    try {
      const response = await api.patch("/users/profile", { name, image });
      setDbUser(response.data);
      showToast("Profile updated successfully!", "success");
      await updateSession();
    } catch (error) {
      console.error(error);
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      const response = await api.post("/payments/create-checkout-session", {
        type: "premium",
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      showToast("Stripe checkout session failed", "error");
    }
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
                <span className="px-2.5 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 rounded-none">
                  Premium
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
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Avatar Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="url"
                placeholder="HTTPS://EXAMPLE.COM/AVATAR.JPG"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-transparent text-xs font-semibold focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-50 rounded-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-none border-0 transition-colors"
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-none animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Profile Settings</span>
              </>
            )}
          </button>
        </form>

        {!isPremium && dbUser?.role !== "admin" && (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none p-6 sm:p-8 space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
                <Award className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <span>Upgrade to Premium Membership</span>
                  <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                </h3>
                <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed">
                  Enjoy unlimited recipe creations, a premium verified profile
                  badge, and support the community for a single one-time
                  payment.
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
                Get Premium - $14.99
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
