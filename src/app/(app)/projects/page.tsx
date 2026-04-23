"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Plus } from "lucide-react";
import { useProjects } from "@/lib/api/use-projects";
import { useMe } from "@/lib/api/use-auth";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/projects/EmptyState";
import { getFriendlyErrorMessage } from "@/lib/ui/error-messages";

const QUICK_STARTS = [
  {
    href: "/new?platform=instagram",
    label: "Reels",
    emoji: "📸",
    gradient: "from-pink-500 via-fuchsia-500 to-orange-400",
  },
  {
    href: "/new?platform=youtube",
    label: "Shorts",
    emoji: "▶️",
    gradient: "from-rose-500 via-red-500 to-orange-500",
  },
  {
    href: "/new?platform=tiktok",
    label: "TikTok",
    emoji: "🎵",
    gradient: "from-cyan-500 via-sky-500 to-violet-500",
  },
  {
    href: "/new?platform=whatsapp",
    label: "Status",
    emoji: "💬",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
] as const;

export default function ProjectsPage() {
  const me = useMe();
  const { data: projects, isLoading, isError, error, refetch } = useProjects();

  const greetingName =
    me.data?.full_name?.split(" ")[0] ?? me.data?.email?.split("@")[0] ?? "there";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      {/* Hero header */}
      <header className="mb-10 md:mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-violet-600/15 bg-violet-600/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7C3AED]">
          <Sparkles className="h-3 w-3" />
          Your studio
        </span>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-gray-900">
              Hi {greetingName},{" "}
              <span className="text-[#7C3AED]">what will you create today?</span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Pick up where you left off, or spin up something new in three taps.
            </p>
          </div>
          <Link
            href="/new"
            className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-[#7C3AED] px-6 text-[14.5px] font-semibold text-white shadow-[0_10px_15px_-3px_rgba(124,58,237,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-[0_20px_25px_-5px_rgba(124,58,237,0.3)] md:self-auto"
          >
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </div>
      </header>

      {/* Quick-start row */}
      <section className="mb-10">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
          Quick start
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_STARTS.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-violet-600/25 hover:shadow-[0_16px_40px_-16px_rgba(124,58,237,0.25)]"
            >
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${q.gradient} text-lg text-white shadow-sm`}
              >
                {q.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold leading-tight text-gray-900">
                  {q.label}
                </p>
                <p className="mt-0.5 text-[12px] text-gray-500">Start fresh</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-[#7C3AED]" />
            </Link>
          ))}
        </div>
      </section>

      {/* Projects grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[16/10] animate-pulse rounded-2xl border border-gray-200/70 bg-white/50"
            />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Couldn't load projects"
          description={getFriendlyErrorMessage(
            error,
            "We couldn't load your projects right now.",
          )}
          ctaLabel="Retry"
          onCta={() => refetch()}
        />
      ) : !projects || projects.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[18px] font-semibold tracking-tight text-gray-900">
                Your projects
              </h2>
              <p className="mt-1 text-[12.5px] text-gray-500">
                {projects.length} total · Last updated just now
              </p>
            </div>
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
