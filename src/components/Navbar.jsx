"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../app/providers";
import { useSession, signOut } from "../lib/auth-client";
import {
  Menu,
  X,
  Sun,
  Moon,
  Utensils,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout sync failed:", error);
    }
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Recipes", href: "/browse" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/90 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-black tracking-tight uppercase text-zinc-900 dark:text-zinc-50"
            >
              <Utensils className="h-5 w-5 stroke-[2.5]" />
              <span>RecipeHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 h-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs uppercase tracking-widest font-semibold transition-colors h-full flex items-center border-b-2 relative top-[1px] ${
                      isActive
                        ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                        : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors rounded-none"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-zinc-400 hover:text-zinc-50" />
              ) : (
                <Moon className="h-4 w-4 text-zinc-600 hover:text-zinc-900" />
              )}
            </button>

            {/* User State */}
            {isPending ? (
              <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-none border border-zinc-200 dark:border-zinc-800" />
            ) : session ? (
              <div className="flex items-center gap-4 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 p-1 bg-zinc-50 dark:bg-zinc-900 rounded-none">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-6 w-6 object-cover rounded-none"
                    />
                  ) : (
                    <div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 rounded-none">
                      <UserIcon className="h-3 w-3" />
                    </div>
                  )}
                  <span className="text-xs font-semibold max-w-[90px] truncate pr-1 text-zinc-800 dark:text-zinc-200">
                    {session.user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-500"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors rounded-none"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Action Controls */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 border border-zinc-100 dark:border-zinc-800 transition-colors rounded-none"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-zinc-400" />
              ) : (
                <Moon className="h-4 w-4 text-zinc-600" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-zinc-100 dark:border-zinc-800 transition-colors rounded-none"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block py-2 text-xs font-bold uppercase tracking-wider rounded-none ${
                pathname === link.href
                  ? "text-zinc-900 dark:text-zinc-50 underline underline-offset-4"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {session ? (
            <div className="border-t border-zinc-100 dark:border-zinc-900 mt-4 pt-4 space-y-3">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
              >
                Dashboard
              </Link>
              <div className="flex items-center justify-between py-2 border-t border-zinc-50 dark:border-zinc-900 mt-2">
                <span className="text-xs font-medium text-zinc-500">
                  User:{" "}
                  <strong className="text-zinc-900 dark:text-zinc-50 font-semibold">
                    {session.user.name}
                  </strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center py-2.5 text-xs font-bold uppercase tracking-wider border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-none"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-950 rounded-none"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
