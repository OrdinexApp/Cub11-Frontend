import { Suspense } from "react";
import { StepShell } from "@/components/generate/StepShell";
import { TemplateOrPromptStep } from "@/components/generate/TemplateOrPromptStep";

export const metadata = { title: "New project · Cube11" };

export default function NewPage() {
  return (
    <StepShell
      current={1}
      backHref="/projects"
      title="What are you making?"
      subtitle="Pick a ready-to-go template or just type the idea — we'll do the rest."
    >
      <Suspense fallback={null}>
        <TemplateOrPromptStep />
      </Suspense>
    </StepShell>
  );
}
