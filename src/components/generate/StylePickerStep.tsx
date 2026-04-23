"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { STYLES } from "@/lib/data/styles";
import { useGenerationStore } from "@/lib/stores/generation-store";
import { cn } from "@/lib/utils";

export function StylePickerStep() {
  const router = useRouter();
  const stored = useGenerationStore();
  const setStyle = useGenerationStore((s) => s.setStyle);
  const [selected, setSelected] = React.useState<string | undefined>(
    stored.styleId,
  );

  React.useEffect(() => {
    if (!stored.templateId && !stored.prompt) {
      router.replace("/new");
    }
  }, [stored.templateId, stored.prompt, router]);

  function handleNext() {
    if (!selected) return;
    setStyle(selected);
    router.push("/new/preview");
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STYLES.map((s) => {
          const active = selected === s.id;
          return (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelected(s.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all",
                "min-h-[164px]",
                active
                  ? "border-[#7C3AED] shadow-[0_14px_34px_-14px_rgba(124,58,237,0.4)] ring-2 ring-[#7C3AED]/25"
                  : "border-gray-200 shadow-sm hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md",
              )}
            >
              {/* Soft pastel wash */}
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity",
                  s.gradient,
                  active ? "opacity-80" : "group-hover:opacity-75",
                )}
              />

              <div className="relative flex items-start justify-between">
                <div
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-2xl text-white shadow-md",
                    s.accent,
                  )}
                >
                  {s.emoji}
                </div>
                {active && (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#7C3AED] text-white shadow-md">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>

              <div className="relative mt-6">
                <h3 className="text-[18px] font-semibold tracking-tight text-gray-900">
                  {s.name}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-gray-600">
                  {s.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-[12.5px] text-gray-500">
          Step 2 of 3 · No technical jargon — just pick a vibe.
        </p>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selected}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-6 text-[14px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(124,58,237,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-[0_14px_24px_-8px_rgba(124,58,237,0.55)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_20px_-6px_rgba(124,58,237,0.45)]"
        >
          Generate preview
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
