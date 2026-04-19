import { NextResponse } from "next/server";
import { TEMPLATES } from "@/lib/data/templates";

export async function GET() {
  await new Promise((r) => setTimeout(r, 120));
  return NextResponse.json({ templates: TEMPLATES });
}
