"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Play,
  Pause,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { MarketingNavLight } from "./MarketingNavLight";
import { MarketingFooterLight } from "./MarketingFooterLight";
import {
  AuroraBackground,
  CanvasSpotlight,
  ClickRipple,
  CustomCursor,
} from "./landing-aurora-effects";
import {
  LightFeatureBrand,
  LightFeatureCollab,
  LightFeatureEdit,
  LightFeatureExport,
  LightFeatureGenerate,
  LightFeaturePublish,
  LightFeatureTemplates,
  LightSectionLink,
} from "./landing-light-visuals";

/* =========================================================================
   DATA
   ========================================================================= */

const HERO_CAROUSEL = [
  {
    label: "Diwali Sale Reel",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    label: "Chennai Wedding",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    label: "Jakarta Street Food",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    label: "Songkran Festival",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    label: "Mumbai Cafe Menu",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
];

const TRUSTED = [
  "Instagram",
  "YouTube",
  "TikTok",
  "Facebook",
  "LinkedIn",
  "Snapchat",
];

type Feature = {
  n: string;
  kicker: string;
  title: string;
  body: string;
  visual: React.ReactNode;
};

const FEATURES: Feature[] = [
  {
    n: "01",
    kicker: "Generate",
    title: "Generate with AI",
    body: "Describe a reel, brand ad, or food tour in plain language — in Hindi, Tamil, Bahasa, or Thai. Cubell delivers a polished vertical video with captions, motion, and music tuned for social.",
    visual: <LightFeatureGenerate />,
  },
  {
    n: "02",
    kicker: "Edit",
    title: "Style & edit",
    body: "Fine-tune every frame with AI assistance. Adjust colors, pacing, music, and captions — all through natural language commands or the visual controls you already know.",
    visual: <LightFeatureEdit />,
  },
  {
    n: "03",
    kicker: "Collaborate",
    title: "Collaborate in real-time",
    body: "Share previews, collect feedback, and ship campaigns in hours — not weeks. Invite teammates to comment, iterate, and approve right on the video. No exports needed.",
    visual: <LightFeatureCollab />,
  },
  {
    n: "04",
    kicker: "Export",
    title: "Multi-format export",
    body: "Export once, ship everywhere. 9:16 for Reels, Shorts, TikTok. 4:5 for feed. 1:1 for ads. 16:9 for YouTube and web. Watermark-free on every paid plan.",
    visual: <LightFeatureExport />,
  },
  {
    n: "05",
    kicker: "Templates",
    title: "Regional templates",
    body: "Start with templates tuned for India & Southeast Asia — Diwali, Songkran, Chennai weddings, Jakarta street food, Mumbai cafés. Real culture, not Western defaults.",
    visual: <LightFeatureTemplates />,
  },
  {
    n: "06",
    kicker: "Brand",
    title: "Brand consistency",
    body: "Upload your logo, fonts, colors, and intro. Cubell applies your brand kit automatically to every video you create — so each reel looks unmistakably yours.",
    visual: <LightFeatureBrand />,
  },
];

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Cubell completely changed how I create. What used to take a full day now takes me minutes. The Hindi captions nailed our audience the first try.",
    name: "Riya Sharma",
    role: "Creator · Delhi",
    initials: "RS",
    color: "#7C3AED",
  },
  {
    quote:
      "We ship 40+ brand reels a month for clients. Cubell cut our production time by 80% — while actually improving the quality. It's become essential.",
    name: "Dimas Pratama",
    role: "Creative Director · Jakarta",
    initials: "DP",
    color: "#3B82F6",
  },
  {
    quote:
      "Zero editing experience and I launched my skincare brand's first ad in 10 minutes. It looked like I hired an agency.",
    name: "Ploy Srisawat",
    role: "Founder, Luminary · Bangkok",
    initials: "PS",
    color: "#EC4899",
  },
];

const FAQS = [
  {
    q: "What is Cubell?",
    a: "Cubell is an AI video studio that turns text prompts into polished vertical videos — built for Reels, Shorts, and TikTok. Describe what you want in Hindi, Tamil, Bahasa, Thai, or English. Cubell handles cinematography, editing, music, and rendering in under a minute.",
  },
  {
    q: "Do I need video editing experience?",
    a: "Not at all. Cubell is designed for anyone — from beginners to studios. Our AI handles the technical complexity so you can focus on your story. If you can write a sentence, you can create a stunning video.",
  },
  {
    q: "What video formats and platforms are supported?",
    a: "Cubell exports in MP4, MOV, WebM, and GIF. We support every major aspect ratio — 9:16 for Reels, Shorts, and TikTok, 1:1 for feed posts, 4:5 for ads, and 16:9 for YouTube and web. Every export is optimized for its target platform.",
  },
  {
    q: "How long does a video take to generate?",
    a: "Most reels generate in 20–60 seconds depending on length and complexity. A standard 15-second social reel typically takes under 25 seconds. Longer storyboarded pieces can take up to 2 minutes. We're continuously making it faster.",
  },
  {
    q: "Can I use Cubell videos commercially?",
    a: "Yes. All videos on paid plans include full commercial rights. You own the output and can use it for advertising, client campaigns, social, or any commercial purpose. Our stock assets are fully licensed and royalty-free.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes — free forever. The Cubell free plan includes 5 video generations per month (up to 20 seconds each), access to our regional template library, and standard export quality. No credit card required.",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "0",
    suffix: "/forever",
    cta: "Start free",
    href: "/auth/register",
    features: [
      "5 videos / month",
      "Up to 20 seconds each",
      "Standard export quality",
      "Regional templates",
    ],
  },
  {
    name: "Creator",
    price: "19",
    suffix: "/month",
    cta: "Start 7-day trial",
    href: "/auth/register",
    highlight: true,
    features: [
      "Unlimited videos",
      "Up to 60 seconds each",
      "4K export · watermark-free",
      "Brand kit + custom fonts",
      "Commercial rights",
    ],
  },
  {
    name: "Studio",
    price: "49",
    suffix: "/editor/mo",
    cta: "Book a demo",
    href: "#",
    features: [
      "Everything in Creator",
      "Real-time collaboration",
      "Priority render queue",
      "SSO + SOC-2",
      "Dedicated success lead",
    ],
  },
];

/* =========================================================================
   PRIMITIVES
   ========================================================================= */

const FadeIn = ({
  children,
  delay = 0,
  y = 18,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.55, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[0.14em] text-violet-600">
    {children}
  </span>
);

const SectionTitle = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <h2
    className={cn(
      "text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-gray-900",
      className,
    )}
  >
    {children}
  </h2>
);

const SectionSub = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <p
    className={cn(
      "text-[clamp(1rem,2vw,1.125rem)] leading-[1.65] text-gray-600",
      className,
    )}
  >
    {children}
  </p>
);

/* Primary pill button — violet with shadow */
const BtnPrimary = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={cn(
      "mk-shine group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-violet-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-5px_rgba(124,58,237,0.45)] transition-all hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-[0_20px_40px_-10px_rgba(124,58,237,0.55)]",
      className,
    )}
  >
    {children}
  </Link>
);

/* Ghost pill — border/transparent */
const BtnGhost = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={cn(
      "inline-flex items-center gap-2 rounded-full border-[1.5px] border-gray-300 bg-transparent px-6 py-3.5 text-[15px] font-medium text-gray-900 transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:bg-black/[0.03]",
      className,
    )}
  >
    {children}
  </Link>
);

/* =========================================================================
   HERO VERTICAL CAROUSEL — auto-scrolling, hover-pauses, glass-fade edges
   ========================================================================= */

function HeroCarousel() {
  const loop = [...HERO_CAROUSEL, ...HERO_CAROUSEL];

  return (
    <div className="mk-carousel-wrap relative h-[460px] overflow-hidden rounded-3xl shadow-[0_25px_60px_-15px_rgba(76,29,149,0.25)] sm:h-[500px]">
      {/* Top + bottom fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[rgba(243,232,255,0.95)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[rgba(243,232,255,0.95)] to-transparent" />

      <div className="mk-carousel-track flex flex-col gap-4 p-4">
        {loop.map((card, i) => (
          <div
            key={`${card.label}-${i}`}
            className="relative flex h-[200px] shrink-0 items-end overflow-hidden rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] ring-1 ring-white/20 transition-transform duration-500 hover:scale-[1.02]"
            style={{ background: card.gradient }}
          >
            {/* Highlight + play icon */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] opacity-60">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect
                  x="8"
                  y="16"
                  width="32"
                  height="20"
                  rx="4"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="2"
                  fill="none"
                />
                <polygon
                  points="20,21 20,31 30,26"
                  fill="rgba(255,255,255,0.8)"
                />
              </svg>
            </div>

            <span className="relative z-[1] rounded-md border border-white/25 bg-white/20 px-2.5 py-1 text-[13px] font-semibold text-white backdrop-blur">
              {card.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   TESTIMONIAL STACK — 3 cards, front prominent, rotate every 4s
   ========================================================================= */

function TestimonialStack() {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = TESTIMONIALS.length;

  React.useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIdx((v) => (v + 1) % count), 4200);
    return () => window.clearInterval(t);
  }, [paused, count]);

  return (
    <div
      className="relative mt-16 flex h-[340px] items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {TESTIMONIALS.map((t, i) => {
        const rel = (i - idx + count) % count;
        const ty = rel * 14;
        const tx = rel * 10;
        const sc = 1 - rel * 0.05;
        const op = rel === 0 ? 1 : rel === 1 ? 0.7 : 0.45;
        const z = count - rel;
        return (
          <button
            key={t.name}
            type="button"
            onClick={() => setIdx((v) => (v + 1) % count)}
            aria-label={`Advance to testimonial ${(idx + 1) % count + 1}`}
            className="absolute w-[340px] rounded-2xl bg-white p-7 text-left shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out will-change-transform sm:w-[420px]"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${sc})`,
              zIndex: z,
              opacity: op,
            }}
          >
            <div className="mb-3 flex items-center gap-0.5">
              {[...Array(5)].map((_, s) => (
                <Star
                  key={s}
                  className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400"
                />
              ))}
            </div>
            <p className="mb-5 text-[15px] leading-[1.6] text-gray-700">
              “{t.quote}”
            </p>
            <div className="flex items-center gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white"
                style={{ background: t.color }}
              >
                {t.initials}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-gray-900">
                  {t.name}
                </p>
                <p className="text-[12px] text-gray-500">{t.role}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
   FAQ ITEM — grid-rows transition for smooth height
   ========================================================================= */

function FaqItem({
  item,
  open,
  onToggle,
}: {
  item: { q: string; a: string };
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-t border-gray-200 last:border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold text-gray-900 transition-colors hover:text-violet-700"
      >
        <span className="pr-6">{item.q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex gap-4 pb-5">
            <span className="w-1 shrink-0 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
            <p className="text-[15px] leading-[1.7] text-gray-600">{item.a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   FEATURE ROW
   ========================================================================= */

function FeatureRow({ feature, rtl }: { feature: Feature; rtl: boolean }) {
  return (
    <div
      className={cn(
        "grid items-center gap-10 lg:gap-16",
        rtl
          ? "lg:grid-cols-[2fr_3fr]"
          : "lg:grid-cols-[3fr_2fr]",
      )}
    >
      <FadeIn
        className={cn(
          "w-full",
          rtl ? "lg:order-2" : "lg:order-1",
        )}
      >
        {feature.visual}
      </FadeIn>
      <FadeIn
        delay={0.1}
        className={cn(rtl ? "lg:order-1" : "lg:order-2")}
      >
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-violet-600">
          {feature.n} — {feature.kicker}
        </p>
        <h3 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-gray-900">
          {feature.title}
        </h3>
        <p className="mb-6 text-[clamp(1rem,2vw,1.125rem)] leading-[1.65] text-gray-600">
          {feature.body}
        </p>
        <LightSectionLink href="#demo">Learn more</LightSectionLink>
      </FadeIn>
    </div>
  );
}

/* =========================================================================
   MAIN PAGE
   ========================================================================= */

export function LandingPageLight() {
  // Unlock the global dark surface so the aurora shows through.
  React.useEffect(() => {
    const html = document.documentElement;
    const hadDark = html.classList.contains("dark");
    html.classList.remove("dark");
    html.classList.add("mk-landing-root");
    return () => {
      html.classList.remove("mk-landing-root");
      if (hadDark) html.classList.add("dark");
    };
  }, []);

  return (
    <div className="mk-cursor-layer relative min-h-screen overflow-x-clip text-gray-900">
      <AuroraBackground />
      <CustomCursor youLabel="You" />
      <ClickRipple />

      <div className="relative z-10">
        <MarketingNavLight />

        <main id="top">
          <HeroSection />
          <TrustedSection />
          <VideoDemoSection />
          <CanvasSection />
          <FeaturesSection />
          <PublishSection />
          <TestimonialsSection />
          <PricingSection />
          <FaqSection />
          <FinalCtaSection />
        </main>

        <MarketingFooterLight />
      </div>
    </div>
  );
}

/* =========================================================================
   HERO
   ========================================================================= */

function HeroSection() {
  return (
    <section
      id="hero"
      className="px-4 pb-20 pt-36 sm:px-8 lg:px-16"
      style={{ minHeight: "100vh" }}
    >
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        {/* Text */}
        <div>
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 rounded border border-violet-200 bg-violet-50 px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-violet-700">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="5" fill="#7C3AED" opacity="0.4" />
                <circle cx="5" cy="5" r="3" fill="#7C3AED" />
              </svg>
              Now in public beta
            </span>
          </FadeIn>

          <FadeIn delay={0.08} y={28}>
            <h1 className="mt-5 text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-gray-900">
              Generate
              <br />
              <span className="text-violet-600">stunning</span>
              <br />
              videos in
              <br />
              seconds
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-[480px] text-[clamp(1.125rem,2.5vw,1.375rem)] leading-[1.65] text-gray-600">
              Describe your vision. Cubell creates professional vertical video
              in seconds — in Hindi, Tamil, Bahasa, Thai, or English. No editing
              skills required.
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <BtnPrimary href="/auth/register">
                Try for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </BtnPrimary>
              <BtnGhost href="#demo">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="6.5,5.5 11,8 6.5,10.5"
                    fill="currentColor"
                  />
                </svg>
                Watch demo
              </BtnGhost>
            </div>
          </FadeIn>

          <FadeIn delay={0.32}>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required · Free forever plan
            </p>
          </FadeIn>
        </div>

        {/* Carousel */}
        <FadeIn delay={0.15} className="w-full">
          <HeroCarousel />
        </FadeIn>
      </div>
    </section>
  );
}

/* =========================================================================
   TRUSTED BY
   ========================================================================= */

function TrustedSection() {
  return (
    <section className="px-4 py-12 sm:px-8 lg:px-16">
      <FadeIn>
        <div className="mx-auto max-w-[1600px] text-center">
          <p className="mb-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-gray-500">
            Built for every platform your audience watches
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {TRUSTED.map((t) => (
              <span
                key={t}
                className="text-[15px] font-bold tracking-[-0.02em] text-gray-400 opacity-75 transition-opacity hover:opacity-100"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* =========================================================================
   VIDEO DEMO
   ========================================================================= */

function VideoDemoSection() {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section id="demo" className="px-4 py-32 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1600px]">
        <FadeIn className="mx-auto max-w-[620px] text-center">
          <SectionEyebrow>In action</SectionEyebrow>
          <SectionTitle>See Cubell in action</SectionTitle>
          <SectionSub className="mt-4">
            Watch Cubell transform a single text prompt into a ready-to-publish
            vertical reel in under 30 seconds.
          </SectionSub>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="relative mt-14 aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.22) 0%, transparent 70%)",
              }}
            />

            <video
              ref={ref}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                playing ? "opacity-100" : "opacity-0",
              )}
              playsInline
              preload="none"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              onClick={toggle}
              onEnded={() => setPlaying(false)}
            />

            <button
              type="button"
              onClick={toggle}
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity",
                playing ? "opacity-0 hover:opacity-100" : "opacity-100",
              )}
              aria-label={playing ? "Pause demo" : "Play demo"}
            >
              <span className="grid h-[72px] w-[72px] place-items-center rounded-full border-2 border-white/30 bg-white/15 backdrop-blur transition-all hover:scale-110 hover:bg-white/25">
                {playing ? (
                  <Pause className="h-7 w-7 fill-white text-white" />
                ) : (
                  <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
                )}
              </span>
            </button>

            {/* Corner chips */}
            <span className="pointer-events-none absolute bottom-5 left-5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 align-middle" />
              Demo · 0:42
            </span>
            <span className="pointer-events-none absolute bottom-5 right-5 font-mono text-[11px] font-medium text-white/60">
              HD 1080p
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* =========================================================================
   CANVAS SECTION
   ========================================================================= */

function CanvasSection() {
  return (
    <section className="px-4 py-32 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 text-center">
          <FadeIn>
            <SectionEyebrow>Instant creation</SectionEyebrow>
          </FadeIn>
          <FadeIn delay={0.08}>
            <SectionTitle>Skip the blank canvas</SectionTitle>
          </FadeIn>
          <FadeIn delay={0.16}>
            <SectionSub className="mx-auto mt-4 max-w-[520px]">
              Generate reels in seconds. Stay in flow. Every teammate edits in
              the same space — no exports, no handoffs.
            </SectionSub>
          </FadeIn>
        </div>

        <FadeIn delay={0.24}>
          <CanvasSpotlight />
        </FadeIn>
      </div>
    </section>
  );
}

/* =========================================================================
   FEATURES
   ========================================================================= */

function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-32 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1600px] space-y-24 lg:space-y-32">
        {FEATURES.map((feature, i) => (
          <FeatureRow
            key={feature.title}
            feature={feature}
            rtl={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   PUBLISH-READY (complementary section with the phone mock)
   ========================================================================= */

function PublishSection() {
  return (
    <section className="px-4 pb-32 sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1600px] items-center gap-14 lg:grid-cols-2">
        <FadeIn>
          <SectionEyebrow>Ship anywhere</SectionEyebrow>
          <SectionTitle className="mb-5">
            Publish-ready the moment it renders
          </SectionTitle>
          <SectionSub className="mb-6 max-w-[520px]">
            Export straight to Reels, Shorts, TikTok and LinkedIn with the
            captions, hashtags, and music your audience actually expects — no
            extra formatting step.
          </SectionSub>
          <ul className="mb-8 space-y-3 text-[15px] text-gray-700">
            {[
              "Auto-generated bilingual captions (Hindi · Tamil · Bahasa · Thai)",
              "Localized hashtag packs + trending audio suggestions",
              "One-tap publish to your connected social accounts",
            ].map((l) => (
              <li key={l} className="flex items-start gap-3">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-700">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {l}
              </li>
            ))}
          </ul>
          <LightSectionLink href="#pricing">See pricing</LightSectionLink>
        </FadeIn>

        <FadeIn delay={0.15}>
          <LightFeaturePublish poster="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=640&q=80" />
        </FadeIn>
      </div>
    </section>
  );
}

/* =========================================================================
   TESTIMONIALS
   ========================================================================= */

function TestimonialsSection() {
  return (
    <section className="px-4 py-32 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1600px] text-center">
        <FadeIn>
          <SectionEyebrow>Social proof</SectionEyebrow>
        </FadeIn>
        <FadeIn delay={0.08}>
          <SectionTitle>Loved by creators worldwide</SectionTitle>
        </FadeIn>
        <FadeIn delay={0.16}>
          <SectionSub className="mx-auto mt-4 max-w-[520px]">
            Join thousands of creators, marketers, and filmmakers already
            shipping with Cubell.
          </SectionSub>
        </FadeIn>
        <FadeIn delay={0.24}>
          <TestimonialStack />
        </FadeIn>
      </div>
    </section>
  );
}

/* =========================================================================
   PRICING
   ========================================================================= */

function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-32 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <FadeIn>
            <SectionEyebrow>Pricing</SectionEyebrow>
          </FadeIn>
          <FadeIn delay={0.08}>
            <SectionTitle>Simple pricing. Scales with you.</SectionTitle>
          </FadeIn>
          <FadeIn delay={0.16}>
            <SectionSub className="mx-auto mt-4 max-w-[480px]">
              Start free. Upgrade when you&apos;re ready. Cancel anytime — no
              questions asked.
            </SectionSub>
          </FadeIn>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PRICING.map((tier, i) => (
            <FadeIn key={tier.name} delay={0.08 * i}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border p-7 transition-all hover:-translate-y-1",
                  tier.highlight
                    ? "border-violet-300 bg-white shadow-[0_30px_60px_-20px_rgba(124,58,237,0.35)]"
                    : "border-gray-200 bg-white/85 shadow-[0_12px_30px_-15px_rgba(0,0,0,0.12)]",
                )}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${tier.price}
                  </span>
                  <span className="text-sm text-gray-500">{tier.suffix}</span>
                </div>
                <ul className="mt-6 space-y-3 text-[14px] text-gray-700">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-violet-600"
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <Link
                    href={tier.href}
                    className={cn(
                      "block w-full rounded-full px-5 py-3 text-center text-[14px] font-semibold transition-all",
                      tier.highlight
                        ? "bg-violet-600 text-white shadow-[0_8px_20px_-5px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 hover:bg-violet-700"
                        : "border border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50",
                    )}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   FAQ
   ========================================================================= */

function FaqSection() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-32 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[768px] text-center">
        <FadeIn>
          <SectionEyebrow>Support</SectionEyebrow>
        </FadeIn>
        <FadeIn delay={0.08}>
          <SectionTitle>FAQs</SectionTitle>
        </FadeIn>
        <FadeIn delay={0.16}>
          <SectionSub className="mx-auto mt-4 max-w-[480px]">
            Everything you need to know about Cubell.
          </SectionSub>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-14 text-left">
            {FAQS.map((f, i) => (
              <FaqItem
                key={f.q}
                item={f}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* =========================================================================
   FINAL CTA
   ========================================================================= */

function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden px-4 py-32 text-center sm:px-8 lg:px-16">
      {/* Gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #c084fc 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #fbcfe8 0%, transparent 65%)",
        }}
      />

      <div className="mx-auto max-w-[760px]">
        <FadeIn>
          <SectionEyebrow>Get started</SectionEyebrow>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-gray-900">
            What will you create?
          </h2>
        </FadeIn>
        <FadeIn delay={0.16}>
          <p className="mt-6 text-[clamp(1.125rem,2.5vw,1.375rem)] leading-[1.65] text-gray-600">
            Join thousands of creators making breathtaking videos with Cubell —
            no experience needed.
          </p>
        </FadeIn>
        <FadeIn delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <BtnPrimary href="/auth/register">Start for free</BtnPrimary>
            <BtnGhost href="#demo">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <polygon points="6.5,5.5 11,8 6.5,10.5" fill="currentColor" />
              </svg>
              Watch demo
            </BtnGhost>
          </div>
        </FadeIn>
        <FadeIn delay={0.32}>
          <p className="mt-5 text-sm text-gray-500">
            Free plan · No credit card · Cancel anytime
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
