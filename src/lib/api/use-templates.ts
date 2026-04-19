"use client";

import { useQuery } from "@tanstack/react-query";
import { TEMPLATES } from "@/lib/data/templates";
import { sleep } from "@/lib/utils";
import type { Template } from "@/types/template";

async function fetchTemplates(): Promise<Template[]> {
  await sleep(150);
  return TEMPLATES;
}

export function useTemplates() {
  return useQuery({ queryKey: ["templates"], queryFn: fetchTemplates });
}
