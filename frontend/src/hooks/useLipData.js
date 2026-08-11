// -----------------------------------------------------------------------------
// Data hooks — components call these instead of importing sample data directly.
// They sit on top of src/api/lipApi.js, so they work with mock data today and
// with the real backend later without any change here.
// -----------------------------------------------------------------------------
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { lipApi } from "@/api";
import {
  dashboardStats as fallbackStats,
  landingZones as fallbackZones,
  recentAnalyses as fallbackRecent,
  sampleAnalysis as fallbackAnalysis,
} from "@/data/sampleAnalysis";

export const queryKeys = {
  stats: ["dashboard-stats"],
  analyses: ["analyses"],
  analysis: (id) => ["analysis", id],
  zones: (id) => ["landing-zones", id],
  charts: (id) => ["charts", id],
};

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => lipApi.getDashboardStats(),
    placeholderData: fallbackStats,
  });
}

export function useAnalyses(params) {
  return useQuery({
    queryKey: [...queryKeys.analyses, params],
    queryFn: () => lipApi.listAnalyses(params),
    placeholderData: fallbackRecent,
  });
}

export function useAnalysis(id = fallbackAnalysis.analysis_id) {
  return useQuery({
    queryKey: queryKeys.analysis(id),
    queryFn: () => lipApi.getAnalysis(id),
    placeholderData: fallbackAnalysis,
  });
}

export function useLandingZones(id = fallbackAnalysis.analysis_id) {
  return useQuery({
    queryKey: queryKeys.zones(id),
    queryFn: () => lipApi.getLandingZones(id),
    placeholderData: fallbackZones,
  });
}

export function useCharts(id = fallbackAnalysis.analysis_id) {
  return useQuery({
    queryKey: queryKeys.charts(id),
    queryFn: () => lipApi.getCharts(id),
  });
}

/** Upload + analyze an image. `mutate(file)` / `mutateAsync(file)`. */
export function useAnalyzeImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => lipApi.analyzeImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.analyses });
    },
  });
}

export function useGenerateReport() {
  return useMutation({ mutationFn: (id) => lipApi.generateReport(id) });
}
