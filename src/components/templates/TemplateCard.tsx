"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { PLATFORM_LABELS, PLATFORM_EMOJI } from "@/lib/data/templates";
import { hardTemplateFallback } from "@/lib/data/template-previews";
import type { Template } from "@/types/template";
import { cn } from "@/lib/utils";

const ASPECT_CLASS: Record<Template["aspect"], string> = {
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-[16/9]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
};

export function TemplateCard({ template }: { template: Template }) {
  const finalFallback = React.useMemo(
    () => hardTemplateFallback(template.id),
    [template.id],
  );
  const [imageSrc, setImageSrc] = React.useState(
    template.previewImageUrl ?? template.thumbnail ?? finalFallback,
  );

  React.useEffect(() => {
    setImageSrc(template.previewImageUrl ?? template.thumbnail ?? finalFallback);
  }, [template.previewImageUrl, template.thumbnail, finalFallback]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/new?template=${template.id}`} className="block">
        <div
          className={cn(
            "relative w-full overflow-hidden bg-gray-100",
            ASPECT_CLASS[template.aspect],
          )}
        >
          <Image
            src={imageSrc}
            alt={template.title || "Template"}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => {
              if (imageSrc !== (template.thumbnail ?? "")) {
                setImageSrc(template.thumbnail || finalFallback);
                return;
              }
              if (imageSrc !== finalFallback) {
                setImageSrc(finalFallback);
              }
            }}
          />

          {template.trending && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-50/95 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3 w-3" /> Trending
            </span>
          )}

          <div className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 opacity-0 shadow-md backdrop-blur transition group-hover:opacity-100">
            <Play className="h-4 w-4 text-gray-900" fill="currentColor" />
          </div>
        </div>

        <div className="px-3.5 py-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#7C3AED]">
            {PLATFORM_EMOJI[template.platform]} {PLATFORM_LABELS[template.platform]}
          </p>
          <h3 className="mt-1 line-clamp-1 text-[14px] font-semibold text-gray-900">
            {template.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
