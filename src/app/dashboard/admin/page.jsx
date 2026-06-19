"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaUtensils,
  FaCrown,
  FaFlag,
  FaDollarSign,
  FaBan,
  FaCheckCircle,
  FaTrash,
  FaShieldAlt,
  FaSpinner,
  FaEye,
  FaStar,
  FaEdit,
  FaReceipt,
} from "react-icons/fa";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
const TABS = ["Overview", "Users", "Recipes", "Reports", "Transactions"];

function AdminDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  // Read tab from URL param so sidebar links work
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    TABS.includes(tabFromUrl) ? tabFromUrl : "Overview"
  );

  // Keep tab in sync when URL param changes (e.g. sidebar click)
  useEffect(() => {
    if (tabFromUrl && TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  const [authorized, setAuthorized] = useState(null); // null = loading
  const [toast, setToast] = useState(null);

  // Data states
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recipePage, setRecipePage] = useState(1);
  const [recipePages, setRecipePages] = useState(1);
  const [txPage, setTxPage] = useState(1);
  const [txPages, setTxPages] = useState(1);
  const [editRecipe, setEditRecipe] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Loading states per tab
  const [tabLoading, setTabLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Auth Guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    const verifyAdmin = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/users/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.role === "admin") {
            setAuthorized(true);
          } else {
            setAuthorized(false);
            router.replace("/dashboard");
          }
        } else {
          setAuthorized(false);
          router.replace("/dashboard");
        }
      } catch {
        setAuthorized(false);
        router.replace("/dashboard");
      }
    };
    verifyAdmin();
  }, [session, isPending, router]);

  // ── Fetch Overview ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authorized) return;
    const fetchOverview = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/admin/overview`, {
          credentials: "include",
        });
        if (res.ok) setOverview(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchOverview();
  }, [authorized]);

  // ── Fetch Tab Data ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authorized) return;
    const loadTab = async () => {
      setTabLoading(true);
      try {
        if (activeTab === "Users" && users.length === 0) {
          const res = await fetch(`${BACKEND}/api/admin/users`, {
            credentials: "include",
          });
          if (res.ok) setUsers(await res.json());
        }
        if (activeTab === "Recipes") {
          const res = await fetch(
            `${BACKEND}/api/admin/recipes?limit=10&page=${recipePage}`,
            { credentials: "include" }
          );
          if (res.ok) {
            const data = await res.json();
            setRecipes(data.recipes || []);
            setRecipePages(data.pages || 1);
          }
        }
        if (activeTab === "Reports" && reports.length === 0) {
          const res = await fetch(`${BACKEND}/api/reports`, {
            credentials: "include",
          });
          if (res.ok) setReports(await res.json());
        }
        if (activeTab === "Transactions") {
          const res = await fetch(
            `${BACKEND}/api/admin/transactions?limit=10&page=${txPage}`,
            { credentials: "include" }
          );
          if (res.ok) {
            const data = await res.json();
            setTransactions(data.transactions || []);
            setTxPages(data.pages || 1);
          }
        }
      } finally {
        setTabLoading(false);
      }
    };
    loadTab();
  }, [activeTab, authorized, recipePage, txPage]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isBlocked }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isBlocked: !isBlocked } : u
          )
        );
        showToast(`User ${isBlocked ? "unblocked" : "blocked"} successfully!`);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to update user.", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    }
  };

  const handleToggleFeature = async (recipeId, isFeatured) => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/recipes/${recipeId}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (res.ok) {
        setRecipes((prev) =>
          prev.map((r) =>
            r._id === recipeId ? { ...r, isFeatured: !isFeatured } : r
          )
        );
        showToast(isFeatured ? "Removed from featured" : "Recipe featured!");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to update.", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    }
  };

  const handleEditRecipe = async (e) => {
    e.preventDefault();
    if (!editRecipe) return;
    try {
      const res = await fetch(`${BACKEND}/api/recipes/${editRecipe._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setRecipes((prev) =>
          prev.map((r) =>
            r._id === editRecipe._id ? { ...r, ...editForm } : r
          )
        );
        setEditRecipe(null);
        showToast("Recipe updated!");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to update.", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    }
  };

  const openEditModal = (recipe) => {
    setEditRecipe(recipe);
    setEditForm({
      recipeName: recipe.recipeName,
      category: recipe.category,
      cuisineType: recipe.cuisineType,
      preparationTime: recipe.preparationTime,
      difficultyLevel: recipe.difficultyLevel,
      instructions: recipe.instructions,
    });
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Permanently delete this recipe?")) return;
    try {
      const res = await fetch(`${BACKEND}/api/recipes/${recipeId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
        showToast("Recipe deleted successfully!");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to delete recipe.", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      const res = await fetch(`${BACKEND}/api/reports/${reportId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r._id !== reportId));
        showToast("Report dismissed!");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to dismiss.", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    }
  };

  const handleRemoveReportedRecipe = async (reportId) => {
    if (!confirm("This will delete the recipe and resolve all related reports. Continue?")) return;
    try {
      const res = await fetch(
        `${BACKEND}/api/reports/${reportId}/remove-recipe`,
        { method: "DELETE", credentials: "include" }
      );
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r._id !== reportId));
        showToast("Recipe removed and reports resolved!");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || "Failed to remove recipe.", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    }
  };

  // ── Loading / Unauthorized ─────────────────────────────────────────────────
  if (isPending || authorized === null) {
    return (
      <div className="flex items-center gap-3 text-xl font-black uppercase p-8 animate-pulse">
        <FaSpinner className="animate-spin" /> Verifying admin access...
      </div>
    );
  }

  if (authorized === false) return null;

  // ── Stat Card ──────────────────────────────────────────────────────────────
  const StatCard = ({ icon, label, value, color }) => (
    <div className={`bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5 hover:-translate-y-1 transition-transform`}>
      <div className={`w-14 h-14 flex items-center justify-center text-2xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-black uppercase text-black opacity-60">{label}</p>
        <h3 className="text-3xl font-black text-black">
          {value ?? <FaSpinner className="animate-spin text-xl" />}
        </h3>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-6 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 ${
              toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-[#FFC900] text-black"
            }`}
          >
            <FaShieldAlt /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="mb-8 border-b-4 border-black pb-4 flex items-center gap-4">
        <FaShieldAlt className="text-4xl text-black" />
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            Admin Panel
          </h1>
          <p className="font-medium text-black mt-1">
            Manage users, recipes, and platform moderation.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b-4 border-black pb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            id={`admin-tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 font-black uppercase border-2 border-black transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-black text-[#FFC900] shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] -translate-y-1"
                : "bg-white text-black hover:bg-[#FFF9E6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ────────────────────────────────────────────────────── */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatCard icon={<FaUsers />} label="Total Users" value={overview?.totalUsers} color="bg-[#FFF9E6]" />
          <StatCard icon={<FaUtensils />} label="Total Recipes" value={overview?.totalRecipes} color="bg-[#FFF9E6]" />
          <StatCard icon={<FaCrown />} label="Premium Members" value={overview?.totalPremiumMembers} color="bg-[#FFC900]" />
          <StatCard icon={<FaFlag />} label="Pending Reports" value={overview?.totalReports} color="bg-red-100" />
          <StatCard
            icon={<FaDollarSign />}
            label="Total Revenue"
            value={overview?.totalRevenue !== undefined ? `$${overview.totalRevenue.toFixed(2)}` : null}
            color="bg-green-100"
          />
        </div>
      )}

      {/* ── USERS TAB ───────────────────────────────────────────────────────── */}
      {activeTab === "Users" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="font-black uppercase text-black text-sm">
              Total: {users.length} users
            </p>
          </div>
          {tabLoading ? (
            <div className="flex justify-center py-16">
              <FaSpinner className="animate-spin text-3xl" />
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#FFC900] border-b-4 border-black text-black font-black uppercase tracking-wider text-sm">
                    <th className="p-4 border-r-4 border-black">Name</th>
                    <th className="p-4 border-r-4 border-black">Email</th>
                    <th className="p-4 border-r-4 border-black text-center">Role</th>
                    <th className="p-4 border-r-4 border-black text-center">Premium</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr
                      key={user._id}
                      className={`border-b-4 border-black last:border-b-0 ${
                        i % 2 === 0 ? "bg-[#FFF9E6]" : "bg-white"
                      } ${user.isBlocked ? "opacity-60" : ""}`}
                    >
                      <td className="p-4 border-r-4 border-black font-bold text-black">
                        <div className="flex items-center gap-2">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-[#FFC900] border-2 border-black flex items-center justify-center font-black text-xs">
                              {user.name?.charAt(0) || "?"}
                            </div>
                          )}
                          <span className="line-clamp-1">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 border-r-4 border-black text-sm text-black font-medium">
                        {user.email}
                      </td>
                      <td className="p-4 border-r-4 border-black text-center">
                        <span className={`text-xs font-black uppercase px-2 py-1 border-2 border-black ${
                          user.role === "admin" ? "bg-black text-[#FFC900]" : "bg-white text-black"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 border-r-4 border-black text-center">
                        {user.isPremium ? (
                          <FaCrown className="text-[#FFC900] text-xl mx-auto" />
                        ) : (
                          <span className="text-xs font-bold text-black opacity-40">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                            className={`flex items-center gap-2 font-black uppercase text-xs px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all mx-auto cursor-pointer ${
                              user.isBlocked
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {user.isBlocked ? (
                              <><FaCheckCircle /> Unblock</>
                            ) : (
                              <><FaBan /> Block</>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="p-8 text-center font-bold uppercase">No users found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── RECIPES TAB ─────────────────────────────────────────────────────── */}
      {activeTab === "Recipes" && (
        <div>
          <p className="font-black uppercase text-black text-sm mb-4">
            Total: {recipes.length} active recipes
          </p>
          {tabLoading ? (
            <div className="flex justify-center py-16">
              <FaSpinner className="animate-spin text-3xl" />
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#FFC900] border-b-4 border-black text-black font-black uppercase tracking-wider text-sm">
                    <th className="p-4 border-r-4 border-black">Recipe</th>
                    <th className="p-4 border-r-4 border-black">Author</th>
                    <th className="p-4 border-r-4 border-black text-center">Category</th>
                    <th className="p-4 border-r-4 border-black text-center">Featured</th>
                    <th className="p-4 border-r-4 border-black text-center">Likes</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((recipe, i) => (
                    <tr
                      key={recipe._id}
                      className={`border-b-4 border-black last:border-b-0 hover:bg-[#f0e6d2] transition-colors ${
                        i % 2 === 0 ? "bg-[#FFF9E6]" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-r-4 border-black">
                        <div className="flex items-center gap-3">
                          {recipe.recipeImage ? (
                            <img src={recipe.recipeImage} alt="" className="w-10 h-10 object-cover border-2 border-black flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-[#FFF9E6] border-2 border-black flex-shrink-0" />
                          )}
                          <span className="font-bold text-black uppercase text-sm line-clamp-1">
                            {recipe.recipeName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 border-r-4 border-black text-sm font-medium text-black">
                        {recipe.authorName}
                      </td>
                      <td className="p-4 border-r-4 border-black text-center">
                        <span className="bg-[#FFC900] text-black text-xs font-bold uppercase px-2 py-1 border border-black">
                          {recipe.category}
                        </span>
                      </td>
                      <td className="p-4 border-r-4 border-black text-center">
                        {recipe.isFeatured ? (
                          <FaStar className="text-[#FFC900] text-xl mx-auto" />
                        ) : (
                          <span className="text-xs opacity-40">—</span>
                        )}
                      </td>
                      <td className="p-4 border-r-4 border-black text-center font-bold text-black">
                        {recipe.likesCount || 0}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleToggleFeature(recipe._id, recipe.isFeatured)}
                            className="bg-[#FFC900] p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                            title={recipe.isFeatured ? "Unfeature" : "Feature"}
                          >
                            <FaStar className="text-black" />
                          </button>
                          <button
                            onClick={() => openEditModal(recipe)}
                            className="bg-white p-2 border-2 border-black hover:bg-[#FFC900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit className="text-black" />
                          </button>
                          <a
                            href={`/recipes/${recipe._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white p-2 border-2 border-black hover:bg-[#FFC900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            title="View"
                          >
                            <FaEye className="text-black" />
                          </a>
                          <button
                            onClick={() => handleDeleteRecipe(recipe._id)}
                            className="bg-red-500 p-2 border-2 border-black hover:bg-red-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash className="text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recipes.length === 0 && (
                <p className="p-8 text-center font-bold uppercase">No recipes found.</p>
              )}
            </div>
          )}
          {recipePages > 1 && !tabLoading && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setRecipePage((p) => Math.max(1, p - 1))}
                disabled={recipePage === 1}
                className="bg-white font-black uppercase px-4 py-2 border-2 border-black disabled:opacity-40 cursor-pointer"
              >
                Prev
              </button>
              <span className="font-bold py-2">Page {recipePage} of {recipePages}</span>
              <button
                onClick={() => setRecipePage((p) => Math.min(recipePages, p + 1))}
                disabled={recipePage === recipePages}
                className="bg-white font-black uppercase px-4 py-2 border-2 border-black disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TRANSACTIONS TAB ───────────────────────────────────────────────── */}
      {activeTab === "Transactions" && (
        <div>
          <p className="font-black uppercase text-black text-sm mb-4 flex items-center gap-2">
            <FaReceipt /> Payment Transactions
          </p>
          {tabLoading ? (
            <div className="flex justify-center py-16">
              <FaSpinner className="animate-spin text-3xl" />
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#FFC900] border-b-4 border-black text-black font-black uppercase tracking-wider text-sm">
                    <th className="p-4 border-r-4 border-black">User</th>
                    <th className="p-4 border-r-4 border-black text-center">Amount</th>
                    <th className="p-4 border-r-4 border-black text-center">Date</th>
                    <th className="p-4 border-r-4 border-black text-center">Status</th>
                    <th className="p-4">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr
                      key={tx._id}
                      className={`border-b-4 border-black last:border-b-0 ${
                        i % 2 === 0 ? "bg-[#FFF9E6]" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-r-4 border-black font-medium text-sm">
                        {tx.userEmail}
                      </td>
                      <td className="p-4 border-r-4 border-black text-center font-bold">
                        ${tx.amount?.toFixed(2)}
                      </td>
                      <td className="p-4 border-r-4 border-black text-center text-sm">
                        {tx.paidAt ? new Date(tx.paidAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4 border-r-4 border-black text-center">
                        <span className={`text-xs font-black uppercase px-2 py-1 border border-black ${
                          tx.paymentStatus === "succeeded" ? "bg-green-200" : "bg-red-200"
                        }`}>
                          {tx.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono truncate max-w-[200px]">
                        {tx.transactionId || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <p className="p-8 text-center font-bold uppercase">No transactions yet.</p>
              )}
            </div>
          )}
          {txPages > 1 && !tabLoading && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                disabled={txPage === 1}
                className="bg-white font-black uppercase px-4 py-2 border-2 border-black disabled:opacity-40 cursor-pointer"
              >
                Prev
              </button>
              <span className="font-bold py-2">Page {txPage} of {txPages}</span>
              <button
                onClick={() => setTxPage((p) => Math.min(txPages, p + 1))}
                disabled={txPage === txPages}
                className="bg-white font-black uppercase px-4 py-2 border-2 border-black disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Recipe Modal */}
      {editRecipe && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border-4 border-black p-8 w-full max-w-lg shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">
              Edit Recipe
            </h3>
            <form onSubmit={handleEditRecipe} className="space-y-4">
              <input
                type="text"
                value={editForm.recipeName}
                onChange={(e) => setEditForm({ ...editForm, recipeName: e.target.value })}
                className="w-full border-4 border-black p-2 font-bold"
                placeholder="Recipe Name"
                required
              />
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full border-4 border-black p-2 font-bold uppercase"
              >
                {["Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                value={editForm.cuisineType}
                onChange={(e) => setEditForm({ ...editForm, cuisineType: e.target.value })}
                className="w-full border-4 border-black p-2"
                placeholder="Cuisine"
              />
              <textarea
                rows={4}
                value={editForm.instructions}
                onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                className="w-full border-4 border-black p-2"
                placeholder="Instructions"
              />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-black text-white font-black uppercase py-2 border-2 border-black cursor-pointer">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditRecipe(null)}
                  className="flex-1 bg-white font-black uppercase py-2 border-2 border-black cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REPORTS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === "Reports" && (
        <div>
          <p className="font-black uppercase text-black text-sm mb-4">
            {reports.length} pending report{reports.length !== 1 ? "s" : ""}
          </p>
          {tabLoading ? (
            <div className="flex justify-center py-16">
              <FaSpinner className="animate-spin text-3xl" />
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-red-500 text-white text-xs font-black uppercase px-2 py-1 border border-black">
                        {report.reason}
                      </span>
                      <span className={`text-xs font-black uppercase px-2 py-1 border border-black ${
                        report.status === "pending" ? "bg-[#FFC900] text-black" : "bg-green-200 text-black"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="font-bold text-black text-sm">
                      <span className="opacity-60">Recipe:</span>{" "}
                      <span className="uppercase">{report.recipeName || report.recipeId}</span>
                    </p>
                    <p className="font-medium text-black text-xs mt-1">
                      <span className="opacity-60">Reported by:</span> {report.reporterEmail}
                    </p>
                    <p className="font-medium text-black text-xs">
                      <span className="opacity-60">Author:</span> {report.authorEmail}
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleDismissReport(report._id)}
                      className="flex items-center gap-2 bg-white text-black font-black uppercase text-xs px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFC900] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    >
                      <FaCheckCircle /> Dismiss
                    </button>
                    <button
                      onClick={() => handleRemoveReportedRecipe(report._id)}
                      className="flex items-center gap-2 bg-red-500 text-white font-black uppercase text-xs px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    >
                      <FaTrash /> Remove Recipe
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFF9E6] border-4 border-black border-dashed p-16 text-center">
              <FaShieldAlt className="text-6xl mx-auto mb-4 text-black opacity-30" />
              <p className="font-bold text-xl uppercase text-black">
                No pending reports. Platform is clean! ✅
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-3 text-xl font-black uppercase p-8 animate-pulse">
        <FaSpinner className="animate-spin" /> Loading Admin Panel...
      </div>
    }>
      <AdminDashboardInner />
    </Suspense>
  );
}
