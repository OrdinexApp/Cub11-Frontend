"use client";

import * as React from "react";
import { TemplateCard } from "./TemplateCard";
import { RegionalRow } from "./RegionalRow";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/lib/api/use-templates";
import { PLATFORM_LABELS, PLATFORM_EMOJI } from "@/lib/data/templates";
import type { TemplatePlatform } from "@/types/template";
import { cn } from "@/lib/utils";

const PLATFORMS: ("all" | TemplatePlatform)[] = [
  "all",
  "instagram-reels",
  "youtube-shorts",
  "tiktok",
  "whatsapp-status",
  "facebook-ads",
  "youtube-long",
];

export function TemplateGrid() {
  const { data, isLoading } = useTemplates();
  const [filter, setFilter] = React.useState<(typeof PLATFORMS)[number]>("all");

  const filtered = React.useMemo(
    () => (data ?? []).filter((t) => filter === "all" || t.platform === filter),
    [data, filter],
  );

  return (
    <div className="space-y-10">
      {data && <RegionalRow templates={data} />}

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">All templates</h2>
            <p className="text-sm text-muted-foreground">
              Tap one and you&apos;re three steps away from a finished video.
            </p>
          </div>
        </div>

        <div className="-mx-4 md:mx-0 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 px-4 md:px-0 pb-1">
            {PLATFORMS.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={filter === p ? "default" : "secondary"}
                onClick={() => setFilter(p)}
                className={cn("rounded-full whitespace-nowrap")}
              >
                {p === "all" ? "All" : `${PLATFORM_EMOJI[p]} ${PLATFORM_LABELS[p]}`}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[9/16] animate-pulse rounded-2xl bg-muted/40"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
