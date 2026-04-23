import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
}

export function EmptyState({
  title = "No projects yet",
  description = "Start a new one — it takes about a minute and your first preview is free.",
  ctaLabel = "Start a project",
  ctaHref = "/new",
  onCta,
}: Props) {
  const cta = (
    <span className="inline-flex h-11 items-center gap-2 rounded-full bg-[#7C3AED] px-6 text-[15px] font-semibold text-white shadow-[0_10px_15px_-3px_rgba(124,58,237,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-[0_20px_25px_-5px_rgba(124,58,237,0.3)]">
      <Sparkles className="h-4 w-4" />
      {ctaLabel}
      <ArrowRight className="h-4 w-4" />
    </span>
  );

  return (
    <div className="relative grid place-items-center overflow-hidden rounded-3xl border border-dashed border-gray-300/70 bg-white/60 px-6 py-16 text-center backdrop-blur-sm">
      {/* Soft ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(124,58,237,0.10),transparent_70%)]"
      />

      <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_18px_40px_-12px_rgba(124,58,237,0.55)]">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h3>
      <p className="relative mt-2 max-w-sm text-sm text-gray-600">{description}</p>

      <div className="relative mt-6">
        {onCta ? (
          <button type="button" onClick={onCta}>
            {cta}
          </button>
        ) : (
          <Link href={ctaHref}>{cta}</Link>
        )}
      </div>
    </div>
  );
}
