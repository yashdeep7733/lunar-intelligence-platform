import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Expand, GitCompareArrows } from "lucide-react";
import { sampleAnalysis } from "@/data/sampleAnalysis";

type Tab = "annotated" | "heatmap" | "suitability" | "compare";

export function ImageViewer() {
  const [tab, setTab] = useState<Tab>("annotated");
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);

  const { images } = sampleAnalysis;
  const map: Record<Exclude<Tab, "compare">, string> = {
    annotated: images.annotated,
    heatmap: images.density_heatmap,
    suitability: images.landing_suitability_map,
  };

  function fullscreen() {
    const el = boxRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }

  return (
    <div className="card-surface rounded-2xl p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold">Latest Analysis</h3>
        <div className="ml-auto flex flex-wrap gap-1 rounded-lg bg-card p-1 text-xs">
          {(["annotated", "heatmap", "suitability", "compare"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-2.5 py-1.5 font-medium capitalize transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "suitability" ? "Suitability" : t === "compare" ? "Compare" : t}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={boxRef}
        className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/60 bg-black"
      >
        {tab !== "compare" ? (
          <motion.img
            key={tab}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            src={map[tab]}
            alt={tab}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <CompareSlider
            left={images.original}
            right={images.annotated}
            pos={pos}
            onChange={setPos}
          />
        )}
        <button
          onClick={fullscreen}
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/80"
        >
          <Expand className="h-3.5 w-3.5" /> View Fullscreen
        </button>
        {tab === "compare" && (
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white">
            <GitCompareArrows className="h-3.5 w-3.5" /> Original ↔ Annotated
          </div>
        )}
      </div>
    </div>
  );
}

function CompareSlider({
  left,
  right,
  pos,
  onChange,
}: {
  left: string;
  right: string;
  pos: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="relative h-full w-full select-none">
      <img src={left} alt="original" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={right} alt="annotated" className="h-full w-full object-cover" style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none" }} />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:bg-white/90 [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
      />
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white/90"
        style={{ left: `${pos}%` }}
      />
    </div>
  );
}
