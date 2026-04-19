"use client";

import { Music, Pause, Play, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useEditorStore } from "@/lib/stores/editor-store";
import { cn } from "@/lib/utils";

const MOODS = [
  { id: "uplifting", name: "Uplifting", emoji: "🌅", color: "from-amber-500/30 to-orange-500/20" },
  { id: "festive", name: "Festive", emoji: "🎆", color: "from-fuchsia-500/30 to-rose-500/20" },
  { id: "chill", name: "Chill", emoji: "🧊", color: "from-cyan-500/30 to-sky-500/20" },
  { id: "trap", name: "Trap", emoji: "🥁", color: "from-violet-500/30 to-indigo-500/20" },
  { id: "bollywood", name: "Bollywood", emoji: "🎶", color: "from-pink-500/30 to-amber-500/20" },
  { id: "ambient", name: "Ambient", emoji: "🌌", color: "from-emerald-500/30 to-teal-500/20" },
];

const TRACKS = [
  { id: "t1", name: "Festive Strings", mood: "festive", duration: "0:30" },
  { id: "t2", name: "Lo-fi Sunday", mood: "chill", duration: "0:45" },
  { id: "t3", name: "Bombay Mornings", mood: "bollywood", duration: "0:38" },
  { id: "t4", name: "Trap Drop 808", mood: "trap", duration: "0:24" },
];

export function MusicTab() {
  const clip = useEditorStore((s) => s.clip);
  const patch = useEditorStore((s) => s.patchMusic);
  if (!clip) return null;

  const m = clip.music;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card p-4">
        <div>
          <Label className="text-foreground text-sm">Background music</Label>
          <p className="text-xs text-muted-foreground">
            Royalty-free for social platforms.
          </p>
        </div>
        <Switch checked={m.enabled} onCheckedChange={(v) => patch({ enabled: v })} />
      </div>

      <div className="space-y-3">
        <Label>Mood</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => patch({ mood: mood.id, enabled: true })}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-3 text-center transition",
                m.mood === mood.id
                  ? "border-primary"
                  : "border-border/60 hover:border-primary/30",
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", mood.color)} />
              <div className="relative">
                <div className="text-2xl">{mood.emoji}</div>
                <p className="mt-1 text-xs font-semibold">{mood.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tracks</Label>
        <ul className="flex flex-col gap-2">
          {TRACKS.map((t) => {
            const active = m.trackId === t.id;
            return (
              <li
                key={t.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border bg-card p-3 transition",
                  active
                    ? "border-primary"
                    : "border-border/60 hover:border-primary/30",
                )}
              >
                <button
                  className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"
                  onClick={() =>
                    patch({ trackId: t.id, trackName: t.name, mood: t.mood, enabled: true })
                  }
                  aria-label="Play"
                >
                  {active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {t.mood} · {t.duration}
                  </p>
                </div>
                <Music className="h-4 w-4 text-muted-foreground" />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" /> Volume
          </Label>
          <span className="font-mono text-xs text-muted-foreground">{m.volume}%</span>
        </div>
        <Slider
          value={[m.volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => patch({ volume: v })}
        />
      </div>
    </div>
  );
}
