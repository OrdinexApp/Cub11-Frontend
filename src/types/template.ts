export type TemplatePlatform =
  | "instagram-reels"
  | "youtube-shorts"
  | "tiktok"
  | "whatsapp-status"
  | "facebook-ads"
  | "youtube-long";

export type TemplateMood = "energetic" | "calm" | "luxury" | "playful" | "bold" | "clean";

export interface Template {
  id: string;
  title: string;
  platform: TemplatePlatform;
  aspect: "9:16" | "16:9" | "1:1" | "4:5";
  durationSec: number;
  thumbnail: string;
  previewVideo?: string;
  mood: TemplateMood;
  region?: "in" | "id" | "vn" | "ph" | "th" | "global";
  trending?: boolean;
  description: string;
}
