import RecipeClientHelper from "./RecipeClientHelper";

export const metadata = {
  title: "Explore Recipes | Retro RecipeHub",
  description:
    "Browse through our collection of delicious recipes shared by the community. Filter by category and find exactly what you're craving.",
};

export default function BrowseRecipes() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Page Header (Server Side Rendered for fast load and SEO) */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-black inline-block bg-[#FFC900] px-6 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          Explore Recipes
        </h1>
        <p className="mt-6 text-lg font-medium text-black max-w-2xl mx-auto">
          Browse through our collection of delicious recipes. Filter by category
          to find exactly what you&apos;re craving today.
        </p>
      </div>

      {/* Client Side Component handles live fetching, filtering, search, pagination */}
      <RecipeClientHelper />
    </div>
  );
}
