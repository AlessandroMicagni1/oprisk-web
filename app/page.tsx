"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterBar } from "@/components/filter-bar";
import { ItemCard } from "@/components/item-card";
import { api } from "@/lib/api";
import type { Facets, Item, ItemFilters, Stats } from "@/lib/types";

const PAGE = 30;

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [facets, setFacets] = useState<Facets | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<ItemFilters>({
    since_days: 3650,
    limit: PAGE,
    offset: 0,
  });

  useEffect(() => {
    api.stats().then(setStats).catch(() => {});
    api.facets().then(setFacets).catch(() => {});
  }, []);

  const load = useCallback(async (f: ItemFilters) => {
    setLoading(true);
    try {
      const res = await api.items(f);
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  async function refresh() {
    setRefreshing(true);
    try {
      await api.refresh();
      const [s, f] = await Promise.all([api.stats(), api.facets()]);
      setStats(s);
      setFacets(f);
      await load(filters);
    } finally {
      setRefreshing(false);
    }
  }

  const metrics = [
    { label: "Showing", value: items.length },
    { label: "Matching", value: total },
    { label: "In database", value: stats?.total ?? "—" },
    { label: "EUR-Lex", value: stats?.eurlex ?? "—" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <header className="mb-6 flex items-end justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            OpRisk <span className="text-primary">Watch</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            EU &amp; Nordic operational-risk regulation — agency news and the full
            EUR-Lex legislation database.
          </p>
        </div>
        <Button onClick={refresh} disabled={refreshing} variant="outline" size="sm">
          <RefreshCw className={refreshing ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
          {refreshing ? "Fetching…" : "Refresh"}
        </Button>
      </header>

      {/* Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border bg-muted/40 px-4 py-3">
            <div className="text-xs text-muted-foreground">{m.label}</div>
            <div className="mt-0.5 text-2xl font-bold tabular-nums">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar facets={facets} filters={filters} onChange={setFilters} />
      </div>

      {/* Items */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No items match the current filters.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <ItemCard key={it.uid} item={it} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > items.length + (filters.offset ?? 0) && !loading && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() =>
              setFilters((f) => ({ ...f, limit: (f.limit ?? PAGE) + PAGE }))
            }
          >
            Load more ({total - items.length} remaining)
          </Button>
        </div>
      )}
    </main>
  );
}
