"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { AlertCircle, GripVertical, Pencil, Play, Sparkles, Trash2 } from "lucide-react";
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
  const [isHovering, setIsHovering] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const isReady = clip.status === "ready" && !!clip.videoUrl;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const safeDuration =
    Number.isFinite(clip.durationSec) && clip.durationSec > 0
      ? clip.durationSec
      : 0;
  const scrubMax = safeDuration * 100;
  const scrubPct = scrubMax > 0 ? (scrub / scrubMax) * 100 : 0;

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovering && isReady) {
      if (scrubMax > 0) {
        v.currentTime = Math.min(safeDuration, scrub / 100);
      } else {
        v.currentTime = 0;
      }
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isHovering, isReady, scrub, scrubMax, safeDuration]);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || !isReady) return;
    const onTime = () => {
      if (!safeDuration || !Number.isFinite(v.currentTime)) return;
      const next = Math.round(v.currentTime * 100);
      setScrub((prev) => (Math.abs(prev - next) > 3 ? next : prev));
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [isReady, safeDuration]);

  const statusLabel =
    clip.status === "ready"
      ? "Ready"
      : clip.status === "failed" || clip.status === "cancelled"
        ? "Failed"
        : "Generating";

  const statusVariant =
    clip.status === "ready"
      ? "success"
      : clip.status === "failed" || clip.status === "cancelled"
        ? "destructive"
        : "warning";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={cn(
        "group flex items-stretch gap-3 rounded-2xl border border-border/60 bg-card p-3 transition",
        "hover:border-primary/30",
        isDragging && "shadow-2xl shadow-black/40 ring-1 ring-primary/40 z-10",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="grid touch-none cursor-grab active:cursor-grabbing place-items-center px-1 text-muted-foreground/80 hover:text-foreground"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-muted/40 border border-border/40">
          <GripVertical className="h-4 w-4" />
        </span>
      </button>

      <Link
        href={`/projects/${clip.projectId}/edit/${clip.id}`}
        className="relative h-28 w-20 md:h-28 md:w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
        aria-label={`Open clip ${clip.title || "Untitled clip"} in editor`}
      >
        <Image
          src={clip.thumbnail}
          alt={clip.title || "Clip thumbnail"}
          fill
          sizes="96px"
          className={cn(
            "object-cover transition-opacity duration-200",
            isHovering && isReady ? "opacity-0" : "opacity-100",
          )}
        />

        {isReady && (
          <video
            key={clip.videoUrl}
            ref={videoRef}
            src={clip.videoUrl}
            poster={clip.thumbnail}
            muted
            loop
            playsInline
            preload="metadata"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
              isHovering ? "opacity-100" : "opacity-0",
            )}
          />
        )}

        <div
          className={cn(
            "absolute inset-0 grid place-items-center bg-black/20 transition group-hover:bg-black/40",
            isHovering && isReady && "bg-transparent",
          )}
        >
          {(!isHovering || !isReady) && (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-zinc-900 shadow-lg opacity-90 transition group-hover:scale-110">
              <Play className="h-4 w-4" fill="currentColor" />
            </span>
          )}
        </div>

        <Badge
          variant="outline"
          className="absolute bottom-1.5 right-1.5 font-mono text-[10px] backdrop-blur bg-black/50 border-white/20 text-white px-1.5 py-0"
        >
          {formatDuration(clip.durationSec)}
        </Badge>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-muted-foreground">
              #{clip.order + 1}
            </span>
            <h3 className="truncate text-sm font-semibold flex-1 min-w-0">
              {clip.title}
            </h3>
            <Badge variant={statusVariant} className="shrink-0">
              {clip.status !== "ready" && clip.status !== "failed" && clip.status !== "cancelled" && (
                <Sparkles className="mr-1 h-3 w-3 animate-pulse" />
              )}
              {statusLabel}
            </Badge>
            {clip.status === "ready" && !isReady && (
              <Badge variant="warning" className="shrink-0">
                <AlertCircle className="mr-1 h-3 w-3" />
                No video file
              </Badge>
            )}
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
              max={scrubMax || 1}
              value={scrub}
              onChange={(e) => {
                const next = Number(e.target.value);
                setScrub(next);
                const v = videoRef.current;
                if (v && isReady && scrubMax > 0) {
                  v.currentTime = Math.min(safeDuration, next / 100);
                }
              }}
              aria-label="Scrub clip"
              disabled={scrubMax === 0}
              className="h-1 w-full cursor-pointer appearance-none rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)) ${scrubPct}%, hsl(var(--muted)) ${scrubPct}%)`,
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums shrink-0">
            {formatDuration(scrub / 100 || 0)} / {formatDuration(safeDuration)}
          </span>
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
    </motion.div>
  );
}
