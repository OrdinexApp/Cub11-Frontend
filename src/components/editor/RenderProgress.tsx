"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, RotateCcw, Sparkles } from "lucide-react";
import type { JobStatus } from "@/lib/api/types";
import { getFriendlyErrorMessage } from "@/lib/ui/error-messages";

const STATUS_LABEL: Record<JobStatus | "idle", string> = {
  idle: "Waiting in queue",
  pending: "Waiting in queue",
  queued: "Waiting in queue",
  running: "Generating your video",
  succeeded: "Done",
  failed: "Generation failed",
  cancelled: "Cancelled",
};

interface Props {
  status: JobStatus | "idle";
  progress: number;
  isStalled: boolean;
  error: string | null;
  elapsedMs?: number;
  etaMs?: number | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

function fmtClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

/**
 * Overlay shown in the editor preview while a render is in progress, plus
 * stall/error/retry states. Designed to sit inside the 9:16 preview frame.
 */
export function RenderProgress({
  status,
  progress,
  isStalled,
  error,
  elapsedMs = 0,
  etaMs = null,
  onRetry,
  onCancel,
}: Props) {
  const pct = Math.round(progress * 100);
  const isFailure = status === "failed" || status === "cancelled";
  const friendlyError = error
    ? getFriendlyErrorMessage({ message: error }, "Render failed. Please retry.")
    : null;

  return (
    <div className="absolute inset-0 grid place-items-center bg-black/55 backdrop-blur-sm text-white">
      <div className="w-full max-w-xs px-6 text-center">
        {isFailure ? (
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-400" />
        ) : isStalled ? (
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-400" />
        ) : (
          <Sparkles className="mx-auto h-8 w-8 text-primary animate-pulse" />
        )}

        <p className="mt-3 text-sm font-semibold">
          {isFailure
            ? STATUS_LABEL[status]
            : isStalled
              ? "Render seems stuck"
              : STATUS_LABEL[status]}
        </p>

        {!isFailure && !isStalled && (
          <>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(2, pct)}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-white/70">
              <Loader2 className="h-3 w-3 animate-spin" />
              {pct}% · {fmtClock(elapsedMs)}
              {etaMs != null ? ` elapsed · ~${fmtClock(etaMs)} left` : " elapsed"}
            </p>
          </>
        )}

        {isStalled && !isFailure && (
          <p className="mx-auto mt-2 max-w-[18rem] text-[11px] text-white/70">
            This render is taking longer than expected at {pct}%. You can retry
            now, or leave it running and check back in a bit.
          </p>
        )}

        {friendlyError && (
          <p className="mx-auto mt-3 max-w-[18rem] text-[11px] text-amber-200/90">
            {friendlyError}
          </p>
        )}

        {(isFailure || isStalled) && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white text-zinc-900 px-3.5 py-1.5 text-xs font-semibold hover:bg-white/90"
          >
            <RotateCcw className="h-3 w-3" />
            Retry
          </button>
        )}

        {!isFailure && !isStalled && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-3 text-[11px] text-white/60 underline-offset-2 hover:text-white hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
