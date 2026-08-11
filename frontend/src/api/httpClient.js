// -----------------------------------------------------------------------------
// Thin fetch wrapper — the single place where HTTP details live.
// -----------------------------------------------------------------------------
import { API_BASE_URL, REQUEST_TIMEOUT } from "./config";

export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path, params) {
  const url = `${API_BASE_URL}${path}`;
  if (!params) return url;
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
  ).toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * Perform an HTTP request against the backend.
 * @param {string} path      Endpoint path, e.g. "/analyze"
 * @param {object} [options] { method, body, params, headers, signal, timeout }
 */
export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    params,
    headers = {},
    signal,
    timeout = REQUEST_TIMEOUT,
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  if (signal) signal.addEventListener("abort", () => controller.abort());

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  try {
    const response = await fetch(buildUrl(path, params), {
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(isFormData || body === undefined
          ? {}
          : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: isFormData ? body : body === undefined ? undefined : JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new ApiError(payload?.message || `Request failed (${response.status})`, {
        status: response.status,
        data: payload,
      });
    }
    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.name === "AbortError") throw new ApiError("Request timed out", { status: 408 });
    throw new ApiError(error?.message || "Network error");
  } finally {
    clearTimeout(timer);
  }
}

export const http = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};
