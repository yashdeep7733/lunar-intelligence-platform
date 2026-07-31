import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { FileText, Download } from "lucide-react";
import { recentAnalyses } from "@/data/sampleAnalysis";
import { toast } from "sonner";
import { ReportCard } from "@/components/dashboard/ReportCard";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — LIP" },
      { name: "description", content: "Generated mission reports." },
      { property: "og:title", content: "Reports — LIP" },
      { property: "og:description", content: "Mission analysis reports library." },
    ],
  }),
  component: Reports,
});

function Reports() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Generated mission reports.</p>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {recentAnalyses.map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 3 }}
              className="card-surface flex items-center gap-4 rounded-2xl p-4"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{r.mission} Report</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.image_name} • {r.date}</div>
              </div>
              <button
                onClick={() => toast.success("Downloading report", { description: r.id })}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium hover:bg-accent"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </motion.div>
          ))}
        </div>
        <ReportCard />
      </div>
    </motion.div>
  );
}
