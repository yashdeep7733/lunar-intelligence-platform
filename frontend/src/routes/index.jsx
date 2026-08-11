import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { StatCards } from "@/components/dashboard/StatCards";
import { ImageViewer } from "@/components/dashboard/ImageViewer";
import { AnalysisSummary } from "@/components/dashboard/AnalysisSummary";
import { LandingZones } from "@/components/dashboard/LandingZones";
import {
  CraterBarChart,
  HazardTrendLine,
  HazardPie,
  SurfaceRadar,
} from "@/components/dashboard/Charts";
import { HazardGauge } from "@/components/dashboard/HazardGauge";
import { ExplainableAI } from "@/components/dashboard/ExplainableAI";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { UploadCard } from "@/components/dashboard/UploadCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — LIP" },
      { name: "description", content: "Overview of lunar surface analysis and landing candidates." },
      { property: "og:title", content: "Dashboard — LIP" },
      { property: "og:description", content: "AI-powered lunar surface analysis overview." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 md:space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of lunar surface analysis</p>
        </div>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2"><ImageViewer /></div>
            <AnalysisSummary />
          </div>
        </div>
        <LandingZones />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CraterBarChart />
        <HazardTrendLine />
        <HazardGauge />
        <ExplainableAI />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <HazardPie />
        <SurfaceRadar />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><RecentTable /></div>
        <ReportCard />
      </div>

      <UploadCard />
    </motion.div>
  );
}
