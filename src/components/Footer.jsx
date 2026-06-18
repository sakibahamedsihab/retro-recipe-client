import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-stone-900 bg-stone-900 text-stone-100 font-medium select-none">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row border-b border-stone-800 pb-8">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 border-2 border-stone-100 text-stone-900 font-black text-xl">
              R
            </div>
            <span className="text-lg font-black text-white uppercase tracking-wider">
              Retro RecipeHub
            </span>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-400 font-bold uppercase">
            <Link
              href="/recipes"
              className="hover:text-orange-500 transition-colors"
            >
              Recipes
            </Link>
            <Link
              href="/plans"
              className="hover:text-orange-500 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="hover:text-orange-500 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/privacy"
              className="hover:text-orange-500 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-stone-500 md:flex-row">
          <p>© {new Date().getFullYear()} — Retro RecipeHub. Cook with Vibe.</p>
          <p className="font-bold text-stone-600">
            Built with Next.js & Better-Auth
          </p>
        </div>
      </div>
    </footer>
  );
}
