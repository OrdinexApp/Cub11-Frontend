"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/stores/editor-store";
import { SUBTITLE_LANGUAGES } from "@/lib/data/languages";
import { cn } from "@/lib/utils";

const STYLES = ["minimal", "bold", "karaoke", "impact"] as const;
const POSITIONS = ["top", "middle", "bottom"] as const;

export function SubtitlesTab() {
  const clip = useEditorStore((s) => s.clip);
  const patch = useEditorStore((s) => s.patchSubtitles);
  if (!clip) return null;

  const subs = clip.subtitles;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card p-4">
        <div>
          <Label className="text-foreground text-sm">Auto subtitles</Label>
          <p className="text-xs text-muted-foreground">
            Transcribed and translated for your audience.
          </p>
        </div>
        <Switch
          checked={subs.enabled}
          onCheckedChange={(v) => patch({ enabled: v })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={subs.language}
            onValueChange={(v) => patch({ language: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBTITLE_LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.nativeName}{" "}
                  <span className="text-muted-foreground">— {l.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">
            Includes regional languages most editors don&apos;t support.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-3 gap-2">
            {POSITIONS.map((p) => (
              <Button
                key={p}
                variant={subs.position === p ? "default" : "secondary"}
                onClick={() => patch({ position: p })}
                className="capitalize"
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Style</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => patch({ style: s })}
              className={cn(
                "rounded-2xl border p-4 text-left transition",
                subs.style === s
                  ? "border-primary bg-primary/10"
                  : "border-border/60 bg-card hover:border-primary/30",
              )}
            >
              <p className="text-sm font-semibold capitalize">{s}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {s === "minimal" && "Subtle and clean"}
                {s === "bold" && "Easy to read on busy backgrounds"}
                {s === "karaoke" && "Word-by-word highlight"}
                {s === "impact" && "All caps, max attention"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
