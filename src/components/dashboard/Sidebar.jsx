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
} from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: <FaChartPie className="text-xl" />,
    },
    {
      name: "My Recipes",
      href: "/dashboard/my-recipes",
      icon: <FaList className="text-xl" />,
    },
    {
      name: "Add Recipe",
      href: "/dashboard/add-recipe",
      icon: <FaPlus className="text-xl" />,
    },
    {
      name: "Favorites",
      href: "/dashboard/favorites",
      icon: <FaHeart className="text-xl" />,
    },
    {
      name: "Purchases",
      href: "/dashboard/purchases",
      icon: <FaShoppingCart className="text-xl" />,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <FaUser className="text-xl" />,
    },
  ];

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <aside className="w-full md:w-64 bg-[#FFF9E6] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit md:sticky md:top-24">
      <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 text-black">
        Dashboard
      </h2>

      <nav className="flex flex-col space-y-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 font-bold uppercase p-3 border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                isActive
                  ? "bg-[#FFC900] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
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
          className="flex items-center gap-3 font-black uppercase p-3 border-2 border-black bg-black text-white hover:bg-red-500 hover:text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full text-left"
        >
          <FaSignOutAlt className="text-xl" /> Logout
        </button>
      </nav>
    </aside>
  );
}
