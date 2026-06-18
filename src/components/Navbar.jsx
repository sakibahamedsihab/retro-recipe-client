"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const navLinks = [
    { label: "Browse Recipes", href: "/recipes" },
    { label: "Favorites", href: "/favorites" },
    { label: "Pricing", href: "/plans" },
  ];

  // রোল অনুযায়ী ড্যাশবোর্ড পাথ ম্যাপিং
  const dashboardLinks = {
    user: "/dashboard/user",
    admin: "/dashboard/admin",
  };

  if (user) {
    navLinks.push({
      label: "Dashboard",
      href: dashboardLinks[user.role] || "/dashboard/user",
    });
  }

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-stone-900 bg-orange-500 text-stone-900 font-bold uppercase select-none">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border-4 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] transition-all">
            <span className="text-2xl font-black text-orange-500">R</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white hidden sm:block">
            Retro <span className="text-stone-900">RecipeHub</span>
          </h1>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-2 bg-white/10 border-4 border-stone-900 rounded-full px-2 py-1 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-full px-4 py-2 text-sm text-stone-900 hover:bg-white hover:text-orange-500 transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Vertical Divider */}
          <div className="h-6 w-1 bg-stone-900 rounded-full" />

          {/* AUTH ACTIONS */}
          <div className="flex items-center gap-4">
            {isPending ? (
              <span className="text-xs">...</span>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">Hi, {user.name.split(" ")[0]}!</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-xs bg-red-400 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] rounded-lg cursor-pointer hover:bg-red-500 active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm text-white hover:underline transition-all"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/recipes/new"
              className="px-5 py-2.5 bg-white border-3 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all rounded-xl text-sm"
            >
              Share Recipe
            </Link>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center rounded-xl border-3 border-stone-900 bg-white p-2 text-stone-900 md:hidden cursor-pointer"
          aria-label="Toggle Menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU ACCORDION */}
      {isMenuOpen && (
        <div className="border-t-4 border-stone-900 bg-orange-400 md:hidden">
          <div className="space-y-3 px-4 py-6">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl border-2 border-stone-900 bg-white px-4 py-3 text-base text-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t-2 border-stone-900 pt-4 flex flex-col gap-3">
              {!user && (
                <Link
                  href="/auth/signin"
                  className="rounded-xl border-2 border-stone-900 bg-stone-100 text-center px-4 py-3 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/recipes/new"
                className="rounded-xl border-2 border-stone-900 bg-white text-center px-4 py-3 text-base text-orange-500 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Share Recipe
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
