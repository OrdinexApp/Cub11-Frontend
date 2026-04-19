export interface StyleOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  gradient: string;
}

export const STYLES: StyleOption[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Film-grade lighting and slow motion",
    emoji: "🎬",
    gradient: "from-amber-500/30 via-rose-500/20 to-indigo-500/20",
  },
  {
    id: "cute",
    name: "Cute",
    description: "Soft pastels, friendly vibes",
    emoji: "🌸",
    gradient: "from-pink-400/30 via-fuchsia-400/20 to-purple-400/20",
  },
  {
    id: "bold",
    name: "Bold",
    description: "High contrast, punchy edits",
    emoji: "⚡",
    gradient: "from-yellow-400/30 via-orange-500/25 to-red-500/20",
  },
  {
    id: "clean",
    name: "Clean",
    description: "Minimal, clean, brand-safe",
    emoji: "✨",
    gradient: "from-sky-400/25 via-indigo-400/20 to-violet-400/20",
  },
  {
    id: "trendy",
    name: "Trendy",
    description: "Whatever the algorithm loves now",
    emoji: "🔥",
    gradient: "from-emerald-400/25 via-teal-400/20 to-cyan-400/25",
  },
];
