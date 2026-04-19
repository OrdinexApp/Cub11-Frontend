"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useProjectsStore } from "@/lib/stores/projects-store";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/projects/EmptyState";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const projects = useProjectsStore((s) => s.projects);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Hi there 👋
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Pick up where you left off, or spin up something new in three taps.
          </p>
        </div>
        <Button asChild size="lg" className="self-start md:self-auto">
          <Link href="/new">
            <Sparkles className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </header>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Your projects</h2>
            <span className="text-xs text-muted-foreground">
              {projects.length} total
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
