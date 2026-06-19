"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function MyRecipesClient({ initialRecipes }) {
  // সার্ভার থেকে পাওয়া ডেটা স্টেটে রাখা হলো, যাতে ডিলিট করলে রিয়েল-টাইমে ইউআই আপডেট হয়
  const [recipes, setRecipes] = useState(initialRecipes);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      // পরবর্তীতে এখানে API কল করে ডেটাবেজ থেকে রিমুভ করা হবে
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
    }
  };

  return (
    <>
      {/* Header Section */}
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

      {/* Retro Table */}
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
                  {recipe.title}
                </td>
                <td className="p-4 border-r-4 border-black font-medium text-black">
                  {recipe.category}
                </td>
                <td className="p-4 border-r-4 border-black font-bold text-black text-center">
                  {recipe.likes}
                </td>
                <td className="p-4 border-r-4 border-black font-medium text-black">
                  {recipe.date}
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <button
                    className="bg-white p-2 border-2 border-black hover:-translate-y-1 hover:bg-[#FFC900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    title="View"
                  >
                    <FaEye className="text-black" />
                  </button>
                  <button
                    className="bg-white p-2 border-2 border-black hover:-translate-y-1 hover:bg-[#00E5FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    title="Edit"
                  >
                    <FaEdit className="text-black" />
                  </button>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="bg-white p-2 border-2 border-black hover:-translate-y-1 hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    title="Delete"
                  >
                    <FaTrash className="text-black hover:text-white" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State Fallback */}
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
    </>
  );
}
