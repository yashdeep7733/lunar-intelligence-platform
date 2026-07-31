import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ImageViewer } from "@/components/dashboard/ImageViewer";
import { AnalysisSummary } from "@/components/dashboard/AnalysisSummary";
import { ExplainableAI } from "@/components/dashboard/ExplainableAI";
import { UploadCard } from "@/components/dashboard/UploadCard";
import { HazardGauge } from "@/components/dashboard/HazardGauge";
import { CraterBarChart, SurfaceRadar } from "@/components/dashboard/Charts";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Analysis — LIP" },
      { name: "description", content: "Compare original and annotated lunar imagery." },
      { property: "og:title", content: "Analysis — LIP" },
      { property: "og:description", content: "Deep-dive lunar surface analysis view." },
    ],
  }),
  component: Analysis,
});

function Analysis() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">Compare original vs annotated lunar imagery.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><ImageViewer /></div>
        <AnalysisSummary />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <HazardGauge />
        <ExplainableAI />
        <SurfaceRadar />
      </div>
      <CraterBarChart />
      <UploadCard />
    </motion.div>
  );
}
