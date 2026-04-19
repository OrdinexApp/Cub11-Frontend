"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDuration } from "@/lib/utils";
import type { Clip } from "@/types/clip";

interface Props {
  clip: Clip;
  onDelete?: (id: string) => void;
}

export function ClipCard({ clip, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: clip.id });

  const [scrub, setScrub] = React.useState(0);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-stretch gap-3 rounded-2xl border border-border/60 bg-card p-3 transition",
        isDragging && "shadow-2xl shadow-black/40 ring-1 ring-primary/40",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="hidden md:grid touch-none cursor-grab active:cursor-grabbing place-items-center px-1 text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={clip.thumbnail}
          alt={clip.title}
          fill
          sizes="96px"
          className="object-cover"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
          <Play className="h-5 w-5 text-white" fill="currentColor" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              #{clip.order + 1}
            </span>
            <h3 className="truncate text-sm font-semibold">{clip.title}</h3>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
            {clip.prompt}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={clip.durationSec * 100}
              value={scrub}
              onChange={(e) => setScrub(Number(e.target.value))}
              aria-label="Scrub clip"
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[hsl(var(--primary))]"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)) ${
                  (scrub / (clip.durationSec * 100)) * 100
                }%, hsl(var(--muted)) ${(scrub / (clip.durationSec * 100)) * 100}%)`,
              }}
            />
          </div>
          <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
            {formatDuration(clip.durationSec)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-1 py-1">
        <div className="flex gap-1">
          <Button asChild size="icon" variant="ghost" className="h-8 w-8">
            <Link
              href={`/projects/${clip.projectId}/edit/${clip.id}`}
              aria-label="Edit clip"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(clip.id)}
              aria-label="Delete clip"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
