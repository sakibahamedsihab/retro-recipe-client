"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Banner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#FFC900] border-4 border-black p-8 md:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden my-12 md:my-24"
    >
      <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tight text-black">
        Share Your Culinary Masterpieces
      </h1>

      <p className="text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed text-black">
        Join the most vibrant community of food enthusiasts. Discover bold new
        flavors, share your secret recipes, and build your ultimate retro recipe
        book.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link
          href="/recipes"
          className="bg-[#FDFBF7] text-black font-black uppercase tracking-wider px-8 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Explore Recipes
        </Link>
        <Link
          href="/register"
          className="bg-black text-white font-black uppercase tracking-wider px-8 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Join the Club
        </Link>
      </div>
    </motion.section>
  );
}
