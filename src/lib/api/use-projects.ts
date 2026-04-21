"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, asList } from "./client";
import { mapProject } from "./adapters";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Project } from "@/types/project";
import type { CreateProjectBody, ProjectDTO } from "./types";

export const projectsKey = ["projects"] as const;
export const projectKey = (id: string) => ["projects", id] as const;

export function useProjects() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery<Project[]>({
    queryKey: projectsKey,
    enabled: !!token,
    queryFn: async () => {
      const raw = await api<ProjectDTO[] | { items?: ProjectDTO[] }>("/projects");
      return asList<ProjectDTO>(raw).map((d) => mapProject(d));
    },
  });
}

export function useProject(id: string | undefined) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery<Project>({
    queryKey: id ? projectKey(id) : ["projects", "none"],
    enabled: !!token && !!id,
    queryFn: async () => {
      const dto = await api<ProjectDTO>(`/projects/${id}`);
      return mapProject(dto);
    },
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateProjectBody) => {
      const dto = await api<ProjectDTO>("/projects", {
        method: "POST",
        body,
      });
      return mapProject(dto);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectsKey });
    },
  });
}

export function usePatchProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: string;
      patch: Partial<CreateProjectBody>;
    }) => {
      const dto = await api<ProjectDTO>(`/projects/${vars.id}`, {
        method: "PATCH",
        body: vars.patch,
      });
      return mapProject(dto);
    },
    onSuccess: (project) => {
      qc.invalidateQueries({ queryKey: projectsKey });
      qc.invalidateQueries({ queryKey: projectKey(project.id) });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api(`/projects/${id}`, { method: "DELETE" });
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectsKey });
    },
  });
}
