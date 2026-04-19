import { create } from "zustand";
import type { Clip } from "@/types/clip";

export type EditorTab = "subtitles" | "music" | "text" | "trim";

interface EditorState {
  clip: Clip | null;
  activeTab: EditorTab;
  setClip: (clip: Clip) => void;
  setActiveTab: (tab: EditorTab) => void;
  patchSubtitles: (patch: Partial<Clip["subtitles"]>) => void;
  patchMusic: (patch: Partial<Clip["music"]>) => void;
  patchTrim: (patch: Partial<Clip["trim"]>) => void;
  addOverlay: (text: string) => void;
  removeOverlay: (id: string) => void;
  updateOverlay: (id: string, patch: Partial<Clip["overlays"][number]>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  clip: null,
  activeTab: "subtitles",
  setClip: (clip) => set({ clip }),
  setActiveTab: (activeTab) => set({ activeTab }),
  patchSubtitles: (patch) =>
    set((s) =>
      s.clip ? { clip: { ...s.clip, subtitles: { ...s.clip.subtitles, ...patch } } } : s,
    ),
  patchMusic: (patch) =>
    set((s) =>
      s.clip ? { clip: { ...s.clip, music: { ...s.clip.music, ...patch } } } : s,
    ),
  patchTrim: (patch) =>
    set((s) =>
      s.clip ? { clip: { ...s.clip, trim: { ...s.clip.trim, ...patch } } } : s,
    ),
  addOverlay: (text) =>
    set((s) =>
      s.clip
        ? {
            clip: {
              ...s.clip,
              overlays: [
                ...s.clip.overlays,
                {
                  id: `o-${Date.now()}`,
                  text,
                  position: "middle",
                  style: "headline",
                },
              ],
            },
          }
        : s,
    ),
  removeOverlay: (id) =>
    set((s) =>
      s.clip
        ? { clip: { ...s.clip, overlays: s.clip.overlays.filter((o) => o.id !== id) } }
        : s,
    ),
  updateOverlay: (id, patch) =>
    set((s) =>
      s.clip
        ? {
            clip: {
              ...s.clip,
              overlays: s.clip.overlays.map((o) =>
                o.id === id ? { ...o, ...patch } : o,
              ),
            },
          }
        : s,
    ),
}));
