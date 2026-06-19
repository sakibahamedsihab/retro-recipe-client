import Link from "next/link";
import { Home, ChefHat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center py-24 bg-white dark:bg-zinc-950">
      {/* Sharp Border Frame Box instead of Blur Circles */}
      <div className="relative mb-8 p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-none w-28 h-28 flex items-center justify-center">
        <div className="absolute top-[-3px] left-[-3px] w-2 h-2 bg-zinc-900 dark:bg-zinc-50 rounded-none"></div>
        <div className="absolute bottom-[-3px] right-[-3px] w-2 h-2 bg-zinc-900 dark:bg-zinc-50 rounded-none"></div>
        <ChefHat className="h-14 w-14 text-zinc-900 dark:text-zinc-50 stroke-[1.5]" />
      </div>

      {/* Typography & Messages */}
      <h1 className="text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter mb-2 leading-none">
        404
      </h1>
      <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
        Recipe Missing!
      </h2>
      <p className="max-w-xs text-zinc-500 dark:text-zinc-400 mb-8 text-xs uppercase tracking-wider leading-relaxed font-medium">
        Oops! It seems the page you are searching for got burnt or was never
        added to our menu. Let's get you back to the main kitchen.
      </p>

      {/* Strictly Sharp Action Button */}
      <Link
        href="/"
        className="flex items-center gap-2 px-8 py-3.5 text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-black uppercase tracking-widest transition-colors rounded-none"
      >
        <Home className="h-4 w-4" />
        <span>Back to Home Kitchen</span>
      </Link>
    </div>
  );
}
