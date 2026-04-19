"use client";

import * as React from "react";
import { useEditorStore } from "@/lib/stores/editor-store";
import { cn } from "@/lib/utils";

const SUB_POSITION: Record<string, string> = {
  top: "top-6",
  middle: "top-1/2 -translate-y-1/2",
  bottom: "bottom-8",
};

const SUB_STYLE: Record<string, string> = {
  minimal: "text-white text-sm font-medium",
  bold: "text-white text-base font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]",
  karaoke: "text-yellow-300 text-base font-bold uppercase tracking-wide",
  impact: "text-white text-lg font-black uppercase",
};

const OVERLAY_STYLE: Record<string, string> = {
  headline: "text-2xl md:text-3xl font-bold text-white drop-shadow-lg",
  caption: "text-sm font-medium text-white/90",
  tag: "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground",
};

export function PreviewCanvas() {
  const clip = useEditorStore((s) => s.clip);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || !clip) return;
    v.playbackRate = clip.trim.speed;
  }, [clip?.trim.speed, clip]);

  if (!clip) return null;

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl bg-black shadow-2xl shadow-black/40">
      <video
        ref={videoRef}
        src={clip.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {clip.overlays.map((o) => (
        <div
          key={o.id}
          className={cn(
            "absolute inset-x-6 grid place-items-center text-center",
            SUB_POSITION[o.position],
          )}
        >
          <span className={OVERLAY_STYLE[o.style]}>{o.text}</span>
        </div>
      ))}

      {clip.subtitles.enabled && (
        <div
          className={cn(
            "absolute inset-x-6 text-center",
            SUB_POSITION[clip.subtitles.position],
          )}
        >
          <span className={cn("inline-block px-2", SUB_STYLE[clip.subtitles.style])}>
            {clip.subtitles.language === "en"
              ? "Your subtitles will appear here"
              : "যা বলবেন তাই এখানে দেখাবে"}
          </span>
        </div>
      )}
    </div>
  );
}
