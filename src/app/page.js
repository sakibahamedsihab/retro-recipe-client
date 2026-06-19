// import Banner from "@/components/Banner";
// import FeaturedRecipes from "@/components/FeaturedRecipes";
// import RecipeCard from "@/components/RecipeCard";

import Banner from "@/components/home/Banner";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";
import PopularRecipes from "@/components/home/PopularRecipes";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Banner />
      <FeaturedRecipes />
      <PopularRecipes />
      <HowItWorks />
      <Newsletter />
    </div>
  );
}
