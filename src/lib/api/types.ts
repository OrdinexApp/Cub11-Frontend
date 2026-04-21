import type { TemplatePlatform } from "@/types/template";

export interface TokenResponseDTO {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserDTO {
  id: string;
  email: string;
  full_name?: string | null;
  credits_remaining: number;
}

/**
 * Real backend Project shape. Note:
 *   - cover field is `cover_image_url` (not `cover_url`)
 *   - `platform` is NOT stored server-side (silently dropped on POST/PATCH)
 *   - `owner_id` replaces what we used to call user_id
 */
export interface ProjectDTO {
  id: string;
  owner_id?: string;
  title: string;
  description?: string | null;
  aspect_ratio: "9:16" | "16:9" | "1:1" | "4:5";
  cover_image_url?: string | null;
  created_at: string;
  updated_at: string;
  clip_count?: number;
  // Frontend-only hint, never returned by backend but accepted on create:
  platform?: TemplatePlatform;
}

/**
 * Real backend shape for a template (from GET /api/v1/templates).
 * Note: uses `name` (not `title`), `category` (not `platform`),
 * `duration_seconds` (not `duration_sec`), and a `regions[]` array.
 * The list endpoint wraps these in `{ items, total, page, page_size }`.
 */
export type TemplateCategory =
  | "tiktok"
  | "reels"
  | "shorts"
  | "stories"
  | "square"
  | "ecommerce";

export interface TemplateDTO {
  id: string;
  slug?: string | null;
  name: string;
  description?: string | null;
  category: TemplateCategory;
  aspect_ratio: "9:16" | "16:9" | "1:1" | "4:5";
  duration_seconds: number;
  regions?: string[] | null;
  languages?: string[] | null;
  tags?: string[] | null;
  preview_image_url?: string | null;
  thumbnail_url?: string | null;
  preview_video_url?: string | null;
  credit_cost?: number | null;
  is_premium?: boolean | null;
  is_active?: boolean | null;
  created_at?: string;
}

/**
 * Real backend Clip shape (verified by hitting GET /api/v1/clips/{id}).
 *
 * Differences from our previous assumptions:
 *   - `position` (not `order`)
 *   - `duration_seconds` (not `duration_sec`)
 *   - `trim_start` / `trim_end` are top-level (no nested trim object)
 *   - no `speed` field on the backend (frontend-only)
 *   - `music_track_url` is a single string URL, no embedded music object
 *   - no `overlays` field at all (frontend-only state until backend adds it)
 *   - `subtitles` is currently null in responses; structure TBD on backend
 *   - status: queued | running | succeeded | failed | cancelled
 */
export type ClipStatus =
  | "pending"
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "ready"
  | "rendering";

export interface ClipSubtitlesDTO {
  enabled?: boolean;
  language?: string;
  style?: "minimal" | "bold" | "karaoke" | "impact";
  position?: "top" | "middle" | "bottom";
  [k: string]: unknown;
}

export interface ClipDTO {
  id: string;
  project_id: string;
  template_id?: string | null;
  title: string;
  prompt: string;
  status: ClipStatus;
  video_url?: string | null;
  thumbnail_url?: string | null;
  duration_seconds?: number | null;
  width?: number | null;
  height?: number | null;
  subtitles?: ClipSubtitlesDTO | null;
  music_track_url?: string | null;
  trim_start?: number | null;
  trim_end?: number | null;
  position?: number | null;
  created_at: string;
  updated_at?: string;
}

/**
 * Real backend `JobOut` returned from POST .../generate and GET /jobs/{id}.
 * The clip is created server-side; its id lives at `clip_id` and you must
 * fetch the actual ClipDTO from GET /clips/{clip_id} after the job succeeds.
 */
export type JobStatus =
  | "pending"
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export interface JobResultDTO {
  video_url?: string | null;
  thumbnail_url?: string | null;
  duration_seconds?: number | null;
  width?: number | null;
  height?: number | null;
  clip_id?: string;
  clip?: ClipDTO;
  [k: string]: unknown;
}

export interface JobDTO {
  id: string;
  user_id?: string;
  clip_id?: string;
  kind?: string;
  status: JobStatus;
  progress?: number | null;
  celery_task_id?: string | null;
  gpu_queue?: string | null;
  error_message?: string | null;
  payload?: Record<string, unknown> | null;
  result?: JobResultDTO | null;
  credits_charged?: number | null;
  started_at?: string | null;
  finished_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectBody {
  title: string;
  description?: string;
  platform?: TemplatePlatform;
  aspect_ratio: ProjectDTO["aspect_ratio"];
  cover_image_url?: string;
}

/**
 * PATCH /clips/{id} body. Mirrors the real backend column names.
 * Frontend-only state (overlays, playback speed, subtitle style, mood)
 * is not persisted server-side until the backend exposes those fields.
 */
export interface PatchClipBody {
  title?: string;
  position?: number;
  subtitles?: ClipSubtitlesDTO | null;
  music_track_url?: string | null;
  music_volume?: number | null;
  trim_start?: number | null;
  trim_end?: number | null;
  speed?: number | null;
  playback_speed?: number | null;
  overlays?: Array<{
    id?: string;
    text?: string;
    position?: "top" | "middle" | "bottom";
    style?: "headline" | "caption" | "tag";
  }>;
}

/**
 * Real backend ClipGenerateRequest. All fields are optional, but at minimum
 * one of `prompt` or `template_id` must be sent. `params` is free-form and
 * is forwarded to the model (e.g. `{ seed, fps, seconds, resolution }`).
 */
export interface GenerateBody {
  title?: string | null;
  template_id?: string | null;
  prompt?: string | null;
  params?: Record<string, unknown>;
}
