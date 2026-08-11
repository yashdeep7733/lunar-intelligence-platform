import { motion } from "motion/react";
import { Circle, Maximize2, Minimize2, Ruler, Percent, Waves, Layers } from "lucide-react";
import { sampleAnalysis } from "@/data/sampleAnalysis";

const rows = () => {
  const s = sampleAnalysis.statistics;
  const surf = sampleAnalysis.surface;
  return [
    { icon: Circle, label: "Total Craters", value: `${s.total_craters}` },
    { icon: Maximize2, label: "Largest Crater", value: `${s.largest_crater_px} px` },
    { icon: Minimize2, label: "Smallest Crater", value: `${s.smallest_crater_px} px` },
    { icon: Ruler, label: "Avg. Diameter", value: `${s.average_crater_diameter_px} px` },
    { icon: Percent, label: "Crater Coverage", value: `${surf.coverage_percent}%` },
    { icon: Layers, label: "Density", value: surf.crater_density, tag: true },
    { icon: Waves, label: "Surface Texture", value: surf.texture, tag: true },
  ];
};

export function AnalysisSummary() {
  return (
    <div className="card-surface flex h-full flex-col rounded-2xl p-4 md:p-5">
      <h3 className="text-sm font-semibold">Analysis Summary</h3>
      <div className="mt-4 flex-1 space-y-2.5">
        {rows().map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center gap-3 rounded-xl bg-card/50 px-3 py-2.5"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <r.icon className="h-4 w-4" />
            </span>
            <span className="text-xs text-muted-foreground">{r.label}</span>
            <span className={`ml-auto text-sm font-semibold ${r.tag ? "rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-400" : ""}`}>
              {r.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
