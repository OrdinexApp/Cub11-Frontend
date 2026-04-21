"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQueries } from "@tanstack/react-query";
import { Download, Share2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/projects/EmptyState";
import { useProjects } from "@/lib/api/use-projects";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api, asList } from "@/lib/api/client";
import { mapClip } from "@/lib/api/adapters";
import { clipsByProjectKey } from "@/lib/api/use-clips";
import { PLATFORM_EMOJI, PLATFORM_LABELS } from "@/lib/data/templates";
import { getFriendlyErrorMessage } from "@/lib/ui/error-messages";
import { formatDuration, timeAgo } from "@/lib/utils";
import type { ClipDTO } from "@/lib/api/types";
import type { Project } from "@/types/project";
import type { Clip } from "@/types/clip";

export default function MyVideosPage() {
  const token = useAuthStore((s) => s.accessToken);
  const projects = useProjects();

  const clipQueries = useQueries({
    queries: (projects.data ?? []).map((p) => ({
      queryKey: clipsByProjectKey(p.id),
      enabled: !!token,
      queryFn: async () => {
        const raw = await api<ClipDTO[] | { items?: ClipDTO[] }>(
          `/clips/by-project/${p.id}`,
        );
        return asList<ClipDTO>(raw).map(mapClip);
      },
    })),
  });

  const flat: Array<{ project: Project; clip: Clip }> = React.useMemo(() => {
    const list: Array<{ project: Project; clip: Clip }> = [];
    (projects.data ?? []).forEach((p, i) => {
      const cs = clipQueries[i]?.data ?? [];
      cs.filter((c) => c.status === "ready").forEach((clip) =>
        list.push({ project: p, clip }),
      );
    });
    return list.sort(
      (a, b) =>
        new Date(b.project.updatedAt).getTime() -
        new Date(a.project.updatedAt).getTime(),
    );
  }, [projects.data, clipQueries]);

  const isLoading =
    projects.isLoading || clipQueries.some((q) => q.isLoading);
  const hasQueryError =
    projects.isError || clipQueries.some((q) => q.isError);
  const firstError =
    projects.error ?? clipQueries.find((q) => q.error)?.error ?? null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">My videos</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Every clip you&apos;ve rendered. Download, share, or remix.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[9/16] animate-pulse rounded-2xl bg-muted/40"
            />
          ))}
        </div>
      ) : hasQueryError ? (
        <EmptyState
          title="Couldn't load videos"
          description={getFriendlyErrorMessage(
            firstError,
            "We couldn't fetch your rendered videos right now.",
          )}
          ctaLabel="Retry"
          onCta={() => {
            void projects.refetch();
            clipQueries.forEach((q) => {
              void q.refetch();
            });
          }}
        />
      ) : flat.length === 0 ? (
        <EmptyState
          title="No rendered videos yet"
          description="Once you render a clip, it'll show up here ready to share."
          ctaLabel="Create first video"
          ctaHref="/new"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {flat.map(({ project, clip }) => (
            <div
              key={clip.id}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <Link
                href={`/projects/${project.id}/edit/${clip.id}`}
                className="relative block aspect-[9/16] w-full overflow-hidden"
              >
                <Image
                  src={clip.thumbnail}
                  alt={clip.title || "Clip"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur opacity-0 transition group-hover:opacity-100">
                    <Play className="h-5 w-5 text-white" fill="currentColor" />
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="absolute top-3 left-3 backdrop-blur text-[10px]"
                >
                  {PLATFORM_EMOJI[project.platform]}{" "}
                  {PLATFORM_LABELS[project.platform]}
                </Badge>
                <Badge
                  variant="outline"
                  className="absolute top-3 right-3 font-mono text-[10px] backdrop-blur bg-black/40 border-white/20 text-white"
                >
                  {formatDuration(clip.durationSec)}
                </Badge>
              </Link>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{clip.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {project.title} · {timeAgo(project.updatedAt)}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                  >
                    <a href={clip.videoUrl} download>
                      <Download className="h-3.5 w-3.5" />
                      Save
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
