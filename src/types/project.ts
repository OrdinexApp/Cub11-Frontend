import type { Clip } from "./clip";
import type { TemplatePlatform } from "./template";

export interface Project {
  id: string;
  title: string;
  cover: string;
  platform: TemplatePlatform;
  createdAt: string;
  updatedAt: string;
  clips: Clip[];
}

export type CreditEntryReason =
  | "preview"
  | "render"
  | "refund-failed"
  | "topup"
  | "welcome";

export interface CreditEntry {
  id: string;
  at: string;
  amount: number;
  reason: CreditEntryReason;
  note: string;
  refunded?: boolean;
}
