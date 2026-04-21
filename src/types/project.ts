import type { Clip } from "./clip";
import type { Template, TemplatePlatform } from "./template";

export interface Project {
  id: string;
  title: string;
  description: string;
  aspect: Template["aspect"];
  cover: string;
  platform: TemplatePlatform;
  createdAt: string;
  updatedAt: string;
  clips: Clip[];
}
