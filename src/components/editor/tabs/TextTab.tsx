"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/lib/stores/editor-store";
import { cn } from "@/lib/utils";

const STYLE_OPTIONS = ["headline", "caption", "tag"] as const;
const POS_OPTIONS = ["top", "middle", "bottom"] as const;

export function TextTab() {
  const clip = useEditorStore((s) => s.clip);
  const add = useEditorStore((s) => s.addOverlay);
  const remove = useEditorStore((s) => s.removeOverlay);
  const update = useEditorStore((s) => s.updateOverlay);

  const [draft, setDraft] = React.useState("");

  if (!clip) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Add overlay text</Label>
        <div className="flex gap-2">
          <Input
            placeholder="50% off only this weekend"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                add(draft.trim());
                setDraft("");
              }
            }}
          />
          <Button
            onClick={() => {
              if (!draft.trim()) return;
              add(draft.trim());
              setDraft("");
            }}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {clip.overlays.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No text overlays yet. Add one above.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {clip.overlays.map((o) => (
            <li
              key={o.id}
              className="rounded-2xl border border-border/60 bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <Input
                  value={o.text}
                  onChange={(e) => update(o.id, { text: e.target.value })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => remove(o.id)}
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Style</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {STYLE_OPTIONS.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={o.style === s ? "default" : "secondary"}
                        onClick={() => update(o.id, { style: s })}
                        className={cn("capitalize")}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Position</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {POS_OPTIONS.map((p) => (
                      <Button
                        key={p}
                        size="sm"
                        variant={o.position === p ? "default" : "secondary"}
                        onClick={() => update(o.id, { position: p })}
                        className="capitalize"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
