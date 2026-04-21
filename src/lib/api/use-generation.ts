"use client";

import { useMutation } from "@tanstack/react-query";
import { sleep } from "@/lib/utils";

const PREVIEW_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

export interface PreviewRequest {
  prompt?: string;
  templateId?: string;
  styleId?: string;
}

export interface PreviewResult {
  previewUrl: string;
  thumbnail: string;
  estimatedRenderCredits: number;
}

/**
 * Local-only preview. The backend has no preview endpoint — only the paid
 * `POST /clips/by-project/{id}/generate` exists. We keep a free client-side
 * mock so users can iterate on prompts before committing credits.
 * Once the backend exposes a preview endpoint, swap the body of `mutationFn`.
 */
export function usePreviewGeneration() {
  return useMutation({
    mutationFn: async (req: PreviewRequest): Promise<PreviewResult> => {
      await sleep(1200);
      const idx = Math.floor(Math.random() * PREVIEW_VIDEOS.length);
      const seed = req.templateId ?? req.prompt ?? "preview";
      return {
        previewUrl: PREVIEW_VIDEOS[idx],
        thumbnail: `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/900`,
        estimatedRenderCredits: 5,
      };
    },
  });
}
