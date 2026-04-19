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

export function usePreviewGeneration() {
  return useMutation({
    mutationFn: async (req: PreviewRequest): Promise<PreviewResult> => {
      await sleep(1800);
      const idx = Math.floor(Math.random() * PREVIEW_VIDEOS.length);
      const seed = req.templateId ?? req.prompt ?? "preview";
      return {
        previewUrl: PREVIEW_VIDEOS[idx],
        thumbnail: `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/900`,
        estimatedRenderCredits: 12,
      };
    },
  });
}

export interface RenderRequest extends PreviewRequest {
  previewUrl: string;
  thumbnail: string;
  credits: number;
}

export function useRenderHd() {
  return useMutation({
    mutationFn: async (req: RenderRequest) => {
      await sleep(1200);
      return {
        videoUrl: req.previewUrl,
        thumbnail: req.thumbnail,
        durationSec: 8,
      };
    },
  });
}
