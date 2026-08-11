// -----------------------------------------------------------------------------
// Mock backend — returns the sample JSON with a small delay.
// Used automatically while VITE_USE_MOCK_API is not "false".
// -----------------------------------------------------------------------------
import {
  sampleAnalysis,
  dashboardStats,
  recentAnalyses,
  landingZones,
  craterSizeDistribution,
  hazardTrend,
  hazardBreakdown,
  surfaceMetrics,
} from "@/data/sampleAnalysis";
import { MOCK_LATENCY } from "./config";

const delay = (ms = MOCK_LATENCY) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async analyzeImage() {
    await delay(1200);
    return sampleAnalysis;
  },
  async getAnalysis(id) {
    await delay();
    return { ...sampleAnalysis, analysis_id: id ?? sampleAnalysis.analysis_id };
  },
  async listAnalyses() {
    await delay();
    return recentAnalyses;
  },
  async getDashboardStats() {
    await delay();
    return dashboardStats;
  },
  async getLandingZones() {
    await delay();
    return landingZones;
  },
  async getCharts() {
    await delay();
    return { craterSizeDistribution, hazardTrend, hazardBreakdown, surfaceMetrics };
  },
  async generateReport(id) {
    await delay(900);
    return {
      report_id: `RPT-${id ?? sampleAnalysis.analysis_id}`,
      download_url: null,
      generated_at: new Date().toISOString(),
    };
  },
};
