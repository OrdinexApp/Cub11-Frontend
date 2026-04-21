import { useAuthStore } from "@/lib/stores/auth-store";
import { billingBus } from "./billing-bus";

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const API_BASE = `${RAW_BASE.replace(/\/+$/, "")}/api/v1`;

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  form?: URLSearchParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  auth?: boolean;
  _isRetry?: boolean;
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;
  const { refreshToken, setTokens, clear } = useAuthStore.getState();
  if (!refreshToken) return null;

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) {
        clear();
        return null;
      }
      const data = (await res.json()) as {
        access_token: string;
        refresh_token?: string;
      };
      setTokens(data.access_token, data.refresh_token ?? refreshToken);
      return data.access_token;
    } catch {
      clear();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function logoutAndRedirect() {
  useAuthStore.getState().clear();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
    window.location.href = "/auth/login";
  }
}

export async function api<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };

  if (opts.auth !== false) {
    const token = useAuthStore.getState().accessToken;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (opts.form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = opts.form;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] ??= "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body,
    signal: opts.signal,
    cache: "no-store",
  });

  if (res.status === 401 && opts.auth !== false && !opts._isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return api<T>(path, { ...opts, _isRetry: true });
    }
    logoutAndRedirect();
    throw new ApiError(401, "Session expired");
  }

  if (res.status === 402) {
    let message: string | undefined;
    try {
      const data = (await res.clone().json()) as { detail?: string };
      message = data?.detail;
    } catch {}
    billingBus.emitOutOfCredits({ message });
    throw new ApiError(402, message ?? "Out of credits");
  }

  if (!res.ok) {
    let detail: unknown;
    let message = `Request failed (${res.status})`;
    try {
      detail = await res.json();
      const d = detail as { detail?: string | { msg?: string }[] };
      if (typeof d?.detail === "string") message = d.detail;
      else if (Array.isArray(d?.detail) && d.detail[0]?.msg)
        message = d.detail[0].msg as string;
    } catch {}
    throw new ApiError(res.status, message, detail);
  }

  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return undefined as T;
  return (await res.json()) as T;
}

/**
 * Backends often wrap list responses (e.g. fastapi-pagination returns
 * `{ items, total, page }`). This helper accepts either a raw array or
 * any common envelope shape and always returns an array.
 */
export function asList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of ["items", "data", "results", "records", "projects", "templates", "clips"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}
