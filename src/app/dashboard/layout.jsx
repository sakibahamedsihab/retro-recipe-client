import Sidebar from "@/components/dashboard/Sidebar";
import DashboardAuthGuard from "@/components/dashboard/DashboardAuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <DashboardAuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
          <Sidebar />
          <main className="flex-1 bg-[#FDFBF7] dark:bg-gray-900 border-4 border-black dark:border-[#FFC900] p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </DashboardAuthGuard>
  );
}
