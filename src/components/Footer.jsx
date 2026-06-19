import Link from "next/link";
import { Utensils, Mail, Phone, MapPin } from "lucide-react";

const FacebookIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    <rect width="20" height="20" x="2" y="2" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const GithubIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-zinc-100 dark:bg-zinc-950 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-black tracking-tight uppercase text-zinc-900 dark:text-zinc-50"
            >
              <Utensils className="h-5 w-5 stroke-[2.5]" />
              <span>RecipeHub</span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xs">
              A premium recipe sharing platform for culinary enthusiasts to
              create, share, and discover amazing dishes.
            </p>
            <div className="flex flex-col gap-2 mt-4 border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                <span>123 Gourmet Street, Food City</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <Phone className="h-3.5 w-3.5 text-zinc-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                <span>support@recipehub.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Home", "Browse Recipes", "Login", "Register"].map((item) => (
                <li key={item}>
                  <Link
                    href={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors uppercase tracking-wider font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Features */}
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-5">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors uppercase tracking-wider font-medium"
                >
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=Dessert"
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors uppercase tracking-wider font-medium"
                >
                  Dessert Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=Breakfast"
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors uppercase tracking-wider font-medium"
                >
                  Breakfast Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/profile"
                  className="text-xs text-zinc-900 dark:text-zinc-100 hover:underline transition-colors uppercase tracking-wider font-bold"
                >
                  Become Premium &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Socials */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
              Connect
            </h3>
            <div className="flex items-center gap-1">
              {[
                { Icon: FacebookIcon, href: "#" },
                { Icon: TwitterIcon, href: "#" },
                { Icon: InstagramIcon, href: "#" },
                { Icon: GithubIcon, href: "#" },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="p-2.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors rounded-none"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500 mt-2">
              Subscribe to get recipe collections and chef advice delivered
              directly to your inbox.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-wide text-zinc-400 dark:text-zinc-500 uppercase">
            &copy; {currentYear} RecipeHub. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
