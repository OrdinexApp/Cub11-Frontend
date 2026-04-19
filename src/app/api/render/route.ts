import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    previewUrl?: string;
    thumbnail?: string;
    credits?: number;
  };

  await new Promise((r) => setTimeout(r, 1200));

  const failed = Math.random() < 0.05;
  if (failed) {
    return NextResponse.json(
      {
        ok: false,
        refunded: body.credits ?? 0,
        reason: "Generation did not pass safety check. Credits refunded.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    ok: true,
    videoUrl: body.previewUrl,
    thumbnail: body.thumbnail,
    durationSec: 8,
  });
}
