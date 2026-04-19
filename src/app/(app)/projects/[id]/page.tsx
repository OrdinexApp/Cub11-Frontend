"use client";

import { use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Download, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipList } from "@/components/projects/ClipList";
import { EmptyState } from "@/components/projects/EmptyState";
import { useProjectsStore } from "@/lib/stores/projects-store";
import { PLATFORM_LABELS, PLATFORM_EMOJI } from "@/lib/data/templates";
import { timeAgo } from "@/lib/utils";

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = useProjectsStore((s) => s.getProject(id));
  const reorderClips = useProjectsStore((s) => s.reorderClips);
  const router = useRouter();

  if (!project) return notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-6 md:py-10">
      <button
        onClick={() => router.push("/projects")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All projects
      </button>

      <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-card">
        <div className="relative h-40 md:h-56 w-full">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        </div>
        <div className="relative -mt-10 px-5 md:px-8 pb-6">
          <Badge variant="secondary" className="backdrop-blur">
            {PLATFORM_EMOJI[project.platform]} {PLATFORM_LABELS[project.platform]}
          </Badge>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {project.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.clips.length} clip{project.clips.length === 1 ? "" : "s"} ·
                Updated {timeAgo(project.updatedAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button asChild size="lg">
                <Link href={`/new?project=${project.id}`}>
                  <Plus className="h-4 w-4" />
                  Add clip
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-8 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Clips</h2>
            <p className="text-xs text-muted-foreground">
              Drag to reorder. Tap a clip to edit subtitles, music, text, trim & speed.
            </p>
          </div>
        </div>

        {project.clips.length === 0 ? (
          <EmptyState
            title="No clips yet"
            description="Add your first AI-generated clip to start this project."
            ctaLabel="Generate first clip"
            ctaHref={`/new?project=${project.id}`}
          />
        ) : (
          <ClipList
            clips={project.clips}
            onReorder={(ids) => reorderClips(project.id, ids)}
          />
        )}
      </section>

      <div className="mt-10 flex items-center justify-center">
        <Button asChild variant="soft" size="lg">
          <Link href={`/new?project=${project.id}`}>
            <Sparkles className="h-4 w-4" />
            Generate another clip
          </Link>
        </Button>
      </div>
    </div>
  );
}
