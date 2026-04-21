import type { TemplateCategory, TemplateDTO } from "@/lib/api/types";

const unsplash = (photoId: string, orientation: "portrait" | "landscape" = "portrait") =>
  `https://source.unsplash.com/${photoId}/${orientation === "portrait" ? "900x1600" : "1400x900"}`;

const REGION_DEFAULTS: Record<string, string> = {
  in: unsplash("gLaJ1jXzArM"), // Diwali celebration
  id: unsplash("HmZbSUrQ0GU"), // Indonesian street market
  vn: unsplash("0sTDZrJ72i8"), // Hanoi street coffee vibe
  th: unsplash("n3kEJA4tSTk"), // Thailand night market
  ph: unsplash("GrxipqfWR34"), // Filipino festival dancing
};

const CATEGORY_DEFAULTS: Record<TemplateCategory, string> = {
  tiktok: unsplash("MJNq-3Q78P4"), // Indian street food stall
  reels: unsplash("bn-f6gXUlHU"), // Wedding highlights
  shorts: unsplash("ep-8NzLfKKU"), // Street food spread
  stories: unsplash("cM8X2DDvnGE"), // Diwali diyas
  square: unsplash("j6tQCSuu_G4", "landscape"), // Market commerce mood
  ecommerce: unsplash("1ToAGpPccI8", "landscape"), // Retail/night stall
};

/**
 * Pick a culturally relevant fallback image when backend media fields are
 * missing. This keeps template cards meaningful for SEA/India audiences.
 */
export function getRegionalTemplatePreview(dto: TemplateDTO): string {
  const title = (dto.name ?? "").toLowerCase();
  const desc = (dto.description ?? "").toLowerCase();
  const slug = (dto.slug ?? "").toLowerCase();
  const tags = (dto.tags ?? []).map((t) => t.toLowerCase()).join(" ");
  const text = `${title} ${desc} ${slug} ${tags}`;

  if (/(diwali|festival|rangoli|diyas?)/.test(text)) return unsplash("gLaJ1jXzArM");
  if (/(wedding|bride|groom|shaadi)/.test(text)) return unsplash("bn-f6gXUlHU");
  if (/(street.?food|food|recipe|cooking|asmr|kitchen)/.test(text))
    return unsplash("ep-8NzLfKKU");
  if (/(travel|tour|market|night market)/.test(text)) return unsplash("n3kEJA4tSTk");

  const region = (dto.regions ?? [])[0]?.toLowerCase();
  if (region && REGION_DEFAULTS[region]) return REGION_DEFAULTS[region];

  return CATEGORY_DEFAULTS[dto.category] ?? unsplash("MJNq-3Q78P4");
}

export function hardTemplateFallback(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(`template-${seed}`)}/900/1600`;
}
