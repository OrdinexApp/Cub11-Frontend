import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "@/types/project";
import type { Clip } from "@/types/clip";
import { SEED_PROJECTS } from "@/lib/data/projects";

interface ProjectsState {
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  getClip: (projectId: string, clipId: string) => Clip | undefined;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  reorderClips: (projectId: string, ids: string[]) => void;
  appendClip: (projectId: string, clip: Clip) => void;
  updateClip: (projectId: string, clipId: string, patch: Partial<Clip>) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: SEED_PROJECTS,
      getProject: (id) => get().projects.find((p) => p.id === id),
      getClip: (projectId, clipId) =>
        get().projects.find((p) => p.id === projectId)?.clips.find((c) => c.id === clipId),
      addProject: (project) =>
        set((s) => ({ projects: [project, ...s.projects] })),
      removeProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
      reorderClips: (projectId, ids) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== projectId) return p;
            const map = new Map(p.clips.map((c) => [c.id, c]));
            const reordered = ids
              .map((id, i) => {
                const c = map.get(id);
                return c ? { ...c, order: i } : null;
              })
              .filter(Boolean) as Clip[];
            return { ...p, clips: reordered, updatedAt: new Date().toISOString() };
          }),
        })),
      appendClip: (projectId, clip) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  clips: [...p.clips, { ...clip, order: p.clips.length }],
                  updatedAt: new Date().toISOString(),
                }
              : p,
          ),
        })),
      updateClip: (projectId, clipId, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  clips: p.clips.map((c) => (c.id === clipId ? { ...c, ...patch } : c)),
                  updatedAt: new Date().toISOString(),
                }
              : p,
          ),
        })),
    }),
    { name: "cube11-projects", version: 1 },
  ),
);
