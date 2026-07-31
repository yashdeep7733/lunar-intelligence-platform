import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { landingZones } from "@/data/sampleAnalysis";

function riskTone(level: string) {
  if (level === "Low") return { text: "text-emerald-400", ring: "ring-emerald-500/60", chip: "bg-emerald-500/15 text-emerald-400" };
  if (level === "Medium") return { text: "text-amber-400", ring: "ring-amber-500/60", chip: "bg-amber-500/15 text-amber-400" };
  return { text: "text-red-400", ring: "ring-red-500/60", chip: "bg-red-500/15 text-red-400" };
}

export function LandingZones() {
  return (
    <div className="card-surface flex h-full flex-col rounded-2xl p-4 md:p-5">
      <h3 className="text-sm font-semibold">Recommended Landing Zones</h3>
      <div className="mt-4 flex-1 space-y-3">
        {landingZones.map((z, i) => {
          const t = riskTone(z.risk_level);
          return (
            <motion.div
              key={z.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              whileHover={{ y: -2 }}
              className={`flex items-center gap-3 rounded-xl bg-card/60 p-3 ring-1 ${t.ring}`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{z.name}</span>
                  {z.tag && <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">{z.tag}</span>}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">Risk Score</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold">{z.risk_score}</span>
                  <span className="text-[11px] text-muted-foreground">/100</span>
                </div>
                <div className={`mt-0.5 text-[11px] font-semibold ${t.text}`}>{z.risk_level} Risk</div>
              </div>
              <div className="ml-auto h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border/60">
                <img src={z.preview} alt={z.name} className="h-full w-full object-cover" />
              </div>
            </motion.div>
          );
        })}
      </div>
      <button className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
        View All Zones <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
