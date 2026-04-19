"use client";

import Link from "next/link";
import Image from "next/image";
import { Download, Share2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjectsStore } from "@/lib/stores/projects-store";
import { EmptyState } from "@/components/projects/EmptyState";
import { PLATFORM_EMOJI, PLATFORM_LABELS } from "@/lib/data/templates";
import { formatDuration, timeAgo } from "@/lib/utils";

export default function MyVideosPage() {
  const projects = useProjectsStore((s) => s.projects);
  const clips = projects.flatMap((p) =>
    p.clips.map((c) => ({ project: p, clip: c })),
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">My videos</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Every clip you&apos;ve rendered. Download, share, or remix.
        </p>
      </header>

      {clips.length === 0 ? (
        <EmptyState
          title="No rendered videos yet"
          description="Once you render a clip, it'll show up here ready to share."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {clips.map(({ project, clip }) => (
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
                  alt={clip.title}
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
                  {PLATFORM_EMOJI[project.platform]} {PLATFORM_LABELS[project.platform]}
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
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Download className="h-3.5 w-3.5" />
                    Save
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
