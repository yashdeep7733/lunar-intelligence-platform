import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  craterSizeDistribution,
  hazardBreakdown,
  hazardTrend,
  surfaceMetrics,
} from "@/data/sampleAnalysis";

const tooltipStyle = {
  contentStyle: {
    background: "oklch(0.18 0.02 265)",
    border: "1px solid oklch(0.28 0.02 265)",
    borderRadius: 12,
    fontSize: 12,
    color: "#F9FAFB",
  },
  labelStyle: { color: "#9CA3AF" },
} ;

export function CraterBarChart() {
  return (
    <ChartCard title="Crater Size Distribution">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={craterSizeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="bucket" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(124,58,237,0.08)" }} />
          <Bar dataKey="count" fill="url(#barPurple)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function HazardTrendLine() {
  return (
    <ChartCard title="Hazard Score Trend" subtitle="This Week">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={hazardTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip {...tooltipStyle} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#a78bfa"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#7C3AED", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6 }}
            fill="url(#lineFill)"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const PIE_COLORS = ["#22C55E", "#FACC15", "#F97316", "#EF4444"];

export function HazardPie() {
  return (
    <ChartCard title="Hazard Breakdown">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip {...tooltipStyle} />
          <Pie
            data={hazardBreakdown}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={3}
            stroke="none"
          >
            {hazardBreakdown.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SurfaceRadar() {
  return (
    <ChartCard title="Surface Metrics">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={surfaceMetrics} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#1f2937" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
          <PolarRadiusAxis stroke="#1f2937" tick={false} axisLine={false} />
          <Radar dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.45} />
          <Tooltip {...tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}



) {
  return (
    <div className="card-surface flex h-full flex-col rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && (
          <span className="rounded-lg bg-card px-2 py-1 text-[11px] text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      <div className="mt-3 h-56 w-full">{children}</div>
    </div>
  );
}
