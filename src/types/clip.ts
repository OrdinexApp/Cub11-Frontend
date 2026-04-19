export interface Subtitle {
  enabled: boolean;
  language: string;
  style: "minimal" | "bold" | "karaoke" | "impact";
  position: "top" | "middle" | "bottom";
}

export interface Music {
  enabled: boolean;
  trackId?: string;
  trackName?: string;
  mood?: string;
  volume: number;
}

export interface OverlayText {
  id: string;
  text: string;
  position: "top" | "middle" | "bottom";
  style: "headline" | "caption" | "tag";
}

export interface TrimSpeed {
  startSec: number;
  endSec: number;
  speed: number;
}

export interface Clip {
  id: string;
  projectId: string;
  order: number;
  title: string;
  prompt: string;
  thumbnail: string;
  videoUrl: string;
  durationSec: number;
  status: "ready" | "rendering" | "preview";
  subtitles: Subtitle;
  music: Music;
  overlays: OverlayText[];
  trim: TrimSpeed;
}
