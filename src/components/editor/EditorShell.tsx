"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewCanvas } from "./PreviewCanvas";
import { EditorTabs } from "./EditorTabs";
import { useEditorStore } from "@/lib/stores/editor-store";
import { useUpdateClip, useClip, useGenerateClip } from "@/lib/api/use-clips";
import { useJob } from "@/lib/api/use-jobs";
import type { Clip } from "@/types/clip";

interface Props {
  clip: Clip;
  projectId: string;
  jobId?: string;
}

export function EditorShell({ clip, projectId, jobId }: Props) {
  const setClip = useEditorStore((s) => s.setClip);
  const editorClip = useEditorStore((s) => s.clip);
  const update = useUpdateClip();
  const generate = useGenerateClip();
  const router = useRouter();
  const search = useSearchParams();

  // Hydrate from server only when opening a different clip. Avoid clobbering
  // in-progress tab edits on every background query update/autosave response.
  React.useEffect(() => {
    if (!editorClip || editorClip.id !== clip.id) {
      setClip(clip);
    }
  }, [clip, editorClip, setClip]);

  // If the job completes while editor is open, merge media/status fields from
  // server into the current editor clip without resetting user tab changes.
  React.useEffect(() => {
    if (!editorClip || editorClip.id !== clip.id) return;
    const mediaChanged =
      editorClip.videoUrl !== clip.videoUrl ||
      editorClip.thumbnail !== clip.thumbnail ||
      editorClip.durationSec !== clip.durationSec ||
      editorClip.status !== clip.status ||
      editorClip.width !== clip.width ||
      editorClip.height !== clip.height;
    if (!mediaChanged) return;
    setClip({
      ...editorClip,
      videoUrl: clip.videoUrl,
      thumbnail: clip.thumbnail,
      durationSec: clip.durationSec,
      status: clip.status,
      width: clip.width,
      height: clip.height,
      updatedAt: clip.updatedAt,
    });
  }, [clip, editorClip, setClip]);

  const { refetch: refetchClip } = useClip(clip.id);

  // Background poll: lives at the QueryClient level so it survives navigation.
  const job = useJob(jobId);

  // When the job transitions to succeeded, refetch the clip immediately
  // (don't wait for the next list invalidation tick) so video_url shows up.
  const lastSuccessRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!job.job) return;
    if (job.status !== "succeeded") return;
    if (lastSuccessRef.current === job.job.id) return;
    lastSuccessRef.current = job.job.id;
    void refetchClip();
  }, [job.job, job.status, refetchClip]);

  const toSavePatch = React.useCallback((c: Clip) => {
    return {
      title: c.title,
      subtitles: c.subtitles,
      music: c.music,
      overlays: c.overlays,
      trim: c.trim,
    } as const;
  }, []);

  const lastSavedRef = React.useRef<string>("");
  const isHydratedRef = React.useRef(false);
  const [isAutoSaving, setIsAutoSaving] = React.useState(false);
  const [autoSaveError, setAutoSaveError] = React.useState<string | null>(null);

  // Initialize autosave fingerprint from server clip.
  React.useEffect(() => {
    lastSavedRef.current = JSON.stringify(toSavePatch(clip));
    isHydratedRef.current = true;
  }, [clip, toSavePatch]);

  // Debounced autosave: makes all 4 editor tabs truly functional without
  // requiring explicit "Save changes" clicks for every tweak.
  React.useEffect(() => {
    if (!editorClip || !isHydratedRef.current) return;
    const nextFingerprint = JSON.stringify(toSavePatch(editorClip));
    if (nextFingerprint === lastSavedRef.current) return;

    const timer = window.setTimeout(async () => {
      setIsAutoSaving(true);
      setAutoSaveError(null);
      try {
        await update.mutateAsync({
          id: editorClip.id,
          patch: toSavePatch(editorClip),
          silent: true,
        });
        lastSavedRef.current = nextFingerprint;
      } catch (err) {
        setAutoSaveError((err as Error)?.message ?? "Autosave failed");
      } finally {
        setIsAutoSaving(false);
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [editorClip, toSavePatch, update]);

  async function save() {
    if (!editorClip) return;
    await update.mutateAsync({
      id: editorClip.id,
      patch: {
        title: editorClip.title,
        subtitles: editorClip.subtitles,
        music: editorClip.music,
        overlays: editorClip.overlays,
        trim: editorClip.trim,
      },
      silent: false,
    });
    router.push(`/projects/${projectId}`);
  }

  async function retryRender() {
    try {
      const result = await generate.mutateAsync({
        projectId,
        body: {
          title: clip.title,
          prompt: clip.prompt,
          // Carry the same params as the original by default; backend may
          // re-use the previous clip row or create a new one.
          params: {},
        },
      });
      const params = new URLSearchParams(search?.toString() ?? "");
      params.set("job", result.job.id);
      router.replace(
        `/projects/${projectId}/edit/${result.clip.id}?${params.toString()}`,
      );
    } catch {
      // Error surfaces via generate.isError; canvas overlay will still show.
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-6 md:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
        <Button size="lg" onClick={save} disabled={update.isPending || isAutoSaving}>
          {update.isPending || isAutoSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </div>

      {autoSaveError && (
        <p className="mb-4 text-xs text-destructive">
          Autosave failed: {autoSaveError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="lg:sticky lg:top-6 self-start">
          <PreviewCanvas job={job} onRetry={retryRender} />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Live preview · changes apply instantly
          </p>
        </div>

        <div className="min-w-0">
          <EditorTabs />
        </div>
      </div>
    </div>
  );
}
