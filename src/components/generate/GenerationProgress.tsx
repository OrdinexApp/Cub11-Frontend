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
    <div className="grid place-items-center rounded-3xl border border-gray-200 bg-white/90 p-8 text-center shadow-sm backdrop-blur">
      <motion.div
        animate={{ rotate: [0, 12, -8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] shadow-md"
      >
        <Sparkles className="h-7 w-7 text-white" />
      </motion.div>
      <p className="mt-4 text-[14px] font-semibold text-gray-900">
        {message ?? STEPS[step]}
      </p>
      <p className="mt-1 text-[11.5px] text-gray-500">
        Free preview, no credits used
      </p>
      <div className="mt-5 w-full max-w-xs">
        <Progress value={pct} />
      </div>
    </div>
  );
}
