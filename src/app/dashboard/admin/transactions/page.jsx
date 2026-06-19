"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import Loader from "../../../../components/Loader";
import { useToast } from "../../../providers";
import { CreditCard, Calendar, ArrowUpRight } from "lucide-react";

export default function AdminTransactionsPage() {
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await api.get("/admin/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error(error);
        showToast("Failed to load transaction logs", "error");
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
          Transactions Log
        </h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
          Monitor all successful payments made on the RecipeHub platform.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-none">
          <CreditCard className="h-10 w-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-4 stroke-[1.5]" />
          <p className="text-xs uppercase tracking-widest font-black text-zinc-400 dark:text-zinc-500">
            No transactions have been recorded yet.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-none">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  <th className="px-6 py-4.5">User Email</th>
                  <th className="px-6 py-4.5">Transaction ID</th>
                  <th className="px-6 py-4.5">Type</th>
                  <th className="px-6 py-4.5">Amount</th>
                  <th className="px-6 py-4.5">Date</th>
                  <th className="px-6 py-4.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 lowercase tracking-normal">
                      {tx.userEmail}
                    </td>

                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-500 dark:text-zinc-400 tracking-tight">
                      {tx.transactionId}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 rounded-none">
                        {tx.recipeId ? "Recipe Purchase" : "Premium Upgrade"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-zinc-900 dark:text-zinc-50 font-black tracking-wide">
                      ${tx.amount?.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5 uppercase font-bold text-[10px] tracking-wider">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{new Date(tx.paidAt).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50 rounded-none">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>Succeeded</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
