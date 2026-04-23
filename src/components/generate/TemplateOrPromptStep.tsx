"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Wand2, LayoutTemplate, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const [tab, setTab] = React.useState<"template" | "prompt">("template");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<
    string | undefined
  >(initialTemplate ?? stored.templateId);
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
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as typeof tab)}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="template">
            <LayoutTemplate className="h-4 w-4" />
            Pick a template
          </TabsTrigger>
          <TabsTrigger value="prompt">
            <Wand2 className="h-4 w-4" />
            Describe it
          </TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {(templates ?? []).slice(0, 12).map((t) => {
              const active = selectedTemplateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border bg-white text-left transition-all",
                    active
                      ? "border-[#7C3AED] shadow-[0_10px_30px_-12px_rgba(124,58,237,0.35)] ring-2 ring-[#7C3AED]/25"
                      : "border-gray-200 shadow-sm hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md",
                  )}
                >
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={t.thumbnail}
                      alt={t.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {active && (
                      <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-[#7C3AED] text-white shadow-lg">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#7C3AED]">
                      {PLATFORM_EMOJI[t.platform]} {PLATFORM_LABELS[t.platform]}
                    </p>
                    <p className="mt-1 line-clamp-1 text-[13.5px] font-semibold text-gray-900">
                      {t.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="prompt" className="mt-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <Textarea
              placeholder="A cinematic close-up of someone lighting a clay diya, warm bokeh background, festive atmosphere…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[160px] border-0 bg-transparent p-0 text-[15px] shadow-none focus-visible:ring-0"
            />
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
              <span className="text-[12px] font-medium text-gray-500">
                Try:
              </span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setText(s)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] font-medium text-gray-700 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/5 hover:text-[#7C3AED]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-[12.5px] text-gray-500">
          Step 1 of 3 · You won&apos;t be charged until you accept a render.
        </p>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-6 text-[14px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(124,58,237,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-[0_14px_24px_-8px_rgba(124,58,237,0.55)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_20px_-6px_rgba(124,58,237,0.45)]"
        >
          Pick a style
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
