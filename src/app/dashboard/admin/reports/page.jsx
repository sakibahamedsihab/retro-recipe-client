'use client';

import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import Loader from '../../../../components/Loader';
import { useToast } from '../../../providers';
import { ShieldCheck, Calendar } from 'lucide-react';

export default function AdminReportsPage() {
  const { showToast } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error(error);
      showToast('Failed to load recipe reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDismiss = async (reportId) => {
    setProcessingId(reportId);
    try {
      await api.delete(`/reports/${reportId}`);
      showToast('Report dismissed successfully', 'success');
      setReports(reports.filter((r) => r._id !== reportId));
    } catch (error) {
      console.error(error);
      showToast('Failed to dismiss report', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveRecipe = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this reported recipe and resolve all its reports?')) return;
    setProcessingId(reportId);
    try {
      await api.delete(`/reports/${reportId}/remove-recipe`);
      showToast('Recipe removed and reports resolved', 'success');
      loadReports();
    } catch (error) {
      console.error(error);
      showToast('Failed to remove recipe', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-10 bg-white dark:bg-zinc-950 p-6">
      
      {/* Title Segment context metadata information */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">Recipe Reports</h1>
        <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
          Review recipes flagged by the community for spam or copyright issues.
        </p>
      </div>

      {/* Empty Slate conditional fallback state rendering view */}
      {reports.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 rounded-none">
          <ShieldCheck className="h-10 w-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-4 stroke-[1.5]" />
          <p className="text-xs uppercase tracking-widest font-black text-zinc-400 dark:text-zinc-500">All clear! No pending recipe reports.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-none overflow-hidden">
          {/* Strictly Sharp Geometric Data Container Framework */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-none">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-900 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  <th className="px-6 py-4.5">Recipe Name</th>
                  <th className="px-6 py-4.5">Reporter</th>
                  <th className="px-6 py-4.5">Reason</th>
                  <th className="px-6 py-4.5">Date</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    
                    {/* Item Identity and Creator Details */}
                    <td className="px-6 py-4">
                      <div className="font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50">{report.recipeName}</div>
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 tracking-normal lowercase mt-0.5">Author: {report.authorEmail}</div>
                    </td>
                    
                    {/* Flags Source Identification Email */}
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-medium lowercase tracking-normal">
                      {report.reporterEmail}
                    </td>
                    
                    {/* High Contrast Monochrome Industrial Tag Box Layout */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 rounded-none">
                        {report.reason}
                      </span>
                    </td>
                    
                    {/* Timeline Log Stamp Cell Info */}
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5 uppercase font-bold text-[10px] tracking-wider">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    
                    {/* Operations Action Command Controls buttons triggers */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleDismiss(report._id)}
                          disabled={processingId === report._id}
                          className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-none text-[10px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-950 transition-colors cursor-pointer bg-transparent"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleRemoveRecipe(report._id)}
                          disabled={processingId === report._id}
                          className="px-4 py-2 border border-red-200 dark:border-red-950 bg-red-50/50 hover:bg-red-600 dark:bg-red-950/20 text-red-600 hover:text-white dark:text-red-400 dark:hover:bg-red-600 transition-colors text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-none"
                        >
                          Remove Recipe
                        </button>
                      </div>
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