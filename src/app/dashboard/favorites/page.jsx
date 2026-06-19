import FavoritesClient from "./FavoritesClient";

// পরবর্তীতে ডাটাবেজ থেকে ইউজারের ফেভারিট রেসিপি ফেচ করা হবে
async function getFavoriteRecipes() {
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
      _id: "3",
      recipeName: "Creamy Pasta",
      category: "Dinner",
      cuisineType: "Italian",
      preparationTime: 40,
      authorName: "Jane Smith",
      likesCount: 150,
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
  ];
}

export default async function Favorites() {
  const initialFavorites = await getFavoriteRecipes();

  return <FavoritesClient initialFavorites={initialFavorites} />;
}
