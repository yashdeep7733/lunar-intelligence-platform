import { motion } from "motion/react";
import { FileDown, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { useGenerateReport } from "@/hooks/useLipData";

export function ReportCard() {
  const report = useGenerateReport();
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="relative flex h-full flex-col overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-glow)]"
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <h3 className="text-base font-semibold text-white">Generate Mission Report</h3>
        <p className="mt-1 text-sm text-white/80">
          Download a detailed analysis report including images, statistics, and insights.
        </p>
      </div>
      <div className="relative mt-4 flex flex-1 items-end gap-3">
        <button
          onClick={() =>
            report.mutate(undefined, {
              onSuccess: (data) =>
                toast.success("Report generated", { description: `Report ${data.report_id} is ready.` }),
              onError: (error) => toast.error("Report failed", { description: error.message }),
            })
          }
          disabled={report.isPending}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
        >
          <FileText className="h-4 w-4" />
          Generate Report
        </button>
        <button
          onClick={() => toast("Download queued")}
          className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
          aria-label="Download"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
      <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 opacity-20 md:block">
        <FileDown className="h-24 w-24 text-white" />
      </div>
    </motion.div>
  );
}
