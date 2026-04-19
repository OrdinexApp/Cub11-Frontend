import { NextResponse } from "next/server";

const PREVIEW_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    prompt?: string;
    templateId?: string;
    styleId?: string;
  };

  await new Promise((r) => setTimeout(r, 1800));

  const seed = body.templateId ?? body.prompt ?? "preview";
  const idx = Math.floor(Math.random() * PREVIEW_VIDEOS.length);

  return NextResponse.json({
    previewUrl: PREVIEW_VIDEOS[idx],
    thumbnail: `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/900`,
    estimatedRenderCredits: 12,
    chargedCredits: 0,
    note: "Preview generations are always free.",
  });
}
