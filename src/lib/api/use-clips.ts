"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, asList } from "./client";
import { clipPatchToBody, mapClip } from "./adapters";
import { useAuthStore } from "@/lib/stores/auth-store";
import { meKey } from "./use-auth";
import { projectKey, projectsKey } from "./use-projects";
import type { Clip } from "@/types/clip";
import type { ClipDTO, GenerateBody, JobDTO } from "./types";

export const clipsByProjectKey = (projectId: string) =>
  ["clips", "by-project", projectId] as const;
export const clipKey = (id: string) => ["clips", id] as const;

export function useClips(projectId: string | undefined) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery<Clip[]>({
    queryKey: projectId ? clipsByProjectKey(projectId) : ["clips", "none"],
    enabled: !!token && !!projectId,
    queryFn: async () => {
      const raw = await api<ClipDTO[] | { items?: ClipDTO[] }>(
        `/clips/by-project/${projectId}`,
      );
      return asList<ClipDTO>(raw)
        .map(mapClip)
        .sort((a, b) => a.order - b.order);
    },
  });
}

export function useClip(id: string | undefined) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery<Clip>({
    queryKey: id ? clipKey(id) : ["clips", "none"],
    enabled: !!token && !!id,
    queryFn: async () => {
      const dto = await api<ClipDTO>(`/clips/${id}`);
      return mapClip(dto);
    },
  });
}

export function useUpdateClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; patch: Partial<Clip>; silent?: boolean }) => {
      const body = clipPatchToBody(vars.patch);
      const dto = await api<ClipDTO>(`/clips/${vars.id}`, {
        method: "PATCH",
        body,
      });
      return mapClip(dto);
    },
    onSuccess: (clip, vars) => {
      qc.setQueryData(clipKey(clip.id), clip);
      qc.setQueryData<Clip[]>(clipsByProjectKey(clip.projectId), (old) =>
        old?.map((c) => (c.id === clip.id ? clip : c)) ?? old,
      );
      if (vars.silent) return;
      qc.invalidateQueries({ queryKey: clipKey(clip.id) });
      qc.invalidateQueries({ queryKey: clipsByProjectKey(clip.projectId) });
      qc.invalidateQueries({ queryKey: projectKey(clip.projectId) });
    },
  });
}

export function useDeleteClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; projectId: string }) => {
      await api(`/clips/${vars.id}`, { method: "DELETE" });
      return vars;
    },
    onSuccess: ({ projectId }) => {
      qc.invalidateQueries({ queryKey: clipsByProjectKey(projectId) });
      qc.invalidateQueries({ queryKey: projectKey(projectId) });
    },
  });
}

export function useReorderClips(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, idx) =>
          api(`/clips/${id}`, {
            method: "PATCH",
            body: { position: idx },
          }),
        ),
      );
      return orderedIds;
    },
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: clipsByProjectKey(projectId) });
      const prev = qc.getQueryData<Clip[]>(clipsByProjectKey(projectId));
      if (prev) {
        const map = new Map(prev.map((c) => [c.id, c]));
        const next = ids
          .map((id, idx) => {
            const c = map.get(id);
            return c ? { ...c, order: idx } : null;
          })
          .filter(Boolean) as Clip[];
        qc.setQueryData(clipsByProjectKey(projectId), next);
      }
      return { prev };
    },
    onError: (_err, _ids, ctx) => {
      if (ctx?.prev) qc.setQueryData(clipsByProjectKey(projectId), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: clipsByProjectKey(projectId) });
    },
  });
}

/**
 * Build an optimistic placeholder Clip from the job we just submitted, so
 * the workspace and editor show a "rendering" card immediately while the
 * background poll runs.
 */
function buildPlaceholderClip(args: {
  clipId: string;
  projectId: string;
  title?: string | null;
  prompt?: string | null;
}): Clip {
  return mapClip({
    id: args.clipId,
    project_id: args.projectId,
    position: 0,
    title: args.title ?? "Generating…",
    prompt: args.prompt ?? "",
    duration_seconds: 0,
    status: "queued",
    created_at: new Date().toISOString(),
  });
}

export interface GenerateClipResult {
  clip: Clip;
  job: JobDTO;
}

export interface GenerateClipVars {
  projectId: string;
  body: GenerateBody;
}

/**
 * NEW BEHAVIOUR: submit only. Does NOT block on polling — returns as soon
 * as the backend accepts the job (typically <1s). The caller redirects to
 * the editor immediately, where `useJob(jobId)` polls in the background and
 * refreshes the clip when the render finishes.
 *
 * Side effect: drops an optimistic placeholder Clip into the project's
 * clip list cache so the workspace shows a "rendering" card right away.
 */
export function useGenerateClip() {
  const qc = useQueryClient();

  return useMutation<GenerateClipResult, Error, GenerateClipVars>({
    mutationFn: async ({ projectId, body }) => {
      if (!projectId) {
        throw new Error("Cannot generate: missing project id");
      }

      const job = await api<JobDTO>(
        `/clips/by-project/${projectId}/generate`,
        { method: "POST", body },
      );

      if (!job?.id) {
        console.error("[generate] Unexpected response shape:", job);
        throw new Error("Generate endpoint did not return a job id");
      }

      const clipId = job.clip_id;
      if (!clipId) {
        throw new Error("Generate response missing clip_id");
      }

      const placeholder = buildPlaceholderClip({
        clipId,
        projectId,
        title: body.title,
        prompt: body.prompt,
      });

      // Drop placeholder into the project's clip list so the workspace shows
      // it immediately. Real status will arrive via useJob -> useClip refetch.
      qc.setQueryData<Clip[]>(clipsByProjectKey(projectId), (old) => {
        const list = old ? [...old] : [];
        const exists = list.some((c) => c.id === placeholder.id);
        return exists
          ? list.map((c) => (c.id === placeholder.id ? placeholder : c))
          : [...list, placeholder];
      });

      // Seed the clip cache too so /edit/{clipId} renders without a flash
      qc.setQueryData<Clip>(clipKey(clipId), placeholder);

      // Seed the job cache so the editor's useJob hook gets initial data
      // without an extra request.
      qc.setQueryData(["jobs", job.id], job);

      return { clip: placeholder, job };
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: clipsByProjectKey(vars.projectId) });
      qc.invalidateQueries({ queryKey: projectKey(vars.projectId) });
      qc.invalidateQueries({ queryKey: projectsKey });
      qc.invalidateQueries({ queryKey: meKey });
    },
  });
}
