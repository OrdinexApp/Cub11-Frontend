"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card"
    >
      <Link href={`/new?template=${template.id}`} className="block">
        <div className={cn("relative w-full overflow-hidden", ASPECT_CLASS[template.aspect])}>
          <Image
            src={imageSrc}
            alt={template.title || "Template"}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          {template.trending && (
            <Badge variant="warning" className="absolute top-3 left-3 backdrop-blur">
              <Sparkles className="mr-1 h-3 w-3" /> Trending
            </Badge>
          )}

          <div className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur opacity-0 transition group-hover:opacity-100">
            <Play className="h-4 w-4 text-white" fill="currentColor" />
          </div>

          <div className="absolute inset-x-3 bottom-3 right-16">
            <p className="text-[11px] uppercase tracking-wider text-white/70">
              {PLATFORM_EMOJI[template.platform]} {PLATFORM_LABELS[template.platform]}
            </p>
            <h3 className="text-sm font-semibold text-white text-balance line-clamp-1">
              {template.title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
