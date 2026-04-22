import type { Metadata } from "next";
import { LandingPageLight } from "@/components/marketing/LandingPageLight";

export const metadata: Metadata = {
  title: "Cubell — AI Video Studio for Reels, Shorts & TikToks",
  description:
    "Create Reels, Shorts, and TikToks in seconds. Cubell is the premium AI video studio built for creators in India & Southeast Asia. Start free — no credit card.",
  openGraph: {
    title: "Cubell — AI Video Studio",
    description:
      "Create Reels, Shorts, and TikToks in seconds. Built for creators in India & Southeast Asia.",
    type: "website",
  },
};

export default function MarketingHomePage() {
  return <LandingPageLight />;
}
