import RecipeDetailsClient from "./RecipeDetailsClient";

// পরবর্তীতে এখানে API কল করে আসল ডেটা আনব। আপাতত ডামি ডেটা।
async function getRecipeDetails(id) {
  return {
    _id: id,
    recipeName: "Retro Pepperoni Pizza",
    recipeImage: "", // ফাঁকা রাখলাম যাতে ফলব্যাক ক্রিম কালার দেখা যায়
    category: "Dinner",
    cuisineType: "Italian",
    preparationTime: 45,
    difficultyLevel: "Medium",
    authorName: "Alex",
    likesCount: 320,
    ingredients: [
      "2 cups all-purpose flour",
      "1 cup water",
      "2 tbsp olive oil",
      "1/2 cup tomato sauce",
      "1.5 cups mozzarella cheese",
      "Sliced pepperoni",
      "1 tsp oregano",
    ],
    instructions:
      "1. Mix flour and water to make the dough.\n2. Roll the dough into a circle.\n3. Spread the tomato sauce evenly over the dough.\n4. Sprinkle mozzarella cheese and place pepperoni slices on top.\n5. Bake in a preheated oven at 400°F (200°C) for 15-20 minutes until the crust is golden and cheese is bubbly.",
  };
}

export default async function RecipeDetails({ params }) {
  const { id } = await params;
  const recipe = await getRecipeDetails(id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <RecipeDetailsClient recipe={recipe} />
    </div>
  );
}
