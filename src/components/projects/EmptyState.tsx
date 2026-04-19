import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No projects yet",
  description = "Start a new one — it takes about a minute and your first preview is free.",
  ctaLabel = "Start a project",
  ctaHref = "/new",
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-600/20">
        <Sparkles className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button asChild size="lg" className="mt-6">
        <Link href={ctaHref}>
          <Sparkles className="h-4 w-4" />
          {ctaLabel}
        </Link>
      </Button>
    </div>
  );
}
