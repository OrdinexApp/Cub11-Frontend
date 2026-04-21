"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import type { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_EMOJI, PLATFORM_LABELS } from "@/lib/data/templates";
import { timeAgo } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
    >
      <Link
        href={`/projects/${project.id}`}
        className="group block overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:border-primary/30"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={project.cover}
            alt={project.title || "Project cover"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
          <Badge variant="secondary" className="absolute top-3 left-3 backdrop-blur">
            {PLATFORM_EMOJI[project.platform]} {PLATFORM_LABELS[project.platform]}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold tracking-tight line-clamp-1">
            {project.title}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Film className="h-3.5 w-3.5" />
              {project.clips.length} clip{project.clips.length === 1 ? "" : "s"}
            </span>
            <span>·</span>
            <span>Updated {timeAgo(project.updatedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
