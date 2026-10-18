import { Atom, Database, FileBarChart, Search } from "lucide-react";
import { MetricCard, AIInsightsPanel, RecentAnalyses } from "@/components/dashboard/overview/OverviewWidgets";
import { RedshiftDistribution, GalaxyClassification, ObjectDistribution } from "@/components/dashboard/overview/OverviewCharts";

export default function DashboardOverview() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Objects"
          value="8.1M"
          icon={<Atom />}
          trend="+12% this week"
          href="/dashboard/universe"
        />
        <MetricCard
          title="Datasets"
          value="5"
          icon={<Database />}
          trend="+2 new sources"
          href="/dashboard/explorer"
        />
        <MetricCard
          title="AI Analyses"
          value="24"
          icon={<FileBarChart />}
          trend="+18% computing"
          href="/dashboard/ai-analysis"
        />
        <MetricCard
          title="Research Queries"
          value="48"
          icon={<Search />}
          trend="+32% engagement"
          href="/dashboard/ask"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RedshiftDistribution />
        </div>
        <div>
          <GalaxyClassification />
        </div>
      </div>

      {/* Second Charts / Analysis Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ObjectDistribution />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <AIInsightsPanel />
          </div>
        </div>
      </div>

      {/* Recent Analyses Row */}
      <div className="h-[400px]">
        <RecentAnalyses />
      </div>

    </div>
  );
}
