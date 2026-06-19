"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaChartPie,
  FaList,
  FaPlus,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaShieldAlt,
  FaUsers,
  FaUtensils,
  FaFlag,
  FaSpinner,
} from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [role, setRole] = useState(null); // null = loading

  useEffect(() => {
    if (!session) return;
    const fetchRole = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setRole(data.role || "user");
        }
      } catch {
        setRole("user");
      }
    };
    fetchRole();
  }, [session]);

  // ── Navigation links per role ────────────────────────────────────────────
  const userLinks = [
    { name: "Overview", href: "/dashboard", icon: <FaChartPie className="text-xl" /> },
    { name: "My Recipes", href: "/dashboard/my-recipes", icon: <FaList className="text-xl" /> },
    { name: "Add Recipe", href: "/dashboard/add-recipe", icon: <FaPlus className="text-xl" /> },
    { name: "Favorites", href: "/dashboard/favorites", icon: <FaHeart className="text-xl" /> },
    { name: "Purchases", href: "/dashboard/purchases", icon: <FaShoppingCart className="text-xl" /> },
    { name: "Profile", href: "/dashboard/profile", icon: <FaUser className="text-xl" /> },
  ];

  const adminLinks = [
    { name: "Admin Panel", href: "/dashboard/admin", icon: <FaShieldAlt className="text-xl text-[#FFC900]" /> },
    { name: "Manage Users", href: "/dashboard/admin?tab=Users", icon: <FaUsers className="text-xl" /> },
    { name: "Manage Recipes", href: "/dashboard/admin?tab=Recipes", icon: <FaUtensils className="text-xl" /> },
    { name: "Reports", href: "/dashboard/admin?tab=Reports", icon: <FaFlag className="text-xl" /> },
    { name: "Profile", href: "/dashboard/profile", icon: <FaUser className="text-xl" /> },
  ];

  const navLinks = role === "admin" ? adminLinks : userLinks;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/login") },
    });
  };

  return (
    <aside className="w-full md:w-64 bg-[#FFF9E6] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit md:sticky md:top-24">
      {/* Title changes based on role */}
      <h2 className="text-2xl font-black uppercase mb-2 border-b-4 border-black pb-2 text-black">
        {role === "admin" ? "Admin" : "Dashboard"}
      </h2>
      {role === "admin" && (
        <p className="text-xs font-black uppercase text-[#FFC900] bg-black px-2 py-1 inline-block mb-4">
          ⚡ Admin Access
        </p>
      )}

      {role === null ? (
        <div className="flex items-center gap-2 py-4 font-bold uppercase text-sm animate-pulse">
          <FaSpinner className="animate-spin" /> Loading...
        </div>
      ) : (
        <nav className="flex flex-col space-y-3">
          {navLinks.map((link) => {
            // For admin tab links, match by pathname only
            const isActive =
              link.href === "/dashboard/admin"
                ? pathname === "/dashboard/admin"
                : pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 font-bold uppercase p-3 border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  isActive
                    ? role === "admin"
                      ? "bg-black text-[#FFC900] shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] -translate-y-1"
                      : "bg-[#FFC900] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                    : role === "admin"
                    ? "bg-[#1a1a1a] text-white hover:bg-black"
                    : "bg-white text-black hover:bg-[#FFC900]"
                }`}
              >
                {link.icon} {link.name}
              </Link>
            );
          })}

          <div className="border-t-4 border-black my-4"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 font-black uppercase p-3 border-2 border-black bg-black text-white hover:bg-red-500 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full text-left cursor-pointer"
          >
            <FaSignOutAlt className="text-xl" /> Logout
          </button>
        </nav>
      )}
    </aside>
  );
}
