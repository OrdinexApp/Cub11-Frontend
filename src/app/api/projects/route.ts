import { NextResponse } from "next/server";
import { SEED_PROJECTS } from "@/lib/data/projects";

export async function GET() {
  await new Promise((r) => setTimeout(r, 150));
  return NextResponse.json({ projects: SEED_PROJECTS });
}
