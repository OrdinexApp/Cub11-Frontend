"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  "Reading your idea…",
  "Casting the look and feel…",
  "Generating frames…",
  "Polishing motion…",
  "Almost there…",
];

export function GenerationProgress({ message }: { message?: string }) {
  const [step, setStep] = React.useState(0);
  const [pct, setPct] = React.useState(8);

  React.useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
      setPct((p) => Math.min(p + 18 + Math.random() * 8, 92));
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid place-items-center rounded-3xl border border-border/60 bg-card p-10 text-center">
      <motion.div
        animate={{ rotate: [0, 12, -8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/40 to-violet-600/30"
      >
        <Sparkles className="h-7 w-7 text-primary" />
      </motion.div>
      <p className="mt-5 text-base font-medium">{message ?? STEPS[step]}</p>
      <p className="mt-1 text-xs text-muted-foreground">Free preview, no credits used</p>
      <div className="mt-6 w-full max-w-xs">
        <Progress value={pct} />
      </div>
    </div>
  );
}
