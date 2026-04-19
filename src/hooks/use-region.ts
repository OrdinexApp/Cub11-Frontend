"use client";

import { useEffect, useState } from "react";

export type Region = "in" | "id" | "vn" | "ph" | "th" | "global";

export function useRegion(): Region {
  const [region, setRegion] = useState<Region>("in");

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith("hi") || lang.includes("-in")) setRegion("in");
    else if (lang.startsWith("id") || lang.startsWith("ms")) setRegion("id");
    else if (lang.startsWith("vi")) setRegion("vn");
    else if (lang.startsWith("tl") || lang.startsWith("fil")) setRegion("ph");
    else if (lang.startsWith("th")) setRegion("th");
    else setRegion("in");
  }, []);

  return region;
}
