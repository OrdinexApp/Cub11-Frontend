"use client";

import { Flame } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import type { Template } from "@/types/template";
import { useRegion } from "@/hooks/use-region";

const REGION_LABEL: Record<string, string> = {
  in: "India",
  id: "Indonesia",
  vn: "Vietnam",
  ph: "Philippines",
  th: "Thailand",
};

export function RegionalRow({ templates }: { templates: Template[] }) {
  const region = useRegion();
  const regional = templates.filter(
    (t) => t.trending && (t.region === region || t.region === "global"),
  );
  if (regional.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Flame className="h-5 w-5 text-orange-400" />
            Trending in {REGION_LABEL[region] ?? "your region"}
          </h2>
          <p className="text-sm text-muted-foreground">
            What creators near you are making this week.
          </p>
        </div>
      </div>

      <div className="-mx-4 md:mx-0 overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 px-4 md:px-0 pb-2">
          {regional.map((t) => (
            <div key={t.id} className="w-44 md:w-52 shrink-0">
              <TemplateCard template={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
