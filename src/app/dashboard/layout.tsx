import Sidebar from "@/components/dashboard/Sidebar";
import TopHeader from "@/components/dashboard/TopHeader";
import CosmicNightSky from "@/components/dashboard/CosmicNightSky";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen bg-[#02040a] overflow-hidden text-white selection:bg-[#F5E6C3]/20 selection:text-[#FFF3CF]">
      {/* Active Realistic Galaxy & Night Sky Background */}
      <CosmicNightSky />

      {/* Main Glassmorphic Workspace Shell */}
      <div className="relative z-10 flex w-full h-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
