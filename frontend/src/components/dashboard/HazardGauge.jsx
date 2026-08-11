import { motion, useMotionValue, useTransform, animate, useMotionTemplate } from "motion/react";
import { useEffect } from "react";
import { sampleAnalysis } from "@/data/sampleAnalysis";

function scoreColor(score) {
  if (score < 30) return { color: "#22C55E", label: "Low Risk" };
  if (score < 60) return { color: "#FACC15", label: "Medium Risk" };
  if (score < 80) return { color: "#F97316", label: "Elevated Risk" };
  return { color: "#EF4444", label: "Critical Risk" };
}

export function HazardGauge() {
  const target = sampleAnalysis.hazard.score;
  const t = scoreColor(target);
  const progress = useMotionValue(0);
  const display = useTransform(progress, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(progress, target, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [progress, target]);

  return (
    <div className="card-surface flex h-full flex-col rounded-2xl p-4 md:p-5">
      <h3 className="text-sm font-semibold">Hazard Score Overview</h3>
      <div className="mt-2 flex flex-1 flex-col items-center justify-center">
        <div className="relative">
          <svg width="180" height="120" viewBox="0 0 180 120">
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 70 70 0 0 1 160 100"
              fill="none"
              stroke="#1f2937"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <motion.path
              d="M 20 100 A 70 70 0 0 1 160 100"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="220"
              style={{ strokeDashoffset: useTransform(progress, (v) => 220 - (v / 100) * 220) }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <div className="flex items-baseline gap-1">
              <motion.span className="text-3xl font-bold">{display}</motion.span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${t.color}22`, color: t.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
          {t.label}
        </div>
        <p className="mt-3 max-w-[220px] text-center text-[11px] leading-relaxed text-muted-foreground">
          {sampleAnalysis.explainable_ai.summary.slice(0, 110)}…
        </p>
      </div>
    </div>
  );
}
void useMotionTemplate;
