// -----------------------------------------------------------------------------
// LIP API — the ONLY module the UI imports for data.
//
// Today every call resolves against mock data (src/api/mockApi.js).
// When the backend exists, set VITE_USE_MOCK_API=false + VITE_API_BASE_URL and
// these same functions hit real HTTP endpoints. No component changes required.
// -----------------------------------------------------------------------------
import { ENDPOINTS, USE_MOCK_API } from "./config";
import { http } from "./httpClient";
import { mockApi } from "./mockApi";

/** Upload an image for crater/hazard analysis. @param {File} file */
export function analyzeImage(file, { planet = "Moon", model = "YOLO11" } = {}) {
  if (USE_MOCK_API) return mockApi.analyzeImage(file);
  const form = new FormData();
  form.append("image", file);
  form.append("planet", planet);
  form.append("model", model);
  return http.post(ENDPOINTS.analyze, form);
}

/** Fetch a single analysis result by id. */
export function getAnalysis(id) {
  if (USE_MOCK_API) return mockApi.getAnalysis(id);
  return http.get(ENDPOINTS.analysis(id));
}

/** List past analyses (recent analyses table / image library). */
export function listAnalyses(params) {
  if (USE_MOCK_API) return mockApi.listAnalyses();
  return http.get(ENDPOINTS.analyses, { params });
}

/** Aggregate dashboard counters. */
export function getDashboardStats() {
  if (USE_MOCK_API) return mockApi.getDashboardStats();
  return http.get(ENDPOINTS.dashboardStats);
}

/** Recommended landing zones for an analysis. */
export function getLandingZones(id) {
  if (USE_MOCK_API) return mockApi.getLandingZones(id);
  return http.get(ENDPOINTS.landingZones(id));
}

/** Chart datasets (crater distribution, hazard trend/breakdown, surface radar). */
export function getCharts(id) {
  if (USE_MOCK_API) return mockApi.getCharts(id);
  return http.get(`${ENDPOINTS.analysis(id)}/charts`);
}

/** Ask the backend to build a mission report. */
export function generateReport(id) {
  if (USE_MOCK_API) return mockApi.generateReport(id);
  return http.post(ENDPOINTS.report(id));
}

export const lipApi = {
  analyzeImage,
  getAnalysis,
  listAnalyses,
  getDashboardStats,
  getLandingZones,
  getCharts,
  generateReport,
};
