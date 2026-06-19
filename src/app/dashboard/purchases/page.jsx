import PurchasesClient from "./PurchasesClient";

// পরবর্তীতে ডাটাবেজ থেকে ইউজারের কেনা রেসিপির পেমেন্ট হিস্ট্রি ফেচ করা হবে
async function getPurchasedRecipes() {
  return [
    {
      _id: "p1",
      recipeName: "Gordon's Ultimate Beef Wellington",
      category: "Dinner",
      cuisineType: "British",
      authorName: "Gordon Ramsay",
      purchaseDate: "2026-06-15",
      price: 4.99,
    },
    {
      _id: "p2",
      recipeName: "Authentic Sushi Platter",
      category: "Lunch",
      cuisineType: "Japanese",
      authorName: "Chef Jiro",
      purchaseDate: "2026-06-10",
      price: 4.99,
    },
    {
      _id: "p3",
      recipeName: "Secret Bakery Chocolate Croissant",
      category: "Dessert",
      cuisineType: "French",
      authorName: "Pierre",
      purchaseDate: "2026-06-01",
      price: 4.99,
    },
  ];
}

export default async function Purchases() {
  const purchases = await getPurchasedRecipes();

  return <PurchasesClient purchases={purchases} />;
}
