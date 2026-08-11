# API layer

All backend communication is isolated here. Components never call `fetch` directly.

| File            | Role                                                                 |
| --------------- | -------------------------------------------------------------------- |
| `config.js`     | Base URL, mock switch, timeouts, and the endpoint path list           |
| `httpClient.js` | `fetch` wrapper: JSON/FormData, timeout, `ApiError`                   |
| `lipApi.js`     | The functions the app uses (`analyzeImage`, `getAnalysis`, …)         |
| `mockApi.js`    | Returns `src/data/sampleAnalysis.js` with a delay while no backend    |
| `index.js`      | Re-exports everything (`import { lipApi } from "@/api"`)              |

React hooks that wrap these live in `src/hooks/useLipData.js`
(`useDashboardStats`, `useAnalyses`, `useAnalysis`, `useLandingZones`,
`useAnalyzeImage`, `useGenerateReport`).

## Plugging in the real backend

1. Create `.env` (see `.env.example`):

   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_USE_MOCK_API=false
   ```

2. Make sure your backend exposes the routes listed in `ENDPOINTS` (`config.js`)
   and returns the JSON shape documented in `src/data/sampleAnalysis.js`.
3. Restart the dev server. Nothing else changes — no component edits.

Rename a route? Change it in `config.js` only.
