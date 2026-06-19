"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaImage, FaSave } from "react-icons/fa";

export default function MyRecipesClient() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editFormData, setEditFormData] = useState({
    recipeName: "",
    recipeImage: "",
    category: "",
    cuisineType: "",
    preparationTime: "",
    difficultyLevel: "Easy",
    ingredients: "",
    instructions: "",
  });
  const [editUploading, setEditUploading] = useState(false);
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recipes/my-recipes`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setRecipes(data);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recipes/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (res.ok) {
          setRecipes(recipes.filter((recipe) => recipe._id !== id));
        } else {
          const data = await res.json().catch(() => ({}));
          alert(data.message || "Failed to delete recipe.");
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Something went wrong connecting to server!");
      }
    }
  };

  const handleStartEdit = (recipe) => {
    setEditingRecipe(recipe);
    setEditFormData({
      recipeName: recipe.recipeName || "",
      recipeImage: recipe.recipeImage || "",
      category: recipe.category || "Breakfast",
      cuisineType: recipe.cuisineType || "",
      preparationTime: recipe.preparationTime || "",
      difficultyLevel: recipe.difficultyLevel || "Easy",
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join("\n") : recipe.ingredients || "",
      instructions: recipe.instructions || "",
    });
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditUploading(true);
    const body = new FormData();
    body.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: body,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEditFormData((prev) => ({ ...prev, recipeImage: data.data.url }));
      } else {
        alert("Failed to upload image to ImgBB");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Error uploading image");
    } finally {
      setEditUploading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitLoading(true);

    const ingredientsArray = editFormData.ingredients
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recipes/${editingRecipe._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...editFormData,
            ingredients: ingredientsArray,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setRecipes(
          recipes.map((r) =>
            r._id === editingRecipe._id ? { ...r, ...data.recipe } : r
          )
        );
        setEditingRecipe(null);
        alert("Recipe updated successfully!");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to update recipe.");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Something went wrong connecting to server!");
    } finally {
      setEditSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-xl font-black uppercase animate-pulse p-8">
        Loading recipes...
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 border-b-4 border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            My Recipes
          </h1>
          <p className="font-medium text-lg text-black mt-2">
            Manage your uploaded culinary masterpieces here.
          </p>
        </div>
        <Link
          href="/dashboard/add-recipe"
          className="bg-[#FFC900] text-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black uppercase transition-all whitespace-nowrap"
        >
          + Add New
        </Link>
      </div>

      <div className="overflow-x-auto bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#FFC900] border-b-4 border-black text-black font-black uppercase tracking-wider">
              <th className="p-4 border-r-4 border-black">Recipe Name</th>
              <th className="p-4 border-r-4 border-black">Category</th>
              <th className="p-4 border-r-4 border-black text-center">Likes</th>
              <th className="p-4 border-r-4 border-black">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe, index) => (
              <tr
                key={recipe._id}
                className={`border-b-4 border-black last:border-b-0 ${index % 2 === 0 ? "bg-[#FFF9E6]" : "bg-white"} hover:bg-[#f0e6d2] transition-colors`}
              >
                <td className="p-4 border-r-4 border-black font-bold uppercase text-black">
                  {recipe.recipeName}
                </td>
                <td className="p-4 border-r-4 border-black font-medium text-black">
                  {recipe.category}
                </td>
                <td className="p-4 border-r-4 border-black font-bold text-black text-center">
                  {recipe.likesCount || 0}
                </td>
                <td className="p-4 border-r-4 border-black font-medium text-black">
                  {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : ""}
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <Link
                    href={`/recipes/${recipe._id}`}
                    className="bg-white p-2 border-2 border-black hover:-translate-y-1 hover:bg-[#FFC900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
                    title="View"
                  >
                    <FaEye className="text-black" />
                  </Link>
                  <button
                    onClick={() => handleStartEdit(recipe)}
                    className="bg-white p-2 border-2 border-black hover:-translate-y-1 hover:bg-[#00E5FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                    title="Edit"
                  >
                    <FaEdit className="text-black" />
                  </button>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="bg-white p-2 border-2 border-black hover:-translate-y-1 hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                    title="Delete"
                  >
                    <FaTrash className="text-black hover:text-white" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recipes.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-bold text-xl uppercase text-black mb-4">
              No recipes uploaded yet!
            </p>
            <Link
              href="/dashboard/add-recipe"
              className="font-bold underline decoration-2 underline-offset-4 hover:text-[#FFC900] transition-colors"
            >
              Start cooking and add your first recipe.
            </Link>
          </div>
        )}
      </div>

      {editingRecipe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFF9E6] border-4 border-black p-6 md:p-8 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingRecipe(null)}
              className="absolute top-2 right-2 bg-red-500 text-white font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
            >
              X
            </button>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-black border-b-4 border-black pb-2 mb-6">
              Edit Recipe
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black font-bold uppercase mb-1 text-sm">
                    Recipe Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.recipeName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, recipeName: e.target.value })
                    }
                    className="w-full px-4 py-2 border-4 border-black font-medium focus:outline-none bg-white text-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-black font-bold uppercase mb-1 text-sm">
                    Image (imgbb)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="w-full px-4 py-2 border-4 border-black font-medium focus:outline-none bg-white text-black text-sm file:mr-2 file:py-1 file:px-2 file:border-2 file:border-black file:bg-[#FFC900] file:text-black file:font-black file:text-xs"
                  />
                  {editUploading && (
                    <p className="text-xs font-bold text-gray-700 mt-1 uppercase animate-pulse">
                      Uploading...
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-black font-bold uppercase mb-1 text-xs">
                    Category
                  </label>
                  <select
                    required
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, category: e.target.value })
                    }
                    className="w-full px-2 py-2 border-4 border-black font-bold uppercase bg-white text-black text-xs"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-black font-bold uppercase mb-1 text-xs">
                    Cuisine
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.cuisineType}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, cuisineType: e.target.value })
                    }
                    className="w-full px-2 py-2 border-4 border-black font-medium bg-white text-black text-xs"
                  />
                </div>
                <div>
                  <label className="block text-black font-bold uppercase mb-1 text-xs">
                    Time (Min)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.preparationTime}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, preparationTime: e.target.value })
                    }
                    className="w-full px-2 py-2 border-4 border-black font-medium bg-white text-black text-xs"
                  />
                </div>
                <div>
                  <label className="block text-black font-bold uppercase mb-1 text-xs">
                    Difficulty
                  </label>
                  <select
                    required
                    value={editFormData.difficultyLevel}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, difficultyLevel: e.target.value })
                    }
                    className="w-full px-2 py-2 border-4 border-black font-bold uppercase bg-white text-black text-xs"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-black font-bold uppercase mb-1 text-xs">
                  Ingredients
                </label>
                <textarea
                  required
                  rows="3"
                  value={editFormData.ingredients}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, ingredients: e.target.value })
                  }
                  className="w-full px-4 py-2 border-4 border-black font-medium bg-white text-black resize-none text-xs"
                  placeholder="One ingredient per line"
                ></textarea>
              </div>

              <div>
                <label className="block text-black font-bold uppercase mb-1 text-xs">
                  Instructions
                </label>
                <textarea
                  required
                  rows="4"
                  value={editFormData.instructions}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, instructions: e.target.value })
                  }
                  className="w-full px-4 py-2 border-4 border-black font-medium bg-white text-black resize-none text-xs"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={editSubmitLoading || editUploading}
                  className="flex-1 bg-black text-white font-black uppercase text-sm py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-75 cursor-pointer"
                >
                  {editSubmitLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="flex-1 bg-white text-black font-black uppercase text-sm py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
