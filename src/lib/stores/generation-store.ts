import { create } from "zustand";
import type { TemplatePlatform } from "@/types/template";

interface GenerationState {
  templateId?: string;
  prompt?: string;
  styleId?: string;
  platform?: TemplatePlatform;
  previewUrl?: string;
  reset: () => void;
  setTemplate: (id: string, platform: TemplatePlatform) => void;
  setPrompt: (prompt: string, platform: TemplatePlatform) => void;
  setStyle: (id: string) => void;
  setPreview: (url: string) => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  reset: () =>
    set({
      templateId: undefined,
      prompt: undefined,
      styleId: undefined,
      platform: undefined,
      previewUrl: undefined,
    }),
  setTemplate: (id, platform) => set({ templateId: id, prompt: undefined, platform }),
  setPrompt: (prompt, platform) => set({ prompt, templateId: undefined, platform }),
  setStyle: (id) => set({ styleId: id }),
  setPreview: (url) => set({ previewUrl: url }),
}));
