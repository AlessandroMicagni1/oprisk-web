export interface Item {
  uid: string;
  source: string;
  region: "EU" | "SE" | "NO" | "DK" | "FI" | string;
  title: string;
  url: string | null;
  published: string | null;
  summary: string | null;
  celex: string | null;
  docType: string;
  isNew: boolean;
  firstSeen: string;
  terms: string[];
  prefiltered: boolean;
}

export interface ItemsResponse {
  total: number;
  limit: number;
  offset: number;
  items: Item[];
}

export interface Stats {
  total: number;
  eurlex: number;
  last_run: string | null;
}

export interface Facets {
  regions: string[];
  sources: string[];
  types: string[];
}

export interface SourceHealth {
  name: string;
  last_ok: string | null;
  last_error: string | null;
  last_count: number | null;
}

export interface ItemFilters {
  region?: string[];
  source?: string[];
  type?: string[];
  q?: string;
  since_days?: number;
  include_eurlex?: boolean;
  limit?: number;
  offset?: number;
}
