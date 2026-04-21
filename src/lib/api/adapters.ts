import type { Project } from "@/types/project";
import type { Clip } from "@/types/clip";
import type { Template, TemplateMood, TemplatePlatform } from "@/types/template";
import type {
  ProjectDTO,
  ClipDTO,
  TemplateDTO,
  TemplateCategory,
  PatchClipBody,
} from "./types";
import { getRegionalTemplatePreview } from "@/lib/data/template-previews";

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const MEDIA_HOST = RAW_BASE.replace(/\/+$/, "");

const FALLBACK_COVER = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/600`;
const FALLBACK_THUMB = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/900`;

/**
 * Backend can return a media URL as:
 *   - absolute http(s) URL   → use as-is
 *   - relative "/media/..."  → prefix with the API host
 *   - relative "media/..."   → prefix with API host + "/"
 *   - data URL / blob URL    → use as-is
 *   - null/undefined         → return undefined
 */
export function resolveMediaUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `${MEDIA_HOST}${trimmed}`;
  return `${MEDIA_HOST}/${trimmed}`;
}

export function mapProject(dto: ProjectDTO, clips: Clip[] = []): Project {
  return {
    id: dto.id,
    title: toString_(dto.title, "Untitled project"),
    description: toString_(dto.description, ""),
    aspect: dto.aspect_ratio,
    cover: resolveMediaUrl(dto.cover_image_url) ?? FALLBACK_COVER(dto.id),
    platform: dto.platform ?? "instagram-reels",
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    clips,
  };
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function pick<T extends Record<string, unknown>>(
  src: T,
  keys: string[],
): unknown {
  for (const key of keys) {
    if (key in src) return src[key];
  }
  return undefined;
}

function pickNumber<T extends Record<string, unknown>>(
  src: T,
  keys: string[],
  fallback = 0,
): number {
  return toFiniteNumber(pick(src, keys), fallback);
}

function toString_(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim() || fallback;
  if (value == null) return fallback;
  return String(value);
}

function toSubtitleStyle(value: unknown): Clip["subtitles"]["style"] {
  const v = toString_(value, "bold");
  return v === "minimal" || v === "karaoke" || v === "impact" ? v : "bold";
}

function toSubtitlePosition(value: unknown): Clip["subtitles"]["position"] {
  const v = toString_(value, "bottom");
  return v === "top" || v === "middle" ? v : "bottom";
}

function toOverlayStyle(value: unknown): Clip["overlays"][number]["style"] {
  const v = toString_(value, "headline");
  return v === "caption" || v === "tag" ? v : "headline";
}

function toOverlayPosition(value: unknown): Clip["overlays"][number]["position"] {
  const v = toString_(value, "middle");
  return v === "top" || v === "bottom" ? v : "middle";
}

function parseSubtitles(raw: Record<string, unknown>): Clip["subtitles"] {
  const subtitles =
    (raw.subtitles as Record<string, unknown> | null | undefined) ?? undefined;
  const nestedStyle =
    subtitles?.appearance &&
    typeof subtitles.appearance === "object" &&
    (subtitles.appearance as Record<string, unknown>).style;
  const nestedPosition =
    subtitles?.appearance &&
    typeof subtitles.appearance === "object" &&
    (subtitles.appearance as Record<string, unknown>).position;

  return {
    enabled: !!(subtitles?.enabled ?? pick(raw, ["subtitle_enabled", "subtitles_enabled"])),
    language: toString_(subtitles?.language ?? pick(raw, ["subtitle_language"]), "en"),
    style: toSubtitleStyle(
      subtitles?.style ?? nestedStyle ?? pick(raw, ["subtitle_style", "subtitles_style"]),
    ),
    position: toSubtitlePosition(
      subtitles?.position ??
        nestedPosition ??
        pick(raw, ["subtitle_position", "subtitles_position"]),
    ),
  };
}

function parseOverlays(raw: Record<string, unknown>, clipId: string): Clip["overlays"] {
  const source =
    (Array.isArray(raw.overlays) && raw.overlays) ||
    (Array.isArray(raw.text_overlays) && raw.text_overlays) ||
    (Array.isArray(raw.overlay_texts) && raw.overlay_texts) ||
    [];

  return source
    .map((item, idx) => {
      const o = (item ?? {}) as Record<string, unknown>;
      const text = toString_(o.text ?? o.value ?? o.label, "");
      if (!text) return null;
      return {
        id: toString_(o.id, `ov-${clipId}-${idx}`),
        text,
        position: toOverlayPosition(o.position),
        style: toOverlayStyle(o.style),
      };
    })
    .filter((o): o is Clip["overlays"][number] => !!o);
}

/**
 * Map backend clip status (queued | running | succeeded | failed | cancelled
 * | ready | rendering) to the simpler frontend tri-state.
 *
 * We treat "ready" only when both: backend says succeeded/ready AND there's
 * a real video_url. A clip that's marked succeeded but has no file is still
 * effectively "rendering" for the user.
 */
function mapClipStatus(
  raw: ClipDTO["status"] | undefined,
  hasVideo: boolean,
): Clip["status"] {
  switch (raw) {
    case "succeeded":
    case "ready":
      return hasVideo ? "ready" : "rendering";
    case "queued":
    case "pending":
    case "running":
    case "rendering":
      return "rendering";
    case "failed":
      return "failed";
    case "cancelled":
      return "cancelled";
    default:
      return "preview";
  }
}

export function mapClip(dto: ClipDTO): Clip {
  const raw = dto as unknown as Record<string, unknown>;

  const videoUrl = resolveMediaUrl(
    toString_(pick(raw, ["video_url", "videoUrl", "result_video_url"]), ""),
  );
  const thumbnail =
    resolveMediaUrl(
      toString_(
        pick(raw, [
          "thumbnail_url",
          "thumbnailUrl",
          "cover_image_url",
          "coverUrl",
        ]),
        "",
      ),
    ) ?? FALLBACK_THUMB(dto.id);
  const durationSec = pickNumber(
    raw,
    ["duration_seconds", "duration_sec", "duration"],
    0,
  );
  const order = pickNumber(raw, ["position", "order"], 0);

  const trimObject = raw.trim as Record<string, unknown> | undefined;
  const trimStart =
    pickNumber(raw, ["trim_start", "trimStart"], NaN) ||
    toFiniteNumber(trimObject?.start, 0) ||
    toFiniteNumber(trimObject?.start_sec, 0) ||
    toFiniteNumber(trimObject?.startSec, 0);
  const trimEnd =
    pick(raw, ["trim_end", "trimEnd"]) != null &&
    Number.isFinite(Number(pick(raw, ["trim_end", "trimEnd"])))
      ? Number(pick(raw, ["trim_end", "trimEnd"]))
      : Number.isFinite(Number(trimObject?.end))
        ? Number(trimObject?.end)
        : Number.isFinite(Number(trimObject?.end_sec))
          ? Number(trimObject?.end_sec)
          : Number.isFinite(Number(trimObject?.endSec))
            ? Number(trimObject?.endSec)
      : durationSec;
  const speedRaw =
    pick(raw, ["speed", "playback_speed", "playbackRate"]) ??
    trimObject?.speed ??
    trimObject?.playback_rate ??
    trimObject?.playbackRate;
  const speed = Math.max(0.25, toFiniteNumber(speedRaw, 1));

  const musicObj = raw.music as Record<string, unknown> | undefined;
  const rawMusicTrack = toString_(
    pick(raw, ["music_track_url", "musicTrackUrl"]) ??
      musicObj?.track_url ??
      musicObj?.url ??
      musicObj?.trackUrl,
    "",
  );
  const musicTrackUrl = resolveMediaUrl(
    toString_(
      rawMusicTrack,
      "",
    ),
  );
  const musicVolume = Math.max(
    0,
    Math.min(
      100,
      pickNumber(
        raw,
        ["music_volume", "musicVolume"],
        toFiniteNumber(musicObj?.volume, 60),
      ),
    ),
  );

  const statusRaw = toString_(pick(raw, ["status", "job_status"]), dto.status);
  const subtitles = parseSubtitles(raw);
  const overlays = parseOverlays(raw, dto.id);
  const trackUrl = musicTrackUrl ?? (rawMusicTrack || undefined);

  return {
    id: dto.id,
    projectId: dto.project_id,
    templateId: dto.template_id ?? undefined,
    order,
    title: toString_(dto.title, "Untitled clip"),
    prompt: toString_(dto.prompt, ""),
    thumbnail,
    videoUrl: videoUrl ?? "",
    durationSec,
    width: toFiniteNumber(dto.width, 0) || undefined,
    height: toFiniteNumber(dto.height, 0) || undefined,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    status: mapClipStatus(statusRaw as ClipDTO["status"], !!videoUrl),
    subtitles,
    music: trackUrl
      ? {
          enabled: true,
          trackUrl,
          trackName: rawMusicTrack || trackUrl,
          trackId: toString_(musicObj?.id, ""),
          mood: toString_(musicObj?.mood, ""),
          volume: musicVolume,
        }
      : { enabled: false, volume: musicVolume },
    overlays,
    trim: {
      startSec: trimStart,
      endSec: trimEnd,
      speed,
    },
  };
}

const CATEGORY_TO_PLATFORM: Record<TemplateCategory, TemplatePlatform> = {
  tiktok: "tiktok",
  reels: "instagram-reels",
  shorts: "youtube-shorts",
  stories: "whatsapp-status",
  square: "facebook-ads",
  ecommerce: "facebook-ads",
};

const FRONTEND_REGIONS = new Set(["in", "id", "vn", "ph", "th"]);

function deriveMood(tags?: string[] | null): TemplateMood {
  if (!tags || tags.length === 0) return "clean";
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.some((t) => ["asmr", "calm", "soft", "relax"].includes(t)))
    return "calm";
  if (lower.some((t) => ["luxury", "premium", "elegant"].includes(t)))
    return "luxury";
  if (lower.some((t) => ["fun", "playful", "dance", "meme"].includes(t)))
    return "playful";
  if (lower.some((t) => ["bold", "punchy", "ad"].includes(t))) return "bold";
  if (lower.some((t) => ["energetic", "hype", "fast"].includes(t)))
    return "energetic";
  return "clean";
}

function deriveRegion(
  regions?: string[] | null,
): Template["region"] {
  if (!regions || regions.length === 0) return "global";
  const lower = regions.map((r) => r.toLowerCase());
  for (const r of lower) {
    if (FRONTEND_REGIONS.has(r)) return r as Template["region"];
  }
  return "global";
}

export function mapTemplate(dto: TemplateDTO): Template {
  const platform =
    CATEGORY_TO_PLATFORM[dto.category] ?? "instagram-reels";
  const previewImageUrl =
    resolveMediaUrl(dto.preview_image_url) ??
    resolveMediaUrl(dto.thumbnail_url) ??
    getRegionalTemplatePreview(dto);

  return {
    id: dto.id,
    title: toString_(dto.name, "Untitled template"),
    platform,
    aspect: dto.aspect_ratio,
    durationSec: toFiniteNumber(dto.duration_seconds, 0),
    previewImageUrl,
    thumbnail: previewImageUrl,
    previewVideo: resolveMediaUrl(dto.preview_video_url),
    mood: deriveMood(dto.tags),
    region: deriveRegion(dto.regions),
    trending: dto.tags?.includes("trending") || undefined,
    description: toString_(dto.description, ""),
  };
}

/**
 * Convert a partial frontend Clip into the snake_case body the backend
 * accepts on PATCH /clips/{id}. Backend-unsupported fields (overlays,
 * playback speed, subtitle mood) are quietly dropped — they remain in
 * frontend Zustand state until the backend exposes them.
 */
export function clipPatchToBody(patch: Partial<Clip>): PatchClipBody {
  const body: PatchClipBody = {};
  if (patch.title !== undefined) body.title = patch.title;
  if (patch.order !== undefined) body.position = patch.order;

  if (patch.subtitles) {
    body.subtitles = {
      enabled: patch.subtitles.enabled,
      language: patch.subtitles.language,
      style: patch.subtitles.style,
      position: patch.subtitles.position,
    };
  }

  if (patch.music !== undefined) {
    body.music_track_url = patch.music?.enabled
      ? (patch.music.trackUrl ?? patch.music.trackName ?? patch.music.trackId ?? null)
      : null;
    if (patch.music?.volume !== undefined) {
      body.music_volume = patch.music.volume;
    }
  }

  if (patch.trim) {
    if (patch.trim.startSec !== undefined) body.trim_start = patch.trim.startSec;
    if (patch.trim.endSec !== undefined) body.trim_end = patch.trim.endSec;
    // Some backend builds read speed from params.speed while others use
    // playback_speed. We keep trim fields canonical and attach compatibility
    // keys through a permissive cast.
    if (patch.trim.speed !== undefined) {
      body.speed = patch.trim.speed;
      body.playback_speed = patch.trim.speed;
    }
  }

  if (patch.overlays !== undefined) {
    body.overlays = patch.overlays;
  }

  return body;
}
