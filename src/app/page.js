export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 text-stone-900 p-8 text-center">
      <h1 className="text-5xl font-black tracking-tight md:text-7xl uppercase">
        Retro <span className="text-orange-500">RecipeHub</span>
      </h1>
      <p className="mt-4 text-lg font-bold text-stone-600 max-w-md">
        A modern-retro space to share recipes, inspire foodies, and cook
        together.
      </p>

      {/* ইনলাইন ক্লাস দিয়ে তৈরি রেট্রো বাটন: মোটা কালো বর্ডার এবং ড্রপ শ্যাডো */}
      <button className="mt-8 px-8 py-4 font-black text-xl uppercase bg-orange-500 text-stone-900 border-4 border-stone-900 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all rounded-xl cursor-pointer">
        Browse Recipes
      </button>
    </div>
  );
}
