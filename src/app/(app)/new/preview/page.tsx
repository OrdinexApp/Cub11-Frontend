"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StepShell } from "@/components/generate/StepShell";
import { PreviewStep } from "@/components/generate/PreviewStep";

function PreviewPageInner() {
  const params = useSearchParams();
  const projectId = params.get("project") ?? undefined;

  return (
    <StepShell
      current={3}
      backHref="/new/style"
      title="Like it? Render in HD."
      subtitle="Previews are free. You only spend credits when you accept."
    >
      <PreviewStep projectId={projectId} />
    </StepShell>
  );
}

export default function NewPreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewPageInner />
    </Suspense>
  );
}
