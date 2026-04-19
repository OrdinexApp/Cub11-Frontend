"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewCanvas } from "./PreviewCanvas";
import { EditorTabs } from "./EditorTabs";
import { useEditorStore } from "@/lib/stores/editor-store";
import { useProjectsStore } from "@/lib/stores/projects-store";
import type { Clip } from "@/types/clip";

export function EditorShell({ clip, projectId }: { clip: Clip; projectId: string }) {
  const setClip = useEditorStore((s) => s.setClip);
  const editorClip = useEditorStore((s) => s.clip);
  const updateClip = useProjectsStore((s) => s.updateClip);
  const router = useRouter();

  React.useEffect(() => {
    setClip(clip);
  }, [clip, setClip]);

  function save() {
    if (!editorClip) return;
    updateClip(projectId, editorClip.id, editorClip);
    router.push(`/projects/${projectId}`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-6 md:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
        <Button size="lg" onClick={save}>
          <Check className="h-4 w-4" />
          Save changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="lg:sticky lg:top-6 self-start">
          <PreviewCanvas />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Live preview · changes apply instantly
          </p>
        </div>

        <div className="min-w-0">
          <EditorTabs />
        </div>
      </div>
    </div>
  );
}
