// Sample analysis payload — mirrors the shape the backend will return.
// Swap `sampleAnalysis` for `await fetch("/api/analyze").then(r => r.json())` later.

 

// Public NASA / Unsplash images used as visual stand-ins for the ML output.
const MOON_ORIGINAL =
  "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1600&q=80&auto=format&fit=crop";
const MOON_ANNOTATED =
  "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1600&q=80&auto=format&fit=crop";
const MOON_HEATMAP =
  "https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=1600&q=80&auto=format&fit=crop";
const MOON_SUITABILITY =
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1600&q=80&auto=format&fit=crop";

export const sampleAnalysis = {
  success: true,
  analysis_id: "LIP-20260715-001",
  processing_info: {
    planet: "Moon",
    model: "YOLO11",
    processing_time: "1.82 sec",
    image_resolution: "2048x2048",
    analysis_date: "2026-07-15T18:42:11Z",
  },
  images: {
    original: MOON_ORIGINAL,
    annotated: MOON_ANNOTATED,
    density_heatmap: MOON_HEATMAP,
    landing_suitability_map: MOON_SUITABILITY,
    charts: {
      crater_size_distribution: "",
      hazard_breakdown: "",
      crater_density_distribution: "",
    },
  },
  hazard: { score: 27, level: "Low" },
  surface: { texture: "Smooth", crater_density: "Low", coverage_percent: 14.8 },
  statistics: {
    total_craters: 47,
    largest_crater_px: 94,
    smallest_crater_px: 8,
    average_crater_diameter_px: 31.6,
    median_crater_diameter_px: 29.2,
  },
  landing_zone: {
    status: "Candidate Region Identified",
    region: "Top Right",
    suitability_score: 94,
    coordinates: { x: 1642, y: 486 },
    estimated_area_px: 285000,
    reason: [
      "Low crater density",
      "Small average crater size",
      "Smooth surface texture",
      "Low hazard score",
    ],
  },
  explainable_ai: {
    summary:
      "The analyzed lunar surface contains relatively few large craters and exhibits a smooth surface texture. The highlighted region has the lowest crater density among all analyzed areas, making it the strongest candidate for further expert evaluation.",
  },
  mission_summary: {
    overall_assessment: "Promising Candidate Region",
    recommendation:
      "The highlighted region may be considered for further scientific analysis based on the visual characteristics identified by the platform.",
  },
};

// Aggregate dashboard-level stats (would come from a different backend endpoint).
export const dashboardStats = {
  images_analyzed: 128,
  total_craters: 8562,
  avg_hazard_score: 42,
  landing_candidates: 24,
  reports_generated: 36,
  trends: {
    images_analyzed: 18,
    total_craters: 22,
    avg_hazard_score: -5,
    landing_candidates: 14,
    reports_generated: 12,
  },
};

// Crater size distribution buckets — matches the annotated bar chart.
export const craterSizeDistribution = [
  { bucket: "< 20 px", count: 195 },
  { bucket: "20–50", count: 352 },
  { bucket: "50–100", count: 254 },
  { bucket: "100–200", count: 148 },
  { bucket: "200–500", count: 72 },
  { bucket: "> 500", count: 21 },
];

// 7-day hazard score history.
export const hazardTrend = [
  { day: "Mon", score: 42 },
  { day: "Tue", score: 55 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 60 },
  { day: "Fri", score: 51 },
  { day: "Sat", score: 65 },
  { day: "Sun", score: 58 },
];

// Hazard breakdown pie chart.
export const hazardBreakdown = [
  { name: "Low", value: 62 },
  { name: "Medium", value: 24 },
  { name: "High", value: 10 },
  { name: "Critical", value: 4 },
];

// Surface metrics for the radar chart.
export const surfaceMetrics = [
  { metric: "Smoothness", value: 82 },
  { metric: "Flatness", value: 74 },
  { metric: "Low Density", value: 88 },
  { metric: "Illumination", value: 66 },
  { metric: "Slope", value: 71 },
  { metric: "Coverage", value: 58 },
];

// Landing zone suggestions — three variations of the primary result.
export const landingZones = [
  {
    id: "zone-1",
    name: "Zone 1",
    risk_score: 18,
    risk_level: "Low",
    tag: "Best Match",
    preview: MOON_SUITABILITY,
  },
  {
    id: "zone-2",
    name: "Zone 2",
    risk_score: 36,
    risk_level: "Medium",
    tag: null,
    preview: MOON_ANNOTATED,
  },
  {
    id: "zone-3",
    name: "Zone 3",
    risk_score: 58,
    risk_level: "High",
    tag: null,
    preview: MOON_HEATMAP,
  },
];

 

export const recentAnalyses = [
  {
    id: "LIP-20260712-042",
    image_name: "moon_region_01.jpg",
    mission: "Chandrayaan-3 Study",
    date: "2026-07-12",
    craters: 248,
    hazard_score: 18,
    hazard_label: "Low",
    best_zone: "Zone 1",
    landing_score: 94,
    status: "Complete",
    thumbnail: MOON_ANNOTATED,
  },
  {
    id: "LIP-20260711-039",
    image_name: "moon_region_02.jpg",
    mission: "Lunar South Pole",
    date: "2026-07-11",
    craters: 362,
    hazard_score: 56,
    hazard_label: "Medium",
    best_zone: "Zone 2",
    landing_score: 71,
    status: "Complete",
    thumbnail: MOON_HEATMAP,
  },
  {
    id: "LIP-20260710-037",
    image_name: "moon_region_03.jpg",
    mission: "Artemis Planning",
    date: "2026-07-10",
    craters: 521,
    hazard_score: 71,
    hazard_label: "High",
    best_zone: "Zone 3",
    landing_score: 48,
    status: "Complete",
    thumbnail: MOON_SUITABILITY,
  },
  {
    id: "LIP-20260709-036",
    image_name: "moon_region_04.jpg",
    mission: "Mare Tranquillitatis",
    date: "2026-07-09",
    craters: 187,
    hazard_score: 22,
    hazard_label: "Low",
    best_zone: "Zone 1",
    landing_score: 89,
    status: "Complete",
    thumbnail: MOON_ORIGINAL,
  },
];

// Simulated async fetcher — components use this so swapping to a real endpoint is trivial.
export async function fetchAnalysis() {
  return new Promise((resolve) => setTimeout(() => resolve(sampleAnalysis), 0));
}
