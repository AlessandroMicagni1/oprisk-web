"use client";

import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Facets, ItemFilters } from "@/lib/types";

const REGION_FLAG: Record<string, string> = {
  EU: "🇪🇺", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰", FI: "🇫🇮",
};

interface Props {
  facets: Facets | null;
  filters: ItemFilters;
  onChange: (next: ItemFilters) => void;
}

function toggle(list: string[] | undefined, value: string): string[] {
  const set = new Set(list ?? []);
  set.has(value) ? set.delete(value) : set.add(value);
  return [...set];
}

export function FilterBar({ facets, filters, onChange }: Props) {
  if (!facets) return null;

  const chip = (
    active: boolean,
    label: string,
    onClick: () => void,
    key?: string,
  ) => (
    <button
      key={key ?? label}
      onClick={onClick}
      className="focus:outline-none"
      type="button"
    >
      <Badge
        variant={active ? "default" : "outline"}
        className="cursor-pointer select-none"
      >
        {label}
      </Badge>
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.q ?? ""}
          onChange={(e) => onChange({ ...filters, q: e.target.value, offset: 0 })}
          placeholder="Search titles and summaries…"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Region</span>
        {facets.regions.map((r) =>
          chip(
            (filters.region ?? []).includes(r),
            `${REGION_FLAG[r] ?? ""} ${r}`,
            () => onChange({ ...filters, region: toggle(filters.region, r), offset: 0 }),
            r,
          ),
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Type</span>
        {facets.types.map((t) =>
          chip(
            (filters.type ?? []).includes(t),
            t,
            () => onChange({ ...filters, type: toggle(filters.type, t), offset: 0 }),
            t,
          ),
        )}
      </div>

      {(filters.region?.length || filters.type?.length || filters.q) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({ since_days: filters.since_days, limit: filters.limit, offset: 0 })
          }
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
