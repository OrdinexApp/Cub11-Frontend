export interface StyleOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  /** Tailwind gradient used as a soft pastel accent behind the card. */
  gradient: string;
  /** Solid accent color for the emoji chip. */
  accent: string;
}

export const STYLES: StyleOption[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Film-grade lighting and slow motion",
    emoji: "🎬",
    gradient: "from-amber-100 via-rose-100 to-indigo-100",
    accent: "from-amber-400 to-rose-500",
  },
  {
    id: "cute",
    name: "Cute",
    description: "Soft pastels, friendly vibes",
    emoji: "🌸",
    gradient: "from-pink-100 via-fuchsia-100 to-purple-100",
    accent: "from-pink-400 to-fuchsia-500",
  },
  {
    id: "bold",
    name: "Bold",
    description: "High contrast, punchy edits",
    emoji: "⚡",
    gradient: "from-yellow-100 via-orange-100 to-red-100",
    accent: "from-yellow-400 to-orange-500",
  },
  {
    id: "clean",
    name: "Clean",
    description: "Minimal, clean, brand-safe",
    emoji: "✨",
    gradient: "from-sky-100 via-indigo-100 to-violet-100",
    accent: "from-sky-400 to-violet-500",
  },
  {
    id: "trendy",
    name: "Trendy",
    description: "Whatever the algorithm loves now",
    emoji: "🔥",
    gradient: "from-emerald-100 via-teal-100 to-cyan-100",
    accent: "from-emerald-400 to-teal-500",
  },
];
