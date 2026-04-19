export interface SubtitleLanguage {
  code: string;
  name: string;
  nativeName: string;
  region: "in" | "id" | "vn" | "ph" | "th" | "global";
}

export const SUBTITLE_LANGUAGES: SubtitleLanguage[] = [
  { code: "en", name: "English", nativeName: "English", region: "global" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "in" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", region: "in" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", region: "in" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "in" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", region: "in" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", region: "id" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", region: "vn" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", region: "ph" },
  { code: "th", name: "Thai", nativeName: "ไทย", region: "th" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", region: "id" },
];
