import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FDFBF7] border-t-2 border-black text-black py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">
            RecipeHub
          </h3>
          <p className="text-base font-medium leading-relaxed">
            A centralized space for culinary inspiration. Discover new flavors
            and share your recipes with the community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold uppercase mb-4 border-b-2 border-black inline-block pb-1">
            Menu
          </h4>
          <ul className="space-y-3 font-medium">
            <li>
              <Link
                href="/"
                className="hover:underline decoration-2 underline-offset-4"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/recipes"
                className="hover:underline decoration-2 underline-offset-4"
              >
                Browse Recipes
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="hover:underline decoration-2 underline-offset-4"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h4 className="text-lg font-bold uppercase mb-4 border-b-2 border-black inline-block pb-1">
            Connect
          </h4>
          <div className="flex space-x-4 mb-4 font-medium">
            <a
              href="#"
              className="hover:underline decoration-2 underline-offset-4"
            >
              Facebook
            </a>
            <a
              href="#"
              className="hover:underline decoration-2 underline-offset-4"
            >
              Twitter
            </a>
            <a
              href="#"
              className="hover:underline decoration-2 underline-offset-4"
            >
              Instagram
            </a>
          </div>
          <p className="font-medium">support@recipehub.com</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t-2 border-black mt-10 pt-6 text-center font-bold text-sm uppercase tracking-wide">
        &copy; {new Date().getFullYear()} RecipeHub. All rights reserved.
      </div>
    </footer>
  );
}
