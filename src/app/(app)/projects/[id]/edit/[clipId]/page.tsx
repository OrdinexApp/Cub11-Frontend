"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { EditorShell } from "@/components/editor/EditorShell";
import { useProjectsStore } from "@/lib/stores/projects-store";

export default function ClipEditorPage({
  params,
}: {
  params: Promise<{ id: string; clipId: string }>;
}) {
  const { id, clipId } = use(params);
  const clip = useProjectsStore((s) => s.getClip(id, clipId));
  if (!clip) return notFound();
  return <EditorShell clip={clip} projectId={id} />;
}
