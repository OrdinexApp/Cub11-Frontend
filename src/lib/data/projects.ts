import type { Project } from "@/types/project";
import type { Clip } from "@/types/clip";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/900`;
const wide = (seed: string) => `https://picsum.photos/seed/${seed}/900/600`;

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function makeClip(opts: {
  id: string;
  projectId: string;
  order: number;
  title: string;
  prompt: string;
  thumb: string;
  duration: number;
}): Clip {
  return {
    id: opts.id,
    projectId: opts.projectId,
    order: opts.order,
    title: opts.title,
    prompt: opts.prompt,
    thumbnail: opts.thumb,
    videoUrl: SAMPLE_VIDEO,
    durationSec: opts.duration,
    status: "ready",
    subtitles: { enabled: true, language: "en", style: "bold", position: "bottom" },
    music: { enabled: false, volume: 60 },
    overlays: [],
    trim: { startSec: 0, endSec: opts.duration, speed: 1 },
  };
}

export const SEED_PROJECTS: Project[] = [
  {
    id: "p-1",
    title: "Diwali Sale Launch",
    cover: img("diwali"),
    platform: "instagram-reels",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    clips: [
      makeClip({
        id: "c-1",
        projectId: "p-1",
        order: 0,
        title: "Hook — diya lighting close-up",
        prompt: "A close up of a hand lighting a clay diya, warm bokeh background",
        thumb: img("diya1"),
        duration: 4,
      }),
      makeClip({
        id: "c-2",
        projectId: "p-1",
        order: 1,
        title: "Reveal — product on rangoli",
        prompt: "Top-down shot of a phone placed on a colorful rangoli",
        thumb: img("rangoli"),
        duration: 5,
      }),
      makeClip({
        id: "c-3",
        projectId: "p-1",
        order: 2,
        title: "Offer card — 50% off CTA",
        prompt: "Bold gold typography on dark background, 50% off, festive",
        thumb: img("offer"),
        duration: 3,
      }),
    ],
  },
  {
    id: "p-2",
    title: "Jakarta Street Food",
    cover: img("food"),
    platform: "youtube-shorts",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    clips: [
      makeClip({
        id: "c-4",
        projectId: "p-2",
        order: 0,
        title: "Night market wide shot",
        prompt: "POV walking through a busy Jakarta night market, neon signs",
        thumb: img("market1"),
        duration: 6,
      }),
      makeClip({
        id: "c-5",
        projectId: "p-2",
        order: 1,
        title: "Satay grill close-up",
        prompt: "Macro shot of satay sizzling on charcoal, smoke rising",
        thumb: img("satay"),
        duration: 4,
      }),
    ],
  },
  {
    id: "p-3",
    title: "Cafe Launch Promo",
    cover: wide("cafe"),
    platform: "facebook-ads",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    clips: [],
  },
];
