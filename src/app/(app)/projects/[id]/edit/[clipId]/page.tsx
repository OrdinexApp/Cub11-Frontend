"use client";

import { use } from "react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorShell } from "@/components/editor/EditorShell";
import { useClip } from "@/lib/api/use-clips";
import { getFriendlyErrorMessage } from "@/lib/ui/error-messages";

export default function ClipEditorPage({
  params,
}: {
  params: Promise<{ id: string; clipId: string }>;
}) {
  const { id, clipId } = use(params);
  const search = useSearchParams();
  const jobId = search.get("job") ?? undefined;

  const { data: clip, isLoading, isError, error, refetch } = useClip(clipId);

  if (isError && (error as { status?: number })?.status === 404) {
    return notFound();
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-6 md:py-10">
        <Link
          href={`/projects/${id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
        <div className="grid place-items-center py-24">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-pulse text-primary" />
            <span className="text-sm">Loading clip…</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-6 md:py-10">
        <Link
          href={`/projects/${id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
        <div className="grid place-items-center rounded-3xl border border-border/60 bg-card/40 px-6 py-16 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">Couldn't open editor</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {getFriendlyErrorMessage(error, "We couldn't load this clip.")}
          </p>
          <Button className="mt-5" onClick={() => void refetch()}>
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!clip) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-6 md:py-10">
        <Link
          href={`/projects/${id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
        <div className="grid place-items-center rounded-3xl border border-border/60 bg-card/40 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold tracking-tight">No clip loaded</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Pick a clip from the project workspace to start editing.
          </p>
          <Button asChild className="mt-5">
            <Link href={`/projects/${id}`}>Go to clip list</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <EditorShell clip={clip} projectId={id} jobId={jobId} />;
}
