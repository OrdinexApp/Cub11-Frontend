"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/stores/editor-store";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { RenderProgress } from "./RenderProgress";
import type { JobPollState } from "@/lib/api/use-jobs";
import { cn, formatDuration } from "@/lib/utils";

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

const SAMPLE_SUBTITLE: Record<string, string> = {
  en: "Your subtitles will appear here",
  hi: "आपके सबटाइटल यहाँ दिखेंगे",
  ta: "உங்கள் வசன வரிகள் இங்கே தோன்றும்",
  te: "మీ ఉపశీర్షికలు ఇక్కడ కనిపిస్తాయి",
  bn: "আপনার সাবটাইটেল এখানে দেখাবে",
  mr: "तुमचे उपशीर्षक येथे दिसतील",
  id: "Subtitle kamu akan muncul di sini",
  vi: "Phụ đề của bạn sẽ xuất hiện ở đây",
  tl: "Lalabas dito ang iyong mga subtitle",
  th: "คำบรรยายของคุณจะปรากฏที่นี่",
  ms: "Sari kata anda akan muncul di sini",
};

interface PreviewCanvasProps {
  job?: JobPollState;
  onRetry?: () => void;
}

export function PreviewCanvas({ job, onRetry }: PreviewCanvasProps = {}) {
  const clip = useEditorStore((s) => s.clip);
  if (!clip) return null;

  const isReady = clip.status === "ready" && !!clip.videoUrl;
  // Show the progress overlay if a job is being tracked AND it isn't a
  // succeeded job whose clip we've already rendered. This covers queued,
  // running, failed, cancelled, and stalled states.
  const showProgress =
    !!job &&
    job.status !== "idle" &&
    (job.status !== "succeeded" || !isReady);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
    >
      <VideoPlayer
        src={isReady ? clip.videoUrl : undefined}
        poster={clip.thumbnail}
        autoPlay={false}
        loop={false}
        defaultMuted
        showControls={!showProgress}
        showAudioToggle={false}
        playbackRate={clip.trim.speed}
        notReadyMessage={
          showProgress
            ? "Rendering your clip…"
            : clip.status === "rendering"
              ? "Your clip is still rendering. Refresh in a moment."
              : "No video file yet. Hit Retry to re-render."
        }
        className="absolute inset-0"
      >
        {clip.overlays.map((o) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "absolute inset-x-6 grid place-items-center text-center pointer-events-none z-10",
              SUB_POSITION[o.position],
            )}
          >
            <span className={OVERLAY_STYLE[o.style]}>{o.text}</span>
          </motion.div>
        ))}

        <AnimatePresence>
          {clip.subtitles.enabled && (
            <motion.div
              key={`${clip.subtitles.language}-${clip.subtitles.position}-${clip.subtitles.style}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "absolute inset-x-6 text-center pointer-events-none z-10",
                SUB_POSITION[clip.subtitles.position],
              )}
            >
              <span className={cn("inline-block px-2", SUB_STYLE[clip.subtitles.style])}>
                {SAMPLE_SUBTITLE[clip.subtitles.language] ?? SAMPLE_SUBTITLE.en}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-[10px] font-mono text-white/90">
            9:16
          </span>
          <span className="rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-[10px] font-mono text-white/90">
            {formatDuration(clip.durationSec)}
          </span>
        </div>

        {job?.status === "succeeded" && job.isLikelyStillSmoke && (
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 flex justify-center">
            <span className="rounded-full bg-amber-500/25 border border-amber-300/40 px-3 py-1 text-[11px] font-medium text-amber-100 backdrop-blur">
              Backend smoke mode: static image wrapped as short MP4
            </span>
          </div>
        )}

        {showProgress && job && (
          <div className="absolute inset-0 z-20">
            <RenderProgress
              status={job.status}
              progress={job.progress}
              isStalled={job.isStalled}
              error={job.error}
              elapsedMs={job.elapsedMs}
              etaMs={job.etaMs}
              onRetry={onRetry}
            />
          </div>
        )}
      </VideoPlayer>
    </motion.div>
  );
}
