"use client";

import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className="my-16 md:my-24 bg-[#FFC900] border-4 border-black p-8 md:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black mb-4">
          Never Miss a Recipe!
        </h2>
        <p className="text-lg font-medium text-black mb-8">
          Subscribe to our weekly newsletter and get the most popular recipes
          delivered straight to your inbox. No spam, just good food!
        </p>

        <form
          className="flex flex-col sm:flex-row gap-4 justify-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full sm:w-2/3 px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-black bg-[#FDFBF7] text-black placeholder-gray-600"
            required
          />
          <button
            type="submit"
            className="bg-black text-white font-black uppercase tracking-wider px-8 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </motion.section>
  );
}
