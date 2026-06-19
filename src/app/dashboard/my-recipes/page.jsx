import MyRecipesClient from "./MyRecipesClient";

// পরবর্তীতে এখানে ডাটাবেজ/API থেকে ইউজারের আসল রেসিপি ফেচ করা হবে
async function getMyRecipes() {
  return [
    {
      _id: "1",
      title: "Spicy Beef Taco",
      category: "Dinner",
      date: "2026-06-15",
      likes: 120,
    },
    {
      _id: "2",
      title: "Morning Pancakes",
      category: "Breakfast",
      date: "2026-06-18",
      likes: 45,
    },
    {
      _id: "3",
      title: "Retro Pepperoni Pizza",
      category: "Dinner",
      date: "2026-06-19",
      likes: 320,
    },
  ];
}

export default async function MyRecipes() {
  const initialRecipes = await getMyRecipes();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <MyRecipesClient initialRecipes={initialRecipes} />
    </div>
  );
}
