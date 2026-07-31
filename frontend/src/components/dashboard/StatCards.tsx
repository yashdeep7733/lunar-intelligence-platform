import { motion } from "motion/react";
import CountUpDefault from "react-countup";
// Some bundlers double-wrap the CJS default; unwrap to the real component.
const CountUp: typeof CountUpDefault = ((CountUpDefault as unknown as { default?: typeof CountUpDefault }).default ?? CountUpDefault) as typeof CountUpDefault;
import { Images, Target, TriangleAlert, MapPin, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { dashboardStats } from "@/data/sampleAnalysis";

const cards = [
  { key: "images_analyzed", label: "Images Analyzed", icon: Images, tint: "from-primary/25 to-primary/5", iconColor: "text-primary", suffix: "" },
  { key: "total_craters", label: "Craters Detected", icon: Target, tint: "from-emerald-500/25 to-emerald-500/5", iconColor: "text-emerald-400", suffix: "" },
  { key: "avg_hazard_score", label: "Avg. Hazard Score", icon: TriangleAlert, tint: "from-amber-500/25 to-amber-500/5", iconColor: "text-amber-400", suffix: "/100" },
  { key: "landing_candidates", label: "Landing Candidates", icon: MapPin, tint: "from-secondary/25 to-secondary/5", iconColor: "text-blue-400", suffix: "" },
  { key: "reports_generated", label: "Reports Generated", icon: FileText, tint: "from-fuchsia-500/25 to-fuchsia-500/5", iconColor: "text-fuchsia-400", suffix: "" },
] as const;

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
      {cards.map((c, i) => {
        const value = dashboardStats[c.key as keyof typeof dashboardStats] as number;
        const trend = dashboardStats.trends[c.key as keyof typeof dashboardStats.trends];
        const up = trend >= 0;
        const Icon = c.icon;
        return (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileHover={{ y: -3 }}
            className="card-surface group relative overflow-hidden rounded-2xl p-4 md:p-5"
          >
            <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${c.tint} blur-2xl`} />
            <div className="flex items-start justify-between">
              <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.tint} ${c.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-xs font-medium text-muted-foreground">{c.label}</div>
            <div className="mt-1 flex items-baseline gap-1 text-2xl font-bold tracking-tight md:text-3xl">
              <CountUp end={value} duration={1.4} separator="," />
              {c.suffix && <span className="text-sm font-medium text-muted-foreground">{c.suffix}</span>}
            </div>
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-400" : "text-red-400"}`}>
              {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trend)}%
              <span className="text-muted-foreground">from last week</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
