"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FaUtensils, FaHeart, FaStar, FaCrown } from "react-icons/fa";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DashboardOverview() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikesReceived: 0,
  });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch user profile first to check role
        const profileRes = await fetch(`${BACKEND}/api/users/me`, {
          credentials: "include",
        });
        let profileData = null;
        if (profileRes.ok) {
          profileData = await profileRes.json();
        }

        // Redirect admin to admin panel — they have a separate experience
        if (profileData?.role === "admin") {
          router.replace("/dashboard/admin");
          return;
        }

        // Fetch user stats for normal users
        const statsRes = await fetch(
          `${BACKEND}/api/users/dashboard-stats`,
          { credentials: "include" }
        );
        let statsData = { totalRecipes: 0, totalFavorites: 0, totalLikesReceived: 0 };
        if (statsRes.ok) {
          statsData = await statsRes.json();
        }

        setStats(statsData);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, router]);

  const handleUpgradeToPremium = async () => {
    setPaymentLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ type: "premium" }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // Stripe checkout-এ রিডাইরেক্ট
        }
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to initiate premium checkout.");
      }
    } catch (error) {
      console.error("Premium checkout error:", error);
      alert("Something went wrong connecting to payment gateway!");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (sessionPending || loading) {
    return (
      <div className="text-xl font-black uppercase animate-pulse p-8">
        Loading Dashboard...
      </div>
    );
  }

  const isPremium = userProfile?.isPremium || false;

  const statsItems = [
    { id: 1, title: "Total Recipes", value: stats.totalRecipes, icon: <FaUtensils /> },
    { id: 2, title: "Favorites", value: stats.totalFavorites, icon: <FaHeart /> },
    { id: 3, title: "Likes Received", value: stats.totalLikesReceived, icon: <FaStar /> },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome & Premium Badge Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b-4 border-black pb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black mb-2">
            Welcome, {session?.user?.name?.split(" ")[0] || "Chef"}!
          </h1>
          <p className="font-medium text-lg text-black">
            Here is what's happening in your kitchen today.
          </p>
        </div>

        {/* Premium Status Badge */}
        {isPremium ? (
          <div className="bg-black text-[#FFC900] px-6 py-3 border-4 border-[#FFC900] shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] flex items-center gap-3 animate-pulse">
            <FaCrown className="text-2xl" />
            <span className="font-black uppercase tracking-widest">
              Premium Member
            </span>
          </div>
        ) : (
          <button
            onClick={handleUpgradeToPremium}
            disabled={paymentLoading}
            className="bg-[#FFC900] text-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-3 font-black uppercase disabled:opacity-50 cursor-pointer"
          >
            <FaCrown className="text-xl" />
            <span>{paymentLoading ? "Processing..." : "Upgrade to Premium"}</span>
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statsItems.map((stat) => (
          <div
            key={stat.id}
            className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6 hover:-translate-y-2 transition-transform"
          >
            <div className="bg-[#FFF9E6] w-16 h-16 border-4 border-black flex items-center justify-center text-3xl text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {stat.icon}
            </div>
            <div>
              <p className="text-black font-bold uppercase text-sm mb-1">
                {stat.title}
              </p>
              <h3 className="text-4xl font-black text-black">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-black uppercase mb-6 text-black inline-block border-b-4 border-black pb-1">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/add-recipe"
            className="bg-black text-white px-6 py-3 font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#FFC900] hover:text-black transition-all"
          >
            + Add New Recipe
          </Link>
          <Link
            href="/recipes"
            className="bg-white text-black px-6 py-3 font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#FFF9E6] transition-all"
          >
            Explore Community
          </Link>
        </div>
      </div>
    </div>
  );
}
