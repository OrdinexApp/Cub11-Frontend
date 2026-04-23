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
        className="group block overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition hover:border-violet-600/25 hover:shadow-[0_16px_40px_-16px_rgba(124,58,237,0.25)]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <Image
            src={project.cover}
            alt={project.title || "Project cover"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 border border-white/60 bg-white/85 text-[11px] font-semibold text-gray-800 backdrop-blur"
          >
            {PLATFORM_EMOJI[project.platform]} {PLATFORM_LABELS[project.platform]}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-[15px] font-semibold tracking-tight text-gray-900">
            {project.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Film className="h-3.5 w-3.5" />
              {project.clips.length} clip{project.clips.length === 1 ? "" : "s"}
            </span>
            <span aria-hidden>·</span>
            <span>Updated {timeAgo(project.updatedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
