import Sidebar from "@/components/dashboard/Sidebar";
import TopHeader from "@/components/dashboard/TopHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#010736] overflow-hidden text-white selection:bg-[#263F78] selection:text-[#FFF3CF]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
