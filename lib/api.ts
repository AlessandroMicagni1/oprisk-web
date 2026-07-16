import type {
  Facets,
  ItemFilters,
  ItemsResponse,
  SourceHealth,
  Stats,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

function qs(filters: ItemFilters): string {
  const p = new URLSearchParams();
  filters.region?.forEach((r) => p.append("region", r));
  filters.source?.forEach((s) => p.append("source", s));
  filters.type?.forEach((t) => p.append("type", t));
  if (filters.q) p.set("q", filters.q);
  if (filters.since_days != null) p.set("since_days", String(filters.since_days));
  if (filters.include_eurlex != null)
    p.set("include_eurlex", String(filters.include_eurlex));
  if (filters.limit != null) p.set("limit", String(filters.limit));
  if (filters.offset != null) p.set("offset", String(filters.offset));
  return p.toString();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Retry with backoff — tolerates Render free-tier cold starts (~up to ~40s).
async function get<T>(path: string, attempts = 8): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
      return (await res.json()) as T;
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await sleep(Math.min(1000 * 2 ** i, 8000));
    }
  }
  throw lastErr;
}

async function post<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST" });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  items: (filters: ItemFilters = {}) =>
    get<ItemsResponse>(`/items?${qs(filters)}`),
  stats: () => get<Stats>("/stats"),
  facets: () => get<Facets>("/facets"),
  sources: () => get<SourceHealth[]>("/sources"),
  refresh: () => post<{ new: number; fetched: number }>("/refresh"),
  markRead: () => post<{ ok: boolean }>("/mark-read"),
  exportUrl: (kind: "csv" | "pdf", filters: ItemFilters = {}) =>
    `${API_BASE}/export.${kind}?${qs(filters)}`,
};
