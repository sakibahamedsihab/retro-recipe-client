"use client";

import { authClient } from "@/lib/auth-client";
import { FaUtensils, FaHeart, FaStar, FaCrown } from "react-icons/fa";
import Link from "next/link";

export default function DashboardOverview() {
  const { data: session, isPending } = authClient.useSession();

  // ডামি স্ট্যাটস (পরবর্তীতে ব্যাকএন্ড থেকে আসবে)
  const stats = [
    { id: 1, title: "Total Recipes", value: "2", icon: <FaUtensils /> },
    { id: 2, title: "Favorites", value: "15", icon: <FaHeart /> },
    { id: 3, title: "Likes Received", value: "128", icon: <FaStar /> },
  ];

  // আপাতত ডামি প্রিমিয়াম স্ট্যাটাস
  const isPremium = false;

  if (isPending)
    return (
      <div className="text-xl font-black uppercase animate-pulse">
        Loading Dashboard...
      </div>
    );

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
          <div className="bg-black text-[#FFC900] px-6 py-3 border-4 border-[#FFC900] shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] flex items-center gap-3">
            <FaCrown className="text-2xl" />
            <span className="font-black uppercase tracking-widest">
              Premium Member
            </span>
          </div>
        ) : (
          <Link
            href="/dashboard/purchases"
            className="bg-[#FFC900] text-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-3"
          >
            <FaCrown className="text-xl" />
            <span className="font-black uppercase">Upgrade to Premium</span>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
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
