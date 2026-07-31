import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { sampleAnalysis } from "@/data/sampleAnalysis";

export function ExplainableAI() {
  return (
    <div className="card-surface flex h-full flex-col rounded-2xl p-4 md:p-5">
      <h3 className="text-sm font-semibold">Explainable AI</h3>
      <ul className="mt-4 flex-1 space-y-2.5">
        {sampleAnalysis.landing_zone.reason.map((reason, i) => (
          <motion.li
            key={reason}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 rounded-xl bg-card/50 px-3 py-2.5 text-sm"
          >
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
            <span className="min-w-0">{reason}</span>
          </motion.li>
        ))}
      </ul>
      <p className="mt-3 rounded-xl bg-primary/10 p-3 text-[11px] leading-relaxed text-muted-foreground">
        {sampleAnalysis.explainable_ai.summary}
      </p>
    </div>
  );
}
