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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      // The mutation now returns immediately after submit; the editor will
      // poll the job in the background and update the clip on success.
      router.push(
        `/projects/${targetProjectId}/edit/${result.clip.id}?job=${result.job.id}`,
      );
    } catch (err) {
      const msg = (err as Error)?.message ?? "Generation failed";
      const status = (err as { status?: number })?.status;
      if (status === 402) {
        setRenderError(
          msg || "You don't have enough credits for this render. Top up to continue."
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
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card aspect-[9/16] md:aspect-[9/16] max-h-[70dvh] mx-auto w-full max-w-sm relative">
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
                className="absolute inset-0 h-full w-full object-cover"
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
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <Badge variant="secondary" className="backdrop-blur">
                Preview · 480p
              </Badge>
              <Badge variant="success" className="backdrop-blur">
                <ShieldCheck className="mr-1 h-3 w-3" /> Free
              </Badge>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border/60 bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Generating
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug line-clamp-3">
              {template?.title ?? gen.prompt}
            </p>
            {style && (
              <Badge variant="outline" className="mt-3">
                {style.emoji} {style.name}
              </Badge>
            )}
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                HD render cost
              </span>
              <span className="font-mono text-2xl font-semibold">
                {credits}
                <span className="text-sm text-muted-foreground"> cr</span>
              </span>
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-success">
              <ShieldCheck className="h-3 w-3" />
              Refunded automatically if HD render fails
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Coins className="h-3 w-3" />
              You have {balance} credits
            </div>
          </div>

          {renderError && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <p>{renderError}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 px-2 text-destructive hover:bg-destructive/10"
                onClick={() => void acceptAndRender()}
                disabled={isGenerating || isRendering || !previewUrl}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry render
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              onClick={acceptAndRender}
              disabled={isGenerating || isRendering || !previewUrl}
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
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={runPreview}
              disabled={isGenerating || isRendering}
            >
              <RotateCcw className="h-4 w-4" />
              Try another preview
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Previews are always free. Generate as many as you like.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
