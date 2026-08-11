import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useAnalyses } from "@/hooks/useLipData";
import { UploadCard } from "@/components/dashboard/UploadCard";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Image Library — LIP" },
      { name: "description", content: "Browse all uploaded lunar imagery." },
      { property: "og:title", content: "Image Library — LIP" },
      { property: "og:description", content: "Every lunar image ingested by the platform." },
    ],
  }),
  component: Library,
});

function Library() {
  const { data: recentAnalyses = [] } = useAnalyses();
  const gallery = [...recentAnalyses, ...recentAnalyses, ...recentAnalyses];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Image Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">All uploaded lunar images.</p>
      </header>
      <UploadCard />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
        {gallery.map((r, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="card-surface group overflow-hidden rounded-2xl"
          >
            <div className="aspect-square overflow-hidden">
              <img src={r.thumbnail} alt={r.image_name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-3">
              <div className="truncate text-xs font-semibold">{r.image_name}</div>
              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{r.mission}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
