import RecipeClientHelper from "./RecipeClientHelper";

// পরবর্তীতে এখানে আমরা আমাদের lib/api.js এর fetchAPI ব্যবহার করে আসল ডেটা আনব।
// আপাতত SSR বোঝানোর জন্য ডামি ডেটা সার্ভারে তৈরি করছি।
async function getRecipes() {
  // Simulating an API call with a slight delay
  return [
    {
      _id: "1",
      recipeName: "Spicy Beef Taco",
      category: "Dinner",
      cuisineType: "Mexican",
      preparationTime: 30,
      authorName: "Shihab",
      likesCount: 120,
    },
    {
      _id: "2",
      recipeName: "Classic Cheeseburger",
      category: "Lunch",
      cuisineType: "American",
      preparationTime: 25,
      authorName: "John Doe",
      likesCount: 95,
    },
    {
      _id: "3",
      recipeName: "Creamy Pasta",
      category: "Dinner",
      cuisineType: "Italian",
      preparationTime: 40,
      authorName: "Jane Smith",
      likesCount: 150,
    },
    {
      _id: "4",
      recipeName: "Retro Pepperoni Pizza",
      category: "Dinner",
      cuisineType: "Italian",
      preparationTime: 45,
      authorName: "Alex",
      likesCount: 320,
    },
    {
      _id: "5",
      recipeName: "Vintage Velvet Cake",
      category: "Dessert",
      cuisineType: "American",
      preparationTime: 60,
      authorName: "Maria",
      likesCount: 285,
    },
    {
      _id: "6",
      recipeName: "Morning Pancakes",
      category: "Breakfast",
      cuisineType: "American",
      preparationTime: 15,
      authorName: "Sakib",
      likesCount: 210,
    },
  ];
}

export default async function BrowseRecipes() {
  const initialRecipes = await getRecipes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Page Header (Server Side Rendered for fast load and SEO) */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-black inline-block bg-[#FFC900] px-6 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          Explore Recipes
        </h1>
        <p className="mt-6 text-lg font-medium text-black max-w-2xl mx-auto">
          Browse through our collection of delicious recipes. Filter by category
          to find exactly what you're craving today.
        </p>
      </div>

      {/* Client Side Helper for Filtering and Interactivity */}
      <RecipeClientHelper initialRecipes={initialRecipes} />
    </div>
  );
}
