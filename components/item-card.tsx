import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";

const REGION_FLAG: Record<string, string> = {
  EU: "🇪🇺", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰", FI: "🇫🇮",
};

// Type → shadcn badge variant / tone. Kept semantic so it follows your theme.
function typeTone(t: string): string {
  switch (t) {
    case "Regulation":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "Directive":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "Decision":
      return "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400";
    case "Commission proposal":
      return "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export function ItemCard({ item }: { item: Item }) {
  return (
    <Card
      className={cn(
        "group transition-all hover:shadow-md hover:border-primary/30",
        item.isNew && "border-l-4 border-l-primary",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("font-medium", typeTone(item.docType))}>
              {item.docType}
            </Badge>
            {item.isNew && (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                NEW
              </Badge>
            )}
          </div>
          <div className="shrink-0 text-right text-xs text-muted-foreground">
            <div>
              {REGION_FLAG[item.region] ?? ""} {item.region}
              {item.published ? ` · ${item.published}` : " · undated"}
            </div>
            <div className="font-medium text-foreground/70">{item.source}</div>
          </div>
        </div>
        <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">
          {item.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {item.summary && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          {item.celex && (
            <Badge variant="secondary" className="font-mono text-[11px]">
              CELEX {item.celex}
            </Badge>
          )}
          {item.terms.slice(0, 5).map((t) => (
            <Badge key={t} variant="secondary" className="text-[11px]">
              {t}
            </Badge>
          ))}
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open primary source
          </a>
        )}
      </CardContent>
    </Card>
  );
}
