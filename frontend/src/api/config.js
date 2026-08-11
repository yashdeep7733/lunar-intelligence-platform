// -----------------------------------------------------------------------------
// API configuration
// -----------------------------------------------------------------------------
// When the real backend is ready, set these in a `.env` file at the project root:
//
//   VITE_API_BASE_URL=https://your-backend.example.com/api
//   VITE_USE_MOCK_API=false
//
// Nothing else in the app needs to change.
// -----------------------------------------------------------------------------

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "/api";

// Mock mode is ON by default so the UI works with no backend running.
export const USE_MOCK_API =
  String(import.meta.env.VITE_USE_MOCK_API ?? "true").toLowerCase() !== "false";

// Request timeout in milliseconds.
export const REQUEST_TIMEOUT = 30000;

// Artificial latency (ms) used only in mock mode, so loading states are visible.
export const MOCK_LATENCY = 600;

// Every backend route the frontend talks to lives here — one place to rename.
export const ENDPOINTS = {
  analyze: "/analyze",
  analysis: (id) => `/analysis/${id}`,
  analyses: "/analyses",
  dashboardStats: "/dashboard/stats",
  landingZones: (id) => `/analysis/${id}/landing-zones`,
  report: (id) => `/analysis/${id}/report`,
};
