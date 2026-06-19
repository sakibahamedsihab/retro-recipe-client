import RecipeDetailsClient from "./RecipeDetailsClient";
import { notFound } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getRecipeDetails(id) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/recipes/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const recipe = await getRecipeDetails(id);
  if (!recipe) return { title: "Recipe Not Found | Retro RecipeHub" };
  return {
    title: `${recipe.recipeName} | Retro RecipeHub`,
    description: `${recipe.recipeName} by ${recipe.authorName} – ${recipe.category} recipe.`,
  };
}

export default async function RecipeDetails({ params }) {
  const { id } = await params;
  const recipe = await getRecipeDetails(id);

  if (!recipe) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <RecipeDetailsClient recipe={recipe} />
    </div>
  );
}
