import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#FDFBF7] border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-black text-black uppercase tracking-tight"
          >
            RecipeHub
          </Link>

          {/* Quick Links */}
          <div className="hidden md:flex space-x-8 font-medium">
            <Link
              href="/"
              className="text-black hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Home
            </Link>
            <Link
              href="/recipes"
              className="text-black hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Browse Recipes
            </Link>
          </div>

          {/* Auth Links */}
          <div className="flex space-x-4 items-center font-bold">
            <Link
              href="/login"
              className="text-black hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Login
            </Link>
            {/* Retro Style Button */}
            <Link
              href="/register"
              className="bg-[#FFC900] text-black px-5 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
