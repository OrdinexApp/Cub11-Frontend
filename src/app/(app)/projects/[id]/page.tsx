"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Film,
  Loader2,
  Plus,
  Ratio,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipList } from "@/components/projects/ClipList";
import { EmptyState } from "@/components/projects/EmptyState";
import { useProject } from "@/lib/api/use-projects";
import { useClips, useDeleteClip, useReorderClips } from "@/lib/api/use-clips";
import { PLATFORM_LABELS, PLATFORM_EMOJI } from "@/lib/data/templates";
import { getFriendlyErrorMessage } from "@/lib/ui/error-messages";
import { timeAgo } from "@/lib/utils";

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const project = useProject(id);
  const clips = useClips(id);
  const reorder = useReorderClips(id);
  const del = useDeleteClip();

  if (project.isError && (project.error as { status?: number })?.status === 404) {
    return notFound();
  }

  const isLoading = project.isLoading || clips.isLoading;

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-6 md:py-10">
        <button
          onClick={() => router.push("/projects")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </button>

        {isLoading || !project.data ? (
          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-3xl bg-muted/40" />
            <div className="h-32 animate-pulse rounded-2xl bg-muted/30" />
            <div className="h-32 animate-pulse rounded-2xl bg-muted/30" />
          </div>
        ) : project.isError || clips.isError ? (
          <EmptyState
            title="Couldn't load this project"
            description={getFriendlyErrorMessage(
              project.error ?? clips.error,
              "Please try again in a moment.",
            )}
            ctaLabel="Retry"
            onCta={() => {
              void project.refetch();
              void clips.refetch();
            }}
          />
        ) : (
          <>
            <motion.header
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card"
            >
              <div className="relative h-44 md:h-64 w-full">
                <Image
                  src={project.data.cover}
                  alt={project.data.title || "Project cover"}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              </div>

              <div className="relative -mt-12 px-5 md:px-8 pb-6 md:pb-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="backdrop-blur">
                    {PLATFORM_EMOJI[project.data.platform]}{" "}
                    {PLATFORM_LABELS[project.data.platform]}
                  </Badge>
                  <Badge variant="outline" className="backdrop-blur">
                    <Ratio className="mr-1 h-3 w-3" />
                    {project.data.aspect}
                  </Badge>
                  <Badge variant="outline" className="backdrop-blur">
                    <Film className="mr-1 h-3 w-3" />
                    {clips.data?.length ?? 0} clip
                    {(clips.data?.length ?? 0) === 1 ? "" : "s"}
                  </Badge>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-balance">
                      {project.data.title}
                    </h1>
                    {project.data.description && (
                      <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground text-balance">
                        {project.data.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Updated {timeAgo(project.data.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button variant="outline" size="lg">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </motion.header>

            <section className="mt-8 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Clips</h2>
                  <p className="text-xs text-muted-foreground">
                    Drag to reorder. Tap a clip to edit subtitles, music, text, trim &
                    speed.
                  </p>
                </div>
                {reorder.isPending && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving order...
                  </span>
                )}
              </div>

              {!clips.data || clips.data.length === 0 ? (
                <div className="rounded-3xl border border-border/60 bg-card/40 p-2">
                  <EmptyState
                    title="No clips yet"
                    description="Create your first clip and it will appear here. You can drag to reorder once you have multiple clips."
                    ctaLabel="Generate first clip"
                    ctaHref={`/new?project=${project.data.id}`}
                  />
                </div>
              ) : (
                <ClipList
                  clips={clips.data}
                  onReorder={(ids) => reorder.mutate(ids)}
                  onDelete={(clipId) =>
                    del.mutate({ id: clipId, projectId: project.data!.id })
                  }
                />
              )}
            </section>
          </>
        )}

        <div className="h-24 md:h-16" aria-hidden />
      </div>

      {project.data && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 22 }}
          className="fixed right-4 md:right-8 z-30 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] md:bottom-8"
        >
          <Button
            asChild
            size="lg"
            className="h-14 rounded-2xl pl-5 pr-6 shadow-[0_24px_40px_-16px_hsl(var(--primary)/0.7)]"
          >
            <Link href={`/new?project=${project.data.id}`}>
              <Plus className="h-5 w-5" />
              Add new clip
              <Sparkles className="h-4 w-4 opacity-70" />
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
