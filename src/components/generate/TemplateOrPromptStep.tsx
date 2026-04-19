"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Wand2, LayoutTemplate, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTemplates } from "@/lib/api/use-templates";
import { useGenerationStore } from "@/lib/stores/generation-store";
import { PLATFORM_EMOJI, PLATFORM_LABELS } from "@/lib/data/templates";

const SUGGESTIONS = [
  "Diwali 50% off announcement reel for our jewelry store",
  "Street food walk-through in Hanoi night market",
  "Good morning WhatsApp status with sunrise and Tagalog greeting",
  "Cafe launch ad with steam, coffee art, and address card",
];

export function TemplateOrPromptStep() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTemplate = params.get("template") ?? undefined;

  const { data: templates } = useTemplates();
  const setTemplate = useGenerationStore((s) => s.setTemplate);
  const setPrompt = useGenerationStore((s) => s.setPrompt);
  const stored = useGenerationStore();

  const [tab, setTab] = React.useState<"template" | "prompt">(
    initialTemplate ? "template" : "template",
  );
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | undefined>(
    initialTemplate ?? stored.templateId,
  );
  const [text, setText] = React.useState(stored.prompt ?? "");

  function handleNext() {
    if (tab === "template") {
      const t = templates?.find((tpl) => tpl.id === selectedTemplateId);
      if (!t) return;
      setTemplate(t.id, t.platform);
    } else {
      if (text.trim().length < 6) return;
      setPrompt(text.trim(), "instagram-reels");
    }
    router.push("/new/style");
  }

  const canContinue =
    tab === "template" ? !!selectedTemplateId : text.trim().length >= 6;

  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="template" className="flex-1 md:flex-none">
            <LayoutTemplate className="h-4 w-4" />
            Pick a template
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex-1 md:flex-none">
            <Wand2 className="h-4 w-4" />
            Describe it
          </TabsTrigger>
        </TabsList>

        <TabsContent value="template">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {(templates ?? []).slice(0, 12).map((t) => {
              const active = selectedTemplateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border bg-card text-left transition",
                    active
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-border/60 hover:border-primary/30",
                  )}
                >
                  <div className="relative aspect-[9/16] w-full overflow-hidden">
                    <Image
                      src={t.thumbnail}
                      alt={t.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    {active && (
                      <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="absolute inset-x-2 bottom-2">
                      <p className="text-[10px] uppercase tracking-wider text-white/70">
                        {PLATFORM_EMOJI[t.platform]} {PLATFORM_LABELS[t.platform]}
                      </p>
                      <p className="text-xs font-semibold text-white line-clamp-1">
                        {t.title}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="prompt">
          <div className="space-y-3">
            <Textarea
              placeholder="A cinematic close-up of someone lighting a clay diya, warm bokeh background, festive atmosphere…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[160px] text-base"
            />
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="cursor-pointer hover:border-primary/40 hover:text-primary py-1 px-2"
                  onClick={() => setText(s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Step 1 of 3 · You won&apos;t be charged until you accept a render.
        </p>
        <Button size="lg" onClick={handleNext} disabled={!canContinue}>
          Pick a style
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
