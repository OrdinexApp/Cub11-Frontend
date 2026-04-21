"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { meKey } from "./use-auth";
import { clipKey, clipsByProjectKey } from "./use-clips";
import { projectKey } from "./use-projects";
import type { JobDTO, JobStatus } from "./types";

export const jobKey = (id: string) => ["jobs", id] as const;

const TERMINAL_STATES: ReadonlySet<JobStatus> = new Set([
  "succeeded",
  "failed",
  "cancelled",
]);

export function isJobTerminal(job: JobDTO | undefined | null): boolean {
  return !!job && TERMINAL_STATES.has(job.status);
}

export function isJobActive(job: JobDTO | undefined | null): boolean {
  if (!job) return false;
  return !TERMINAL_STATES.has(job.status);
}

interface UseJobOptions {
  /** Override polling interval. Defaults to 2000ms. */
  intervalMs?: number;
  /**
   * If a job sits at the same `progress` for this long without changing
   * status, treat it as stalled. Defaults to 90s.
   * Pass 0 to disable stall detection.
   */
  stallAfterMs?: number;
}

export interface JobPollState {
  job: JobDTO | undefined;
  status: JobStatus | "idle";
  progress: number;
  error: string | null;
  isTerminal: boolean;
  isStalled: boolean;
  isLikelyStillSmoke: boolean;
  elapsedMs: number;
  etaMs: number | null;
  isLoading: boolean;
  refetch: () => void;
}

function pickString(src: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = src[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/**
 * Backend currently has a CPU smoke path that converts a single PNG into
 * a short MP4. Detect likely cases so the UI can label it clearly.
 */
function isLikelyStillSmokePath(job: JobDTO | undefined): boolean {
  if (!job) return false;
  const payload =
    job.payload && typeof job.payload === "object"
      ? (job.payload as Record<string, unknown>)
      : {};
  const result =
    job.result && typeof job.result === "object"
      ? (job.result as Record<string, unknown>)
      : {};

  const model = pickString(payload, ["model", "model_name", "model_id"]).toLowerCase();
  const promptId = pickString(payload, ["prompt_id", "workflow_id", "workflow"]);
  const mode = pickString(result, ["mode", "render_mode", "source_mode"]).toLowerCase();
  const backendHint = pickString(result, ["kind", "type", "variant"]).toLowerCase();

  if (mode.includes("smoke") || backendHint.includes("still")) return true;
  if (model === "default") return true;
  if (/default[_-]?test/i.test(promptId)) return true;
  return false;
}

function safeParseTimeMs(value: string | null | undefined): number | null {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Live-poll GET /jobs/{id} every `intervalMs` until the job hits a terminal
 * state (succeeded | failed | cancelled). Keeps polling across component
 * unmounts as long as any observer is mounted, because the query lives at
 * the QueryClient level.
 *
 * Side effects on terminal `succeeded`:
 *   - Invalidates the corresponding clip, project clip-list, project, and /me
 *     credit balance so the editor and workspace pick up the new video file.
 */
export function useJob(
  jobId: string | undefined,
  options: UseJobOptions = {},
): JobPollState {
  const { intervalMs = 2000, stallAfterMs = 90_000 } = options;
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();

  const lastChangeRef = React.useRef<{ progress: number; at: number } | null>(
    null,
  );

  const query = useQuery<JobDTO>({
    queryKey: jobId ? jobKey(jobId) : ["jobs", "none"],
    enabled: !!token && !!jobId,
    queryFn: async () => api<JobDTO>(`/jobs/${jobId}`),
    refetchInterval: (q) => {
      const data = q.state.data as JobDTO | undefined;
      if (data && TERMINAL_STATES.has(data.status)) return false;
      return intervalMs;
    },
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 5 * 60_000,
  });

  const job = query.data;

  // Track when progress last changed — used to detect a stuck worker.
  React.useEffect(() => {
    if (!job) return;
    const progress = Number(job.progress ?? 0);
    const last = lastChangeRef.current;
    if (!last || last.progress !== progress) {
      lastChangeRef.current = { progress, at: Date.now() };
    }
  }, [job]);

  // On terminal success: refetch downstream entities so the editor/workspace
  // pick up video_url, duration, credits, etc.
  const lastTerminalRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!job || !TERMINAL_STATES.has(job.status)) return;
    const fingerprint = `${job.id}:${job.status}`;
    if (lastTerminalRef.current === fingerprint) return;
    lastTerminalRef.current = fingerprint;

    if (job.status === "succeeded") {
      if (job.clip_id) {
        qc.invalidateQueries({ queryKey: clipKey(job.clip_id) });
      }
      // We don't know the projectId here without fetching the clip; the
      // useClip refetch above will cascade to whichever workspace is open.
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "clips" &&
          q.queryKey[1] === "by-project",
      });
      qc.invalidateQueries({ queryKey: meKey });
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) && q.queryKey[0] === "projects",
      });
    }
  }, [job, qc]);

  const status: JobStatus | "idle" = job?.status ?? "idle";
  const progress = Math.max(0, Math.min(1, Number(job?.progress ?? 0)));
  const isTerminal = isJobTerminal(job);
  const isStalled =
    !isTerminal &&
    stallAfterMs > 0 &&
    !!lastChangeRef.current &&
    Date.now() - lastChangeRef.current.at > stallAfterMs;
  const isLikelyStillSmoke = isLikelyStillSmokePath(job);
  const now = Date.now();
  const startedAt =
    safeParseTimeMs(job?.started_at) ??
    safeParseTimeMs(job?.created_at) ??
    null;
  const elapsedMs = startedAt ? Math.max(0, now - startedAt) : 0;
  const etaMs =
    startedAt && progress > 0 && progress < 1
      ? Math.max(0, Math.round((elapsedMs / progress) * (1 - progress)))
      : null;

  return {
    job,
    status,
    progress,
    error: job?.error_message ?? null,
    isTerminal,
    isStalled,
    isLikelyStillSmoke,
    elapsedMs,
    etaMs,
    isLoading: query.isLoading,
    refetch: () => {
      void query.refetch();
    },
  };
}

/**
 * Convenience: invalidate a clip + its project's clip list. Useful for
 * cancel/retry actions where you want immediate refresh without waiting
 * for the next poll tick.
 */
export function useInvalidateClipAndProject() {
  const qc = useQueryClient();
  return React.useCallback(
    (clipId: string, projectId: string) => {
      qc.invalidateQueries({ queryKey: clipKey(clipId) });
      qc.invalidateQueries({ queryKey: clipsByProjectKey(projectId) });
      qc.invalidateQueries({ queryKey: projectKey(projectId) });
    },
    [qc],
  );
}
