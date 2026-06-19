"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "../../lib/auth-client";
import api from "../../lib/api";
import Loader from "../../components/Loader";
import { useToast } from "../providers";
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Heart,
  CreditCard,
  User,
  Users,
  AlertOctagon,
  FileText,
  Menu,
  X,
  ChevronRight,
  Utensils,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: sessionLoading } = useSession();
  const { showToast } = useToast();

  const [dbUser, setDbUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        showToast("Please login to access the dashboard", "info");
        router.push("/login");
      } else {
        api
          .get("/users/me")
          .then((res) => {
            setDbUser(res.data);
            loadingUser && setLoadingUser(false);
          })
          .catch((err) => {
            console.error("Error fetching user profile:", err);
            api
              .post("/jwt", {
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
              })
              .then(() => {
                return api.get("/users/me");
              })
              .then((res) => {
                setDbUser(res.data);
                setLoadingUser(false);
              })
              .catch((jwtErr) => {
                console.error("JWT Sync fail:", jwtErr);
                showToast(
                  "Failed to authenticate session with backend",
                  "error",
                );
                setLoadingUser(false);
              });
          });
      }
    }
  }, [session, sessionLoading]);

  if (sessionLoading || loadingUser) return <Loader />;

  const role = dbUser?.role || "user";

  const userNavigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add Recipe", href: "/dashboard/add-recipe", icon: PlusCircle },
    { name: "My Recipes", href: "/dashboard/my-recipes", icon: BookOpen },
    { name: "My Favorites", href: "/dashboard/favorites", icon: Heart },
    {
      name: "Purchased Recipes",
      href: "/dashboard/purchased",
      icon: CreditCard,
    },
    { name: "Profile Settings", href: "/dashboard/profile", icon: User },
  ];

  const adminNavigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      name: "Manage Recipes",
      href: "/dashboard/admin/recipes",
      icon: BookOpen,
    },
    {
      name: "Recipe Reports",
      href: "/dashboard/admin/reports",
      icon: AlertOctagon,
    },
    {
      name: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: FileText,
    },
    { name: "Profile Settings", href: "/dashboard/profile", icon: User },
  ];

  const navigation = role === "admin" ? adminNavigation : userNavigation;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white dark:bg-zinc-950">
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 rounded-none">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-900 flex items-center gap-3">
          <div className="border border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-none">
            <Utensils className="h-4 w-4 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h2>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
              {role} space
            </p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isCurrent = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-none border ${
                  isCurrent
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 font-black"
                    : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight
                  className={`h-3.5 w-3.5 ${isCurrent ? "block" : "hidden"}`}
                />
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer Flyout */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-zinc-950/40 backdrop-blur-sm">
          <div className="w-64 bg-white dark:bg-zinc-950 h-full flex flex-col border-r border-zinc-200 dark:border-zinc-900 rounded-none animate-in slide-in-from-left duration-150">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Utensils className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                  Dashboard
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer bg-transparent rounded-none transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isCurrent = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-none border ${
                      isCurrent
                        ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950"
                        : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Structural Viewport content frame */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between bg-white border-b border-zinc-200 px-6 py-4 dark:bg-zinc-950 dark:border-zinc-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 cursor-pointer bg-transparent rounded-none transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
            Dashboard
          </span>
          <div className="w-8 h-8 opacity-0 select-none">.</div>
        </header>

        <div className="flex-grow p-6 sm:p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
