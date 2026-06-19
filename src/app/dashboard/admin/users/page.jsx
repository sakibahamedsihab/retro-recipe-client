"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import Loader from "../../../../components/Loader";
import { useToast } from "../../../providers";
import { UserMinus, UserCheck } from "lucide-react";

export default function AdminUsersPage() {
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load users list", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async (user) => {
    setUpdatingId(user._id);
    const newBlockState = !user.isBlocked;
    try {
      await api.patch(`/admin/users/${user._id}/block`, {
        isBlocked: newBlockState,
      });
      showToast(
        `User successfully ${newBlockState ? "blocked" : "unblocked"}!`,
        "success",
      );
      setUsers(
        users.map((u) =>
          u._id === user._id ? { ...u, isBlocked: newBlockState } : u,
        ),
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to update block status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Manage Users
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
          Review community members and restrict accounts if necessary.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-none">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                <th className="px-6 py-4.5">User</th>
                <th className="px-6 py-4.5">Email</th>
                <th className="px-6 py-4.5">Role</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-8 w-8 object-cover rounded-none border border-zinc-200 dark:border-zinc-800"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-bold rounded-none">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50">
                      {user.name}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-medium lowercase tracking-normal">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 rounded-none">
                      {user.role === "admin"
                        ? "Admin"
                        : user.isPremium
                          ? "Premium"
                          : "Standard"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                        user.isBlocked
                          ? "text-zinc-400"
                          : "text-zinc-900 dark:text-zinc-50"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-none ${user.isBlocked ? "bg-zinc-400" : "bg-zinc-900 dark:bg-zinc-50"}`}
                      />
                      <span>{user.isBlocked ? "Blocked" : "Active"}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    {user.role === "admin" ? (
                      <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 dark:text-zinc-600 italic">
                        System Owner
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleBlock(user)}
                        disabled={updatingId === user._id}
                        className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-none text-[10px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-950 transition-colors cursor-pointer bg-transparent ml-auto"
                      >
                        {user.isBlocked ? (
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Unblock</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <UserMinus className="h-3.5 w-3.5" />
                            <span>Block User</span>
                          </div>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
