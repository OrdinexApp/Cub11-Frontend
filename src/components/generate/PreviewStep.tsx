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
import { useCreditsStore } from "@/lib/stores/credits-store";
import { useProjectsStore } from "@/lib/stores/projects-store";
import { usePreviewGeneration, useRenderHd } from "@/lib/api/use-generation";
import { useTemplates } from "@/lib/api/use-templates";
import { STYLES } from "@/lib/data/styles";
import type { Project } from "@/types/project";
import type { Clip } from "@/types/clip";
import type { TemplatePlatform } from "@/types/template";

export function PreviewStep({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const gen = useGenerationStore();
  const reset = useGenerationStore((s) => s.reset);
  const charge = useCreditsStore((s) => s.charge);
  const balance = useCreditsStore((s) => s.balance);
  const addProject = useProjectsStore((s) => s.addProject);
  const appendClip = useProjectsStore((s) => s.appendClip);

  const { data: templates } = useTemplates();
  const template = templates?.find((t) => t.id === gen.templateId);
  const style = STYLES.find((s) => s.id === gen.styleId);

  const preview = usePreviewGeneration();
  const render = useRenderHd();
  const [previewUrl, setPreviewUrl] = React.useState<string | undefined>();
  const [thumbnail, setThumbnail] = React.useState<string | undefined>();
  const [credits, setCredits] = React.useState(12);

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
    const r = await preview.mutateAsync({
      prompt: gen.prompt,
      templateId: gen.templateId,
      styleId: gen.styleId,
    });
    setPreviewUrl(r.previewUrl);
    setThumbnail(r.thumbnail);
    setCredits(r.estimatedRenderCredits);
  }

  async function acceptAndRender() {
    if (!previewUrl || !thumbnail) return;
    if (balance < credits) {
      router.push("/account");
      return;
    }
    charge(credits, `HD render — ${template?.title ?? gen.prompt?.slice(0, 32) ?? "Custom"}`);
    const result = await render.mutateAsync({
      prompt: gen.prompt,
      templateId: gen.templateId,
      styleId: gen.styleId,
      previewUrl,
      thumbnail,
      credits,
    });

    const platform: TemplatePlatform = template?.platform ?? gen.platform ?? "instagram-reels";
    const clip: Clip = {
      id: `c-${Date.now()}`,
      projectId: projectId ?? `p-${Date.now()}`,
      order: 0,
      title: template?.title ?? gen.prompt?.slice(0, 48) ?? "New clip",
      prompt: gen.prompt ?? template?.description ?? "",
      thumbnail: result.thumbnail,
      videoUrl: result.videoUrl,
      durationSec: result.durationSec,
      status: "ready",
      subtitles: { enabled: true, language: "en", style: "bold", position: "bottom" },
      music: { enabled: false, volume: 60 },
      overlays: [],
      trim: { startSec: 0, endSec: result.durationSec, speed: 1 },
    };

    let targetProjectId = projectId;
    if (!targetProjectId) {
      const newProject: Project = {
        id: clip.projectId,
        title: template?.title ?? gen.prompt?.slice(0, 48) ?? "New project",
        cover: result.thumbnail,
        platform,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clips: [{ ...clip, order: 0 }],
      };
      addProject(newProject);
      targetProjectId = newProject.id;
    } else {
      appendClip(targetProjectId, clip);
    }

    reset();
    router.push(`/projects/${targetProjectId}/edit/${clip.id}`);
  }

  const isGenerating = preview.isPending;
  const isRendering = render.isPending;

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
              <motion.video
                key={previewUrl}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={previewUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
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

          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              onClick={acceptAndRender}
              disabled={isGenerating || isRendering || !previewUrl}
            >
              {isRendering ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Rendering HD…
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
