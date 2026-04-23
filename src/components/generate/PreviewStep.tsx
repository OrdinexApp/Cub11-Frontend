"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Coins,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GenerationProgress } from "./GenerationProgress";
import { useGenerationStore } from "@/lib/stores/generation-store";
import { useMe } from "@/lib/api/use-auth";
import { useCreateProject } from "@/lib/api/use-projects";
import { useGenerateClip } from "@/lib/api/use-clips";
import { usePreviewGeneration } from "@/lib/api/use-generation";
import { useTemplates } from "@/lib/api/use-templates";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { STYLES } from "@/lib/data/styles";
import type { TemplatePlatform } from "@/types/template";
import { getFriendlyErrorMessage } from "@/lib/ui/error-messages";
import { cn } from "@/lib/utils";

export function PreviewStep({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const gen = useGenerationStore();
  const reset = useGenerationStore((s) => s.reset);

  const me = useMe();
  const balance = me.data?.credits_remaining ?? 0;

  const { data: templates } = useTemplates();
  const template = templates?.find((t) => t.id === gen.templateId);
  const style = STYLES.find((s) => s.id === gen.styleId);

  const preview = usePreviewGeneration();
  const createProject = useCreateProject();
  const generate = useGenerateClip();

  const [previewUrl, setPreviewUrl] = React.useState<string | undefined>();
  const [thumbnail, setThumbnail] = React.useState<string | undefined>();
  const [credits, setCredits] = React.useState(5);
  const [resolvedProjectId, setResolvedProjectId] = React.useState<
    string | undefined
  >(projectId);
  const [renderError, setRenderError] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (!gen.templateId && !gen.prompt) {
      router.replace("/new");
      return;
    }
    runPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runPreview() {
    setPreviewUrl(undefined);
    setRenderError(undefined);
    try {
      const r = await preview.mutateAsync({
        prompt: gen.prompt,
        templateId: gen.templateId,
        styleId: gen.styleId,
      });
      setPreviewUrl(r.previewUrl);
      setThumbnail(r.thumbnail);
      setCredits(r.estimatedRenderCredits);
    } catch (err) {
      setRenderError(
        getFriendlyErrorMessage(
          err,
          "Couldn't generate preview right now. Please retry.",
        ),
      );
    }
  }

  async function acceptAndRender() {
    if (!previewUrl || !thumbnail) return;
    setRenderError(undefined);

    const platform: TemplatePlatform =
      template?.platform ?? gen.platform ?? "instagram-reels";

    let targetProjectId = resolvedProjectId;

    try {
      if (!targetProjectId) {
        const created = await createProject.mutateAsync({
          title: template?.title ?? gen.prompt?.slice(0, 48) ?? "New project",
          description:
            template?.description ?? gen.prompt ?? "Generated with Cube11.",
          platform,
          aspect_ratio: template?.aspect ?? "9:16",
          cover_image_url: thumbnail,
        });
        targetProjectId = created.id;
        setResolvedProjectId(created.id);
      }

      const params: Record<string, unknown> = {};
      if (gen.styleId) params.style = gen.styleId;

      const clipTitle =
        template?.title ?? (gen.prompt ? gen.prompt.slice(0, 80) : undefined);

      const result = await generate.mutateAsync({
        projectId: targetProjectId,
        body: {
          title: clipTitle,
          template_id: gen.templateId,
          prompt: gen.prompt,
          params,
        },
      });

      reset();
      router.push(
        `/projects/${targetProjectId}/edit/${result.clip.id}?job=${result.job.id}`,
      );
    } catch (err) {
      const msg = (err as Error)?.message ?? "Generation failed";
      const status = (err as { status?: number })?.status;
      if (status === 402) {
        setRenderError(
          msg ||
            "You don't have enough credits for this render. Top up to continue.",
        );
        return;
      }
      setRenderError(
        getFriendlyErrorMessage(err, msg || "Generation failed. Please retry."),
      );
    }
  }

  const isGenerating = preview.isPending;
  const isRendering = generate.isPending || createProject.isPending;

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Video preview */}
        <div className="relative mx-auto aspect-[9/16] w-full max-w-sm max-h-[70dvh] overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-[0_20px_60px_-20px_rgba(17,24,39,0.18)]">
          <AnimatePresence mode="wait">
            {isGenerating || !previewUrl ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center p-6"
              >
                <GenerationProgress />
              </motion.div>
            ) : (
              <motion.div
                key={previewUrl}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 h-full w-full"
              >
                <VideoPlayer
                  src={previewUrl}
                  poster={thumbnail}
                  autoPlay
                  loop
                  defaultMuted
                  showControls={false}
                  showAudioToggle={false}
                  className="absolute inset-0"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isGenerating && previewUrl && (
            <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                Preview · 480p
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-100 backdrop-blur">
                <ShieldCheck className="h-3 w-3" /> Free
              </span>
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Generating
            </p>
            <p className="mt-1.5 line-clamp-3 text-[14px] font-semibold leading-snug text-gray-900">
              {template?.title ?? gen.prompt}
            </p>
            {style && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/8 px-2.5 py-0.5 text-[11.5px] font-semibold text-[#7C3AED]">
                <span>{style.emoji}</span> {style.name}
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-[#7C3AED]/20 bg-gradient-to-br from-[#7C3AED]/[0.04] to-[#EC4899]/[0.04] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                HD render cost
              </span>
              <span className="font-mono text-2xl font-semibold text-gray-900">
                {credits}
                <span className="text-sm text-gray-500"> cr</span>
              </span>
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
              <ShieldCheck className="h-3 w-3" />
              Refunded automatically if HD render fails
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-gray-500">
              <Coins className="h-3 w-3" />
              You have {balance} credits
            </div>
          </div>

          {renderError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-[12.5px] text-red-700">
              <p>{renderError}</p>
              <button
                type="button"
                onClick={() => void acceptAndRender()}
                disabled={isGenerating || isRendering || !previewUrl}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry render
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={acceptAndRender}
              disabled={isGenerating || isRendering || !previewUrl}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-6 text-[14px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(124,58,237,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-[0_14px_24px_-8px_rgba(124,58,237,0.55)]",
                "disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_20px_-6px_rgba(124,58,237,0.45)]",
              )}
            >
              {isRendering ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Submitting…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Accept & render HD
                </>
              )}
            </button>
            <button
              type="button"
              onClick={runPreview}
              disabled={isGenerating || isRendering}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-[14px] font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Try another preview
            </button>
            <p className="text-center text-[11px] text-gray-500">
              Previews are always free. Generate as many as you like.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
