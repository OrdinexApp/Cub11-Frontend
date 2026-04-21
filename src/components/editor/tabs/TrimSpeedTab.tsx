"use client";

import { Gauge, Scissors } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/stores/editor-store";
import { cn, formatDuration } from "@/lib/utils";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function TrimSpeedTab() {
  const clip = useEditorStore((s) => s.clip);
  const patch = useEditorStore((s) => s.patchTrim);
  if (!clip) return null;
  const t = clip.trim;
  const maxDuration = Math.max(0.1, clip.durationSec || 0);
  const clampedStart = Math.max(0, Math.min(t.startSec, maxDuration));
  const clampedEnd = Math.max(clampedStart, Math.min(t.endSec, maxDuration));

  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-foreground text-sm">
            <Scissors className="h-4 w-4" /> Trim
          </Label>
          <div className="font-mono text-xs text-muted-foreground">
            {formatDuration(clampedStart)} – {formatDuration(clampedEnd)}
          </div>
        </div>
        <Slider
          value={[clampedStart, clampedEnd]}
          min={0}
          max={maxDuration}
          step={0.1}
          onValueChange={([s, e]) =>
            patch({
              startSec: Math.max(0, Math.min(s, maxDuration)),
              endSec: Math.max(s, Math.min(e, maxDuration)),
            })
          }
          disabled={maxDuration <= 0.1}
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>0:00</span>
          <span>{formatDuration(maxDuration)}</span>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5">
        <Label className="flex items-center gap-2 text-foreground text-sm">
          <Gauge className="h-4 w-4" /> Speed
        </Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SPEEDS.map((s) => (
            <Button
              key={s}
              variant={t.speed === s ? "default" : "secondary"}
              onClick={() => patch({ speed: s })}
              className={cn("font-mono")}
            >
              {s}×
            </Button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Tip: 1.25× usually beats 1× on Reels and Shorts.
        </p>
      </div>
    </div>
  );
}
