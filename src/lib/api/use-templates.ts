"use client";

import { useQuery } from "@tanstack/react-query";
import { api, asList } from "./client";
import { mapTemplate } from "./adapters";
import type { TemplateDTO } from "./types";
import type { Template } from "@/types/template";

export const templatesKey = ["templates"] as const;
export const templateKey = (id: string) => ["templates", id] as const;

export function useTemplates() {
  return useQuery<Template[]>({
    queryKey: templatesKey,
    queryFn: async () => {
      const raw = await api<TemplateDTO[] | { items?: TemplateDTO[] }>("/templates");
      return asList<TemplateDTO>(raw).map(mapTemplate);
    },
    staleTime: 5 * 60_000,
  });
}

export function useTemplate(id: string | undefined) {
  return useQuery<Template>({
    queryKey: id ? templateKey(id) : ["templates", "none"],
    enabled: !!id,
    queryFn: async () => {
      const dto = await api<TemplateDTO>(`/templates/${id}`);
      return mapTemplate(dto);
    },
  });
}
