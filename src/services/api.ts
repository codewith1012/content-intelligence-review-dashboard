/**
 * Low-level HTTP client for the FastAPI backend.
 * Base URL comes from VITE_API_BASE_URL. When it is not set, the app runs on mock data.
 */
export const API_BASE_URL: string | undefined =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || undefined;

/** Force mock mode with VITE_USE_MOCKS=true even when a base URL exists. */
export const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS === "true" || !API_BASE_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
  }
}

// Auth hook point: once FastAPI / Supabase Auth is wired, register a token getter here.
let getAuthToken: () => string | null | Promise<string | null> = () => null;
export function setAuthTokenProvider(fn: typeof getAuthToken) {
  getAuthToken = fn;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { query?: Record<string, string | undefined> } = {},
): Promise<T> {
  if (!API_BASE_URL) throw new ApiError("VITE_API_BASE_URL is not configured", 0);
  const url = new URL(API_BASE_URL + path);
  Object.entries(init.query ?? {}).forEach(([k, v]) => v && url.searchParams.set(k, v));

  const token = await getAuthToken();
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || `Request failed (${res.status})`;
    throw new ApiError(typeof msg === "string" ? msg : JSON.stringify(msg), res.status, data);
  }
  return data as T;
}
