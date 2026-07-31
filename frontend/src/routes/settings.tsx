import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LIP" },
      { name: "description", content: "Configure the Lunar Intelligence Platform." },
      { property: "og:title", content: "Settings — LIP" },
      { property: "og:description", content: "Application settings." },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Application preferences and API configuration.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section title="Profile">
          <Field label="Display name" defaultValue="Mission Analyst" />
          <Field label="Email" defaultValue="analyst@lip.space" />
        </Section>
        <Section title="Analysis Defaults">
          <Field label="Model" defaultValue="YOLO11" />
          <Field label="Max Hazard Threshold" defaultValue="60" />
        </Section>
        <Section title="Notifications">
          <Toggle label="Email me completed analyses" />
          <Toggle label="Alert on high hazard scores" defaultChecked />
        </Section>
        <Section title="API">
          <Field label="Backend endpoint" defaultValue="https://api.lip.space/v1" />
          <Field label="API key" defaultValue="••••••••••••" type="password" />
        </Section>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => toast.success("Settings saved")}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Save changes
        </button>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-surface rounded-2xl p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        defaultValue={defaultValue}
        type={type}
        className="mt-1 w-full rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg bg-card/50 px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-8 appearance-none rounded-full bg-muted checked:bg-primary transition-colors" />
    </label>
  );
}
