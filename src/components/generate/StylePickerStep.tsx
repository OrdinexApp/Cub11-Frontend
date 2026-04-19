"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { STYLES } from "@/lib/data/styles";
import { useGenerationStore } from "@/lib/stores/generation-store";
import { cn } from "@/lib/utils";

export function StylePickerStep() {
  const router = useRouter();
  const stored = useGenerationStore();
  const setStyle = useGenerationStore((s) => s.setStyle);
  const [selected, setSelected] = React.useState<string | undefined>(stored.styleId);

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STYLES.map((s) => {
          const active = selected === s.id;
          return (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(s.id)}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-card p-5 text-left transition",
                "min-h-[148px]",
                active
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border/60 hover:border-primary/30",
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", s.gradient)} />
              <div className="relative flex items-start justify-between">
                <div className="text-3xl">{s.emoji}</div>
                {active && (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
              <div className="relative mt-6">
                <h3 className="text-xl font-semibold tracking-tight">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Step 2 of 3 · No technical jargon — just pick a vibe.
        </p>
        <Button size="lg" onClick={handleNext} disabled={!selected}>
          Generate preview
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
