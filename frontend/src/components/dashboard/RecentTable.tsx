import { motion } from "motion/react";
import { Eye } from "lucide-react";
import { recentAnalyses } from "@/data/sampleAnalysis";

function hazardTone(label: string) {
  if (label === "Low") return "text-emerald-400";
  if (label === "Medium") return "text-amber-400";
  return "text-red-400";
}

export function RecentTable() {
  return (
    <div className="card-surface rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recent Analyses</h3>
        <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
      </div>
      <div className="mt-4 -mx-2 overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[720px] border-separate border-spacing-y-1.5 px-2 text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 pb-1 font-medium">Image</th>
              <th className="px-3 pb-1 font-medium">Mission</th>
              <th className="px-3 pb-1 font-medium">Date</th>
              <th className="px-3 pb-1 font-medium">Craters</th>
              <th className="px-3 pb-1 font-medium">Hazard</th>
              <th className="px-3 pb-1 font-medium">Best Zone</th>
              <th className="px-3 pb-1 font-medium">Status</th>
              <th className="px-3 pb-1 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentAnalyses.map((r, i) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card/50 transition-colors hover:bg-card"
              >
                <td className="rounded-l-xl px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <img src={r.thumbnail} className="h-8 w-8 rounded-md object-cover" alt="" />
                    <span className="text-xs font-medium">{r.image_name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-xs">{r.mission}</td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.date}</td>
                <td className="px-3 py-2.5 text-xs">{r.craters}</td>
                <td className={`px-3 py-2.5 text-xs font-semibold ${hazardTone(r.hazard_label)}`}>
                  {r.hazard_score} ({r.hazard_label})
                </td>
                <td className="px-3 py-2.5 text-xs">{r.best_zone}</td>
                <td className="px-3 py-2.5 text-xs">
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-400">
                    {r.status}
                  </span>
                </td>
                <td className="rounded-r-xl px-3 py-2.5">
                  <button
                    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
