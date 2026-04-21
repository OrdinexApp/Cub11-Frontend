"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Captions,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Film,
  Globe2,
  Grid3x3,
  ImageIcon,
  Languages,
  Layers,
  Minus,
  Music,
  Play,
  Plus,
  Send,
  Share2,
  Sparkles,
  Square,
  Star,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarketingNav } from "./MarketingNav";
import { MarketingFooter } from "./MarketingFooter";
import { ParticleField } from "./ParticleField";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type Preview = {
  title: string;
  subtitle: string;
  category: string;
  poster: string;
  video: string;
  accent: string;
  lang: string;
};

const HERO_PREVIEWS: Preview[] = [
  {
    title: "Diwali Sale Reel",
    subtitle: "Retail promo",
    category: "Reels",
    poster:
      "https://images.unsplash.com/photo-1604423043492-41303f3dbd8a?auto=format&fit=crop&w=900&q=80",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    accent: "from-amber-500/40 via-rose-500/20 to-fuchsia-500/30",
    lang: "हिन्दी",
  },
  {
    title: "Jakarta Street Food",
    subtitle: "Food tour",
    category: "Shorts",
    poster:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    accent: "from-emerald-400/40 via-cyan-500/25 to-indigo-500/30",
    lang: "Bahasa",
  },
  {
    title: "Chennai Wedding",
    subtitle: "Event reel",
    category: "Wedding",
    poster:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    accent: "from-fuchsia-500/40 via-violet-500/25 to-indigo-500/30",
    lang: "தமிழ்",
  },
  {
    title: "Bangkok Night Market",
    subtitle: "Brand ad",
    category: "TikTok",
    poster:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    accent: "from-violet-500/40 via-indigo-500/25 to-cyan-500/30",
    lang: "ไทย",
  },
  {
    title: "Mumbai Cafe Menu",
    subtitle: "Food promo",
    category: "Food",
    poster:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    accent: "from-orange-500/40 via-rose-500/25 to-fuchsia-500/30",
    lang: "मराठी",
  },
];

const CATEGORY_FILTERS = [
  "All",
  "Reels",
  "Shorts",
  "TikTok",
  "Wedding",
  "Food",
] as const;
type Category = (typeof CATEGORY_FILTERS)[number];

const FEATURE_SPOTLIGHTS = [
  {
    eyebrow: "Generate",
    title: "Generate video in seconds",
    description:
      "Chat with Cubell like you would a creative director. Describe a reel, brand ad, or food tour — watch it appear fully composed with captions, music, and pacing.",
    learnMore: "Learn about AI generation",
    href: "/auth/register",
    visual: "prompt" as const,
  },
  {
    eyebrow: "Edit",
    title: "Edit with AI or manually",
    description:
      "Total control without the learning curve. Tune captions, swap scenes, refine timing — or ask Cubell to rework a beat while you keep designing.",
    learnMore: "Learn about editing",
    href: "/auth/register",
    visual: "editor" as const,
  },
  {
    eyebrow: "Publish",
    title: "Export to every platform instantly",
    description:
      "One click turns any project into ready-to-post 9:16, 4:5, or 1:1 exports. No watermark on paid plans — drop it straight into Reels, Shorts, or TikTok.",
    learnMore: "Learn about exports",
    href: "/auth/register",
    visual: "export" as const,
  },
  {
    eyebrow: "Scale",
    title: "Multiple videos at once",
    description:
      "Launch full campaigns in a single go. Generate login promos, product teasers, creator series, or seasonal pushes — as many formats as you need.",
    learnMore: "Learn about multi-output",
    href: "/auth/register",
    visual: "batch" as const,
  },
  {
    eyebrow: "Reference",
    title: "Design using references",
    description:
      "Attach a brief for more context, drop a screenshot for inspiration, or paste a reference link. Cubell learns your style and runs with it.",
    learnMore: "Learn more",
    href: "/auth/register",
    visual: "reference" as const,
  },
  {
    eyebrow: "Collaborate",
    title: "Create together, anywhere",
    description:
      "Work with your team in real time. See cursors move, keep edits synced, leave inline feedback — ship faster without a meeting.",
    learnMore: "Learn about collaboration",
    href: "/auth/register",
    visual: "collab" as const,
  },
];

const BENEFITS = [
  {
    title: "Local-first",
    description:
      "Subtitles in Hindi, Tamil, Bahasa, Vietnamese, Thai — culturally tuned, not Western leftovers.",
    icon: Globe2,
  },
  {
    title: "Honest pricing",
    description:
      "INR and SEA-friendly plans. No hidden billing, no surprise credit charges, cancel anytime.",
    icon: Zap,
  },
  {
    title: "Publish-ready",
    description:
      "Clean 9:16, 4:5, and 1:1 exports — watermark-free on paid plans.",
    icon: Layers,
  },
  {
    title: "Built-in polish",
    description:
      "Royalty-safe music, smart captions, overlays, trim & speed — all in one editor.",
    icon: Music,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Cubell cut my reel production from 3 hours to 20 minutes. It actually understands what Indian audiences scroll past.",
    name: "Riya Malhotra",
    role: "Beauty Creator",
    city: "Mumbai",
    flag: "🇮🇳",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "I publish food tours in Bahasa and English now. Subtitles are clean, and my watch time jumped in a week.",
    name: "Dimas Arya",
    role: "Food Creator",
    city: "Jakarta",
    flag: "🇮🇩",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "We ship 40+ short ads a month for local brands. Cubell feels premium but stays affordable for our team.",
    name: "Mai Nguyen",
    role: "DTC Marketer",
    city: "Ho Chi Minh",
    flag: "🇻🇳",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "The templates feel made for Thai creators — not just translated. My first reel hit 1M views organically.",
    name: "Ploy Srisai",
    role: "Lifestyle Creator",
    city: "Bangkok",
    flag: "🇹🇭",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "Finally an AI video tool that doesn't charge in USD. The editor is cleaner than anything I've tried.",
    name: "Arjun Singh",
    role: "Fitness Creator",
    city: "Delhi",
    flag: "🇮🇳",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

const PRICING = [
  {
    tier: "Free",
    price: "₹0",
    period: "forever",
    note: "Try the full workflow",
    features: [
      "5 preview generations / month",
      "All regional templates",
      "Standard captions & music",
      "Community support",
    ],
    cta: { label: "Start free", href: "/auth/register" },
  },
  {
    tier: "Starter",
    price: "₹499",
    period: "/ month",
    note: "For solo creators shipping weekly",
    features: [
      "60 HD generations / month",
      "No watermark exports",
      "Priority render queue",
      "Advanced subtitles & voices",
      "Email support",
    ],
    cta: { label: "Go Starter", href: "/auth/register" },
    featured: true,
  },
  {
    tier: "Creator",
    price: "₹1,499",
    period: "/ month",
    note: "For teams & agencies publishing daily",
    features: [
      "250 HD generations / month",
      "4K exports & longer clips",
      "Brand kit & shared library",
      "Dedicated support manager",
      "Team seats included",
    ],
    cta: { label: "Go Creator", href: "/auth/register" },
  },
];

const STATS = [
  { label: "creators on Cubell", value: "10,000+" },
  { label: "videos generated", value: "480K" },
  { label: "languages supported", value: "12" },
  { label: "countries served", value: "9" },
];

const FAQS = [
  {
    q: "How do I get started?",
    a: "Sign up for a free account, then start generating videos immediately. Invite your team and they can collaborate with you in minutes — no onboarding calls needed.",
  },
  {
    q: "How much does it cost?",
    a: "It's free to start with 5 preview generations every month. Paid plans begin at ₹499/month with no watermark, HD exports, and priority rendering.",
  },
  {
    q: "Do I need editing skills to use Cubell?",
    a: "Not at all. Describe what you want, pick a template, or paste a reference — Cubell handles composition, captions, music, and timing so you can focus on the idea.",
  },
  {
    q: "Does Cubell use my content to train AI models?",
    a: "No. We don't use your uploads or projects to train models, and we don't allow our LLM providers to do so either. Full details live in our Privacy Policy.",
  },
  {
    q: "How does Cubell handle data privacy & security?",
    a: "Your projects are encrypted in transit and at rest. We support SSO for team plans, and every export respects licensed music and platform guidelines by default.",
  },
  {
    q: "Does Cubell replace my editor?",
    a: "For short-form social content — yes, daily. Cubell is built for Reels, Shorts, and TikTok. For long-form narrative films, we still play nicely with your existing workflow.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Motion helpers                                                            */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/* -------------------------------------------------------------------------- */
/*  Shared UI bits                                                            */
/* -------------------------------------------------------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-300 backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_hsl(239_84%_67%)]" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  centered?: boolean;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "space-y-5",
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
      )}
    >
      <motion.div
        variants={fadeUp}
        className={cn(centered && "flex justify-center")}
      >
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className="text-balance text-base text-zinc-400 md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HERO — rotating stacked preview cards                                     */
/* -------------------------------------------------------------------------- */

function StackedPreviewCard({
  preview,
  pos,
  onClick,
}: {
  preview: Preview;
  pos: -2 | -1 | 0 | 1 | 2;
  onClick: () => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (pos === 0) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [pos]);

  const config: Record<number, { x: number; y: number; scale: number; rotate: number; opacity: number; z: number; blur: number }> = {
    [-2]: { x: -360, y: 22, scale: 0.78, rotate: -8, opacity: 0.35, z: 1, blur: 4 },
    [-1]: { x: -200, y: 10, scale: 0.88, rotate: -5, opacity: 0.7, z: 2, blur: 1.5 },
    [0]:  { x: 0,     y: 0,  scale: 1,    rotate: 0,  opacity: 1,   z: 3, blur: 0 },
    [1]:  { x: 200,   y: 10, scale: 0.88, rotate: 5,  opacity: 0.7, z: 2, blur: 1.5 },
    [2]:  { x: 360,   y: 22, scale: 0.78, rotate: 8,  opacity: 0.35, z: 1, blur: 4 },
  };
  const c = config[pos];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Show ${preview.title}`}
      initial={false}
      animate={{
        x: c.x,
        y: c.y,
        scale: c.scale,
        rotate: c.rotate,
        opacity: c.opacity,
        filter: `blur(${c.blur}px)`,
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ zIndex: c.z }}
      className="absolute left-1/2 top-1/2 -ml-[130px] -mt-[225px] h-[450px] w-[260px] origin-center cursor-pointer md:-ml-[150px] md:-mt-[265px] md:h-[530px] md:w-[300px]"
    >
      <div className="spotlight-ring relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 shadow-2xl">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br",
            preview.accent,
          )}
        />
        <Image
          src={preview.poster}
          alt={preview.title}
          fill
          priority={pos === 0}
          sizes="300px"
          className="object-cover"
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={preview.poster}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            pos === 0 ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={preview.video} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
            {preview.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
            <Languages className="h-3 w-3" />
            {preview.lang}
          </span>
        </div>

        <div className="absolute right-3 top-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur">
            <Play className="h-3 w-3 translate-x-[1px] fill-current" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[15px] font-semibold leading-tight text-white">
            {preview.title}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-300">{preview.subtitle}</p>

          {pos === 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/20">
                <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
                Rendering
              </span>
              <span className="text-[10px] text-zinc-400">9:16 · HD</span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 120]);
  const y2 = useTransform(scrollY, [0, 600], [0, 60]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActive((v) => (v + 1) % HERO_PREVIEWS.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const getPos = (i: number): -2 | -1 | 0 | 1 | 2 => {
    const n = HERO_PREVIEWS.length;
    const d = ((i - active) % n + n) % n;
    if (d === 0) return 0;
    if (d === 1) return 1;
    if (d === 2) return 2;
    if (d === n - 1) return -1;
    return -2;
  };

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#05060a]" />

      <motion.div
        style={{ y: y1 }}
        className="orb animate-float-slow left-[-10%] top-[10%] h-[520px] w-[520px] bg-indigo-600/40"
      />
      <motion.div
        style={{ y: y2 }}
        className="orb animate-float-slow right-[-15%] top-[30%] h-[620px] w-[620px] bg-fuchsia-600/30"
      />
      <div className="orb left-[30%] top-[60%] h-[360px] w-[360px] bg-cyan-500/20" />

      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10 opacity-60" />
      <div className="bg-noise absolute inset-0 -z-10" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <ParticleField className="opacity-70" density={65} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-[#05060a]" />

      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp} className="flex justify-center">
            <Link
              href="/templates"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-zinc-300 backdrop-blur transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                New
              </span>
              Regional templates for India & SEA
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-7 text-balance text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] md:text-[84px] lg:text-[96px]"
          >
            <span className="block text-white">Generate real Reels</span>
            <span className="gradient-text block">in seconds</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-balance text-base text-zinc-400 md:text-lg"
          >
            Communicate visually. Publish daily. Cubell turns a single line of
            prompt into a polished vertical video — captions, music, and pacing
            ready for social.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="group relative h-12 overflow-hidden rounded-xl bg-white px-6 text-[15px] font-medium text-zinc-950 shadow-[0_10px_40px_-10px_hsl(0_0%_100%/0.4)] hover:bg-zinc-100"
            >
              <Link href="/auth/register">
                Try for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/15 bg-white/[0.04] px-6 text-[15px] font-medium text-white backdrop-blur hover:bg-white/[0.08] hover:text-white"
            >
              <Link href="#examples" className="group inline-flex items-center">
                <span className="relative mr-2 grid h-5 w-5 place-items-center">
                  <span className="absolute inset-0 rounded-full bg-indigo-500/30" />
                  <span className="absolute inset-0 animate-pulse-ring rounded-full" />
                  <CirclePlay className="relative h-4 w-4 text-indigo-300" />
                </span>
                Watch 30s demo
              </Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-xs text-zinc-500"
          >
            No credit card required · 5 free generations
          </motion.p>
        </motion.div>

        {/* Rotating stacked previews */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35 }}
          className="relative mx-auto mt-14 h-[520px] w-full max-w-[1100px] md:mt-20 md:h-[620px]"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0">
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05060a] to-transparent" />
          </div>

          {HERO_PREVIEWS.map((p, i) => (
            <StackedPreviewCard
              key={p.title}
              preview={p}
              pos={getPos(i)}
              onClick={() => setActive(i)}
            />
          ))}

          {/* Floating meta chips */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute left-4 top-10 hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-3 shadow-2xl backdrop-blur-xl md:block"
            style={{ zIndex: 4 }}
          >
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Sparkles className="h-4 w-4 text-indigo-300" />
              <span>Generated in 47s</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 6 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="absolute right-4 bottom-24 hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-3 shadow-2xl backdrop-blur-xl md:block"
            style={{ zIndex: 4 }}
          >
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Captions className="h-4 w-4 text-fuchsia-300" />
              <span>12 languages · No watermark</span>
            </div>
          </motion.div>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2" style={{ zIndex: 5 }}>
            {HERO_PREVIEWS.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to ${p.title}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-8 bg-white" : "w-1.5 bg-white/25 hover:bg-white/40",
                )}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="mx-auto mt-10 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {TESTIMONIALS.slice(0, 4).map((t) => (
                <span
                  key={t.name}
                  className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#05060a]"
                >
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300">
              <span className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </span>
              <span className="font-semibold text-white">4.9</span>
              <span className="text-zinc-500">from 10,000+ creators</span>
            </div>
          </div>

          <span className="hidden h-5 w-px bg-white/10 sm:block" />

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>🇮🇳 India</span>
            <span className="text-zinc-700">•</span>
            <span>🇮🇩 Indonesia</span>
            <span className="text-zinc-700">•</span>
            <span>🇻🇳 Vietnam</span>
            <span className="text-zinc-700">•</span>
            <span>🇹🇭 Thailand</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats marquee                                                             */
/* -------------------------------------------------------------------------- */

function StatsStrip() {
  const items = [...STATS, ...STATS, ...STATS];
  return (
    <section className="relative border-y border-white/5 bg-black/40 py-8 backdrop-blur">
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="marquee flex min-w-max gap-12 px-6">
          {items.map((s, i) => (
            <div
              key={`${s.label}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <span className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {s.value}
              </span>
              <span className="text-sm text-zinc-500">{s.label}</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  From Concept to Clarity — scroll narrative                                */
/* -------------------------------------------------------------------------- */

function ConceptToClarity() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const promptOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 1, 0]);
  const videoOpacity = useTransform(scrollYProgress, [0.35, 0.65, 1], [0, 1, 1]);
  const videoScale = useTransform(scrollYProgress, [0.35, 1], [0.9, 1]);

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative mx-auto w-full max-w-7xl px-4 py-28 md:px-8 md:py-40"
    >
      <SectionHeading
        eyebrow="From concept to clarity"
        title={
          <>
            See how Cubell turns your imagination{" "}
            <span className="text-zinc-500">into shippable video.</span>
          </>
        }
        description="Type one sentence. Watch it become a publish-ready reel — with captions, music, pacing, and regional polish baked in."
      />

      <div className="relative mt-16 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
        {/* LEFT: prompt card */}
        <motion.div style={{ opacity: promptOpacity }} className="relative">
          <div className="device-frame relative overflow-hidden rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10 text-indigo-300">
                <Wand2 className="h-3 w-3" />
              </span>
              <span className="font-medium uppercase tracking-[0.14em]">
                Prompt
              </span>
              <span className="ml-auto">Draft · local</span>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[15px] leading-relaxed text-white">
                A 15-second Diwali sale reel for a Mumbai jewelry brand —
                warm gold tones, Hindi subtitles, upbeat dhol music, end with
                a 30% off card.
                <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-indigo-300 align-middle animate-caret" />
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {["9:16", "Hindi", "Dhol", "Warm gold"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300"
                >
                  <span className="h-1 w-1 rounded-full bg-indigo-400" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> 2 refs
                </span>
                <span className="inline-flex items-center gap-1">
                  <Music className="h-3 w-3" /> Auto
                </span>
              </div>
              <Button
                size="sm"
                className="h-8 rounded-lg bg-white px-3 text-xs text-zinc-950 hover:bg-zinc-100"
              >
                <Send className="h-3 w-3" />
                Generate
              </Button>
            </div>

            {/* rising dots */}
            <div className="pointer-events-none absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="absolute bottom-8 h-1.5 w-1.5 rounded-full bg-indigo-400/70 animate-orbit-rise"
                  style={{
                    left: `${20 + i * 14}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* CENTER: pipeline indicator */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="hidden h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:block" />
          <motion.div
            className="absolute top-0 h-full w-px bg-gradient-to-b from-indigo-400 via-fuchsia-400 to-cyan-400 md:h-full"
            style={{ scaleY: useTransform(progress, [0, 100], [0, 1]), transformOrigin: "top" }}
          />
          <div className="md:my-4">
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-zinc-900/90 shadow-[0_10px_40px_-10px_hsl(239_84%_67%/0.6)] backdrop-blur">
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10" />
              <Sparkles className="relative h-5 w-5 text-indigo-300" />
            </span>
          </div>
          <div className="hidden h-full w-px bg-gradient-to-b from-white/15 via-white/15 to-transparent md:block" />
        </div>

        {/* RIGHT: rendered video frame */}
        <motion.div style={{ opacity: videoOpacity, scale: videoScale }} className="relative">
          <div className="device-frame relative overflow-hidden rounded-3xl p-3">
            <div className="relative aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-2xl mx-auto">
              <Image
                src={HERO_PREVIEWS[0].poster}
                alt="Rendered reel"
                fill
                sizes="320px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

              <div className="absolute left-3 top-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/25 px-2 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
                  Rendered
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white ring-1 ring-white/15">
                  9:16 · HD
                </span>
              </div>

              <div className="absolute inset-x-3 bottom-4">
                <div className="rounded-xl bg-black/70 px-3 py-2 text-center backdrop-blur ring-1 ring-white/10">
                  <p className="text-[13px] font-semibold text-white">
                    Diwali की चमक, 30% तक OFF
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* floating export chip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute -right-3 -top-3 hidden rounded-xl border border-white/10 bg-zinc-900/90 p-2.5 shadow-2xl backdrop-blur-xl md:block"
          >
            <div className="flex items-center gap-2 text-[11px] text-zinc-300">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-emerald-500/20 text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
              </span>
              Ready to publish
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Skip the Blank Canvas — floating collaborator cards                       */
/* -------------------------------------------------------------------------- */

function SkipBlankCanvas() {
  const FLOAT_AVATARS = TESTIMONIALS.slice(0, 5);
  const CAPTIONS = ["Food delivery ad", "Wedding teaser", "Beauty tutorial", "Travel reel", "Coffee promo"];

  return (
    <section className="relative overflow-hidden px-4 py-28 md:px-8 md:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb right-[-10%] top-[10%] h-[420px] w-[420px] bg-violet-600/20" />
        <div className="orb left-[-10%] bottom-[0%] h-[360px] w-[360px] bg-indigo-600/20" />
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Skip the blank canvas"
          title={
            <>
              Ship ideas in seconds.{" "}
              <span className="gradient-text">Stay in flow.</span>
            </>
          }
          description="Generate full campaigns in one go. Chat with Cubell, invite teammates, and keep momentum — no menus, no cold starts."
        />

        <div className="relative mx-auto mt-16 h-[400px] max-w-4xl md:h-[440px]">
          {/* central prompt pill */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="device-frame relative flex items-center gap-3 rounded-2xl px-5 py-4 min-w-[280px] md:min-w-[380px]">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
                <Wand2 className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  Prompt Cubell
                </p>
                <p className="mt-0.5 text-sm text-white">
                  Create a food delivery campaign
                  <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-indigo-300 align-middle animate-caret" />
                </p>
              </div>
              <Button
                size="sm"
                className="h-9 rounded-lg bg-white px-3 text-xs text-zinc-950 hover:bg-zinc-100"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* floating collaborator cards */}
          {FLOAT_AVATARS.map((t, i) => {
            const positions = [
              { top: "8%", left: "4%", rotate: -6, delay: 0 },
              { top: "14%", right: "6%", rotate: 5, delay: 0.15 },
              { bottom: "10%", left: "10%", rotate: 4, delay: 0.3 },
              { bottom: "6%", right: "12%", rotate: -5, delay: 0.45 },
              { top: "46%", left: "-2%", rotate: -3, delay: 0.6 },
            ];
            const pos = positions[i];

            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20, rotate: pos.rotate }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: pos.delay, duration: 0.6 }}
                whileHover={{ y: -6, rotate: 0, scale: 1.03 }}
                style={{
                  top: "top" in pos ? pos.top : undefined,
                  bottom: "bottom" in pos ? pos.bottom : undefined,
                  left: "left" in pos ? pos.left : undefined,
                  right: "right" in pos ? pos.right : undefined,
                  rotate: pos.rotate,
                }}
                className="absolute hidden md:block"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 p-2.5 pr-4 shadow-2xl backdrop-blur-xl">
                  <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/10">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white">{t.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-zinc-400">{CAPTIONS[i]}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* decorative connecting lines */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            viewBox="0 0 800 440"
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(239 84% 67% / 0.5)" />
                <stop offset="100%" stopColor="hsl(266 84% 60% / 0)" />
              </linearGradient>
            </defs>
            <path
              d="M80 80 Q 240 160 400 210"
              stroke="url(#line-grad)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              className="animate-dash"
            />
            <path
              d="M720 100 Q 560 180 400 210"
              stroke="url(#line-grad)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              className="animate-dash"
            />
            <path
              d="M140 380 Q 260 300 400 230"
              stroke="url(#line-grad)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              className="animate-dash"
            />
            <path
              d="M680 380 Q 540 320 400 230"
              stroke="url(#line-grad)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              className="animate-dash"
            />
          </svg>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            size="lg"
            className="h-11 rounded-xl bg-white px-5 text-[14px] font-medium text-zinc-950 hover:bg-zinc-100"
          >
            <Link href="/auth/register">
              Try for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature Visuals — the "mock UI" for each spotlight                        */
/* -------------------------------------------------------------------------- */

function PromptVisual() {
  return (
    <div className="device-frame relative overflow-hidden rounded-3xl p-5 md:p-6">
      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
        <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10 text-indigo-300">
          <Wand2 className="h-3 w-3" />
        </span>
        <span className="font-medium uppercase tracking-[0.14em]">Chat with Cubell</span>
      </div>

      <div className="mt-5 space-y-3">
        <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-indigo-500/90 px-3.5 py-2 text-sm text-white shadow-lg">
          A 20-sec reel of Jakarta street food at night, Bahasa subs, upbeat
        </div>
        <div className="flex items-start gap-2">
          <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-zinc-200">
            Drafting a 6-scene reel with warm neon grading — adding Bahasa
            subtitles & a groovy beat.
            <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-zinc-400 align-middle animate-caret" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {[
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=240&q=70",
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=240&q=70",
            "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=240&q=70",
            "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=240&q=70",
          ].map((src, i) => (
            <div key={i} className="relative aspect-[9/16] overflow-hidden rounded-md ring-1 ring-white/10">
              <Image src={src} alt="Scene" fill sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
          <span>Scene 3 of 6 · auto pacing</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5">
            <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
            Drafting
          </span>
        </div>
      </div>
    </div>
  );
}

function EditorVisual() {
  return (
    <div className="device-frame relative overflow-hidden rounded-3xl p-4 md:p-5">
      <div className="grid grid-cols-[1fr_180px] gap-3">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl ring-1 ring-white/10">
          <Image
            src={HERO_PREVIEWS[2].poster}
            alt="Editor preview"
            fill
            sizes="280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute inset-x-3 bottom-3 rounded-lg bg-black/70 px-3 py-1.5 text-center text-[12px] font-semibold text-white ring-1 ring-white/15 backdrop-blur">
            आज की शादी · Chennai
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: "Caption", icon: Captions, active: true },
            { label: "Music", icon: Music },
            { label: "Trim", icon: Minus },
            { label: "Voice", icon: Languages },
            { label: "Overlay", icon: Layers },
          ].map((tool) => (
            <div
              key={tool.label}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs",
                tool.active
                  ? "border-indigo-400/40 bg-indigo-500/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-zinc-400",
              )}
            >
              <tool.icon className="h-3.5 w-3.5" />
              {tool.label}
            </div>
          ))}
        </div>
      </div>

      {/* timeline */}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] text-zinc-500">
          <span>Timeline</span>
          <span>00:07 / 00:20</span>
        </div>
        <div className="flex gap-1">
          {[0.6, 0.9, 0.75, 0.5, 0.85, 0.7, 0.55].map((h, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-sm",
                i === 2
                  ? "bg-gradient-to-t from-indigo-500 to-fuchsia-400"
                  : "bg-white/10",
              )}
              style={{ height: `${24 * h}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExportVisual() {
  const platforms = [
    { label: "Instagram Reels", ratio: "9:16", color: "from-rose-500 to-fuchsia-500" },
    { label: "YouTube Shorts", ratio: "9:16", color: "from-red-500 to-orange-500" },
    { label: "TikTok", ratio: "9:16", color: "from-cyan-400 to-fuchsia-500" },
    { label: "Feed Post", ratio: "1:1", color: "from-indigo-500 to-violet-500" },
  ];
  return (
    <div className="device-frame relative overflow-hidden rounded-3xl p-5 md:p-6">
      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
        <Share2 className="h-3.5 w-3.5" />
        <span className="font-medium uppercase tracking-[0.14em]">Export targets</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {platforms.map((p) => (
          <div
            key={p.label}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/20"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br text-white",
                  p.color,
                )}
              >
                <Film className="h-3.5 w-3.5" />
              </span>
              <div className="flex-1">
                <p className="text-[12px] font-medium text-white">{p.label}</p>
                <p className="text-[10px] text-zinc-500">{p.ratio} · HD · no watermark</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Rendering 4 variants</span>
          <span className="font-semibold text-white">84%</span>
        </div>
        <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-sweep" />
        </div>
      </div>
    </div>
  );
}

function BatchVisual() {
  const variants = [
    { src: HERO_PREVIEWS[0].poster, label: "Reels", lang: "हिन्दी" },
    { src: HERO_PREVIEWS[1].poster, label: "Shorts", lang: "Bahasa" },
    { src: HERO_PREVIEWS[3].poster, label: "TikTok", lang: "ไทย" },
    { src: HERO_PREVIEWS[2].poster, label: "Story", lang: "தமிழ்" },
    { src: HERO_PREVIEWS[4].poster, label: "Square", lang: "मराठी" },
    { src: HERO_PREVIEWS[1].poster, label: "Ad", lang: "English" },
  ];
  return (
    <div className="device-frame relative overflow-hidden rounded-3xl p-5">
      <div className="flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-3.5 w-3.5" />
          <span className="font-medium uppercase tracking-[0.14em]">Batch generate</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/25">
          <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
          6 outputs
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {variants.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08 }}
            className="relative aspect-[9/16] overflow-hidden rounded-lg ring-1 ring-white/10"
          >
            <Image src={v.src} alt={v.label} fill sizes="110px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur">
              {v.label}
            </div>
            <div className="absolute inset-x-1.5 bottom-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-center text-[10px] text-white backdrop-blur">
              {v.lang}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReferenceVisual() {
  return (
    <div className="device-frame relative overflow-hidden rounded-3xl p-5 md:p-6">
      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
        <ImageIcon className="h-3.5 w-3.5" />
        <span className="font-medium uppercase tracking-[0.14em]">Add references</span>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-indigo-400/40 bg-indigo-500/[0.04] p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            "https://images.unsplash.com/photo-1604423043492-41303f3dbd8a?auto=format&fit=crop&w=300&q=70",
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=70",
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=300&q=70",
          ].map((src, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-lg ring-1 ring-white/10">
              <Image src={src} alt="Reference" fill sizes="120px" className="object-cover" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-zinc-400">
          Drop an image, PDF, or paste a link — Cubell adapts style & mood.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {[
          { label: "brand-brief.pdf", hint: "Extracted palette · 4 colors" },
          { label: "moodboard.jpg", hint: "Style · warm neon, night" },
          { label: "reference.com/reel", hint: "Pacing · 18s · energetic" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-indigo-500/20 text-indigo-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[12px] font-medium text-white">{f.label}</p>
              <p className="truncate text-[10px] text-zinc-500">{f.hint}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollabVisual() {
  const collaborators = [
    { ...TESTIMONIALS[0], pos: "top-[18%] left-[22%]", cursor: "text-rose-400" },
    { ...TESTIMONIALS[1], pos: "top-[42%] right-[14%]", cursor: "text-emerald-400" },
    { ...TESTIMONIALS[3], pos: "bottom-[20%] left-[34%]", cursor: "text-cyan-400" },
  ];
  return (
    <div className="device-frame relative overflow-hidden rounded-3xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={HERO_PREVIEWS[3].poster}
          alt="Collab canvas"
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/80" />

        {collaborators.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.2 }}
            className={cn("absolute", c.pos)}
          >
            <span className={cn("block", c.cursor)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3 2l7 19 2.5-8.5L21 11 3 2z" />
              </svg>
            </span>
            <div className="mt-1 flex items-center gap-2 rounded-lg bg-zinc-900/90 px-2 py-1 shadow-lg ring-1 ring-white/10 backdrop-blur">
              <span className="relative h-4 w-4 overflow-hidden rounded-full">
                <Image src={c.avatar} alt={c.name} fill sizes="16px" className="object-cover" />
              </span>
              <span className="text-[10px] font-medium text-white">{c.name.split(" ")[0]}</span>
            </div>
          </motion.div>
        ))}

        {/* annotations */}
        <div className="absolute left-6 bottom-6 hidden rounded-xl border border-white/15 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-xl md:block">
          <div className="flex items-start gap-2">
            <span className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-white/15">
              <Image src={TESTIMONIALS[2].avatar} alt={TESTIMONIALS[2].name} fill sizes="24px" className="object-cover" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-white">{TESTIMONIALS[2].name.split(" ")[0]}</p>
              <p className="text-[11px] text-zinc-300">Swap scene 3 for the night-market shot</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VISUAL_COMPONENTS = {
  prompt: PromptVisual,
  editor: EditorVisual,
  export: ExportVisual,
  batch: BatchVisual,
  reference: ReferenceVisual,
  collab: CollabVisual,
};

/* -------------------------------------------------------------------------- */
/*  Build Better Videos — alternating feature spotlights                      */
/* -------------------------------------------------------------------------- */

function BuildBetterVideos() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-28 md:px-8 md:py-36">
      <SectionHeading
        eyebrow="Build better videos"
        title={
          <>
            Powered by Cubell&apos;s{" "}
            <span className="gradient-text">imagination engine.</span>
          </>
        }
        description="Six craft-grade capabilities, one tightly opinionated workflow. Ship content that looks expensive — without the studio bill."
      />

      <div className="mt-20 space-y-24 md:space-y-32">
        {FEATURE_SPOTLIGHTS.map((f, i) => {
          const VisualComp = VISUAL_COMPONENTS[f.visual];
          const reversed = i % 2 === 1;

          return (
            <motion.div
              key={f.title}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              className={cn(
                "grid items-center gap-10 md:grid-cols-2 md:gap-16",
                reversed && "md:[&>*:first-child]:order-2",
              )}
            >
              <motion.div variants={fadeUp} className="space-y-5">
                <SectionEyebrow>{f.eyebrow}</SectionEyebrow>
                <h3 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-[40px] md:leading-[1.08]">
                  {f.title}
                </h3>
                <p className="max-w-xl text-base leading-relaxed text-zinc-400">
                  {f.description}
                </p>
                <Link
                  href={f.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                >
                  {f.learnMore}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <VisualComp />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Examples grid (hover-to-play)                                             */
/* -------------------------------------------------------------------------- */

function ExampleCard({
  example,
  index,
}: {
  example: Preview;
  index: number;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  };
  const onLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden">
        <Image
          src={example.poster}
          alt={example.title}
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={index < 2}
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <source src={example.video} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />

        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
            {example.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
            {example.lang}
          </span>
        </div>

        <div className="absolute right-3 top-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition-transform duration-300 group-hover:scale-110">
            <Play className="h-3.5 w-3.5 translate-x-[1px] fill-current" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[15px] font-semibold leading-tight text-white">
            {example.title}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-300">{example.subtitle}</p>

          <div className="mt-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              asChild
              size="sm"
              className="h-8 w-full rounded-lg bg-white text-xs font-medium text-zinc-950 hover:bg-zinc-200"
            >
              <Link href="/auth/register">
                Use this template
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Examples() {
  const [filter, setFilter] = React.useState<Category>("All");
  const visible = React.useMemo(
    () =>
      filter === "All"
        ? HERO_PREVIEWS
        : HERO_PREVIEWS.filter((e) => e.category === filter),
    [filter],
  );

  return (
    <section
      id="examples"
      className="relative overflow-hidden px-4 py-28 md:px-8 md:py-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-500/[0.08] to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl">
        <SectionHeading
          eyebrow="Example videos"
          title={
            <>
              Content your audience{" "}
              <span className="gradient-text">actually watches</span>
            </>
          }
          description="From festival promos to food tours — ship social-ready clips with local context built in."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                filter === cat
                  ? "border-white/20 bg-white text-zinc-950"
                  : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:text-white",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((ex, i) => (
              <ExampleCard key={ex.title} example={ex} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 rounded-xl border-white/15 bg-white/[0.04] px-5 text-white hover:bg-white/[0.08] hover:text-white"
          >
            <Link href="/templates">
              Browse all templates
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Publish-Ready — 1:1 with platform                                         */
/* -------------------------------------------------------------------------- */

function PublishReady() {
  return (
    <section className="relative overflow-hidden px-4 py-28 md:px-8 md:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb left-[10%] top-[10%] h-[380px] w-[380px] bg-indigo-600/25" />
        <div className="orb right-[10%] bottom-[0%] h-[320px] w-[320px] bg-fuchsia-600/25" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-5"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow>Publish-ready</SectionEyebrow>
          </motion.div>
          <motion.h3
            variants={fadeUp}
            className="text-balance text-3xl font-semibold tracking-tight text-white md:text-[40px] md:leading-[1.08]"
          >
            Video that&apos;s{" "}
            <span className="gradient-text">1:1 with social.</span>
          </motion.h3>
          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-zinc-400"
          >
            Every export is already optimised for Reels, Shorts, and TikTok —
            correct aspect ratio, safe zones, compliant audio, and zero
            watermark on paid plans. Creators just post.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-4 space-y-2.5">
            {[
              "Auto safe-zones for UI overlay on every platform",
              "Royalty-safe music from a curated SEA + India library",
              "Smart captions in 12 languages, burned or soft",
              "9:16, 4:5, 1:1, 16:9 — exported in one batch",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                <span>{f}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="pt-2">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
            >
              See an example
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* phone-framed reel mock */}
          <div className="device-frame relative mx-auto overflow-hidden rounded-[2rem] border border-white/10 p-2.5" style={{ maxWidth: 340 }}>
            <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.6rem] ring-1 ring-white/10">
              <Image
                src={HERO_PREVIEWS[1].poster}
                alt="Published reel"
                fill
                sizes="340px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />

              {/* mock social overlay */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 text-white">
                <div className="flex items-center gap-2">
                  <span className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/20">
                    <Image src={TESTIMONIALS[1].avatar} alt="" fill sizes="28px" className="object-cover" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold">@dimas.eats</p>
                    <p className="text-[9px] text-white/70">· 2h · Following</p>
                  </div>
                </div>
                <Square className="h-4 w-4" />
              </div>

              {/* right rail actions */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 text-white">
                {[Users, Captions, Music, Share2].map((I, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 ring-1 ring-white/10 backdrop-blur">
                      <I className="h-4 w-4" />
                    </span>
                    <span className="text-[9px] font-medium">{[24, "12K", "4.2K", 812][i]}</span>
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-3 bottom-6 text-white">
                <p className="max-w-[80%] text-[12px] font-medium leading-snug">
                  Malam di Jakarta hits differently. #streetfood #foodreels
                </p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-white/80">
                  <Music className="h-3 w-3" /> Cubell · dhol groove
                </p>
              </div>
            </div>
          </div>

          {/* stat chips */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute -left-2 top-10 hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-xl md:block"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Watch time</p>
            <p className="mt-0.5 text-lg font-semibold text-white">+42%</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="absolute -right-2 bottom-20 hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-xl md:block"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Avg. ship time</p>
            <p className="mt-0.5 text-lg font-semibold text-white">8 min</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Benefits mini grid                                                        */
/* -------------------------------------------------------------------------- */

function Benefits() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <SectionHeading
        eyebrow="Why creators choose Cubell"
        title={
          <>
            Built for India & SEA,{" "}
            <span className="text-zinc-500">from day one.</span>
          </>
        }
        description="Regional workflows, transparent pricing, and social-first quality. No compromises baked in."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {BENEFITS.map((b) => (
          <motion.div
            key={b.title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute -inset-16 bg-[radial-gradient(circle_at_top,hsl(239_84%_67%/0.25),transparent_60%)]" />
            </div>

            <div className="relative">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/10 text-indigo-200 ring-1 ring-white/10">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {b.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Testimonials carousel                                                     */
/* -------------------------------------------------------------------------- */

function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(id);
  }, [paused]);

  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);
  const prev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const active = TESTIMONIALS[index];

  return (
    <section
      className="relative overflow-hidden px-4 py-28 md:px-8 md:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="orb right-[-10%] top-[10%] h-[420px] w-[420px] bg-violet-600/20" />
        <div className="orb left-[-10%] bottom-[0%] h-[360px] w-[360px] bg-indigo-600/20" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        <SectionHeading
          eyebrow="Made by creators, for storytellers"
          title={
            <>
              Loved by teams who <span className="text-zinc-500">ship fast.</span>
            </>
          }
          description="Real creators. Real results. Join thousands using Cubell across 9 countries."
        />

        <div className="relative mt-16 min-h-[340px] md:min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-8 backdrop-blur-xl md:p-12"
            >
              <span className="absolute -top-10 left-6 font-serif text-[180px] leading-none text-white/[0.04] md:text-[240px]">
                &ldquo;
              </span>

              <div className="relative">
                <div className="mb-5 flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-balance text-xl font-medium leading-relaxed text-white md:text-2xl">
                  &ldquo;{active.quote}&rdquo;
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <span className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/10">
                    <Image
                      src={active.avatar}
                      alt={active.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {active.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {active.role} · {active.city}{" "}
                      <span className="ml-1">{active.flag}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={prev}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/20 hover:bg-white/40",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={next}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                   */
/* -------------------------------------------------------------------------- */

function Pricing() {
  return (
    <section
      id="pricing"
      className="relative mx-auto w-full max-w-7xl px-4 py-28 md:px-8 md:py-36"
    >
      <SectionHeading
        eyebrow="Pricing"
        title={
          <>
            Plans that <span className="gradient-text">respect your wallet</span>
          </>
        }
        description="Start free. Upgrade only when output volume grows. Local currency feel, zero surprise billing."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 grid items-stretch gap-5 md:grid-cols-3"
      >
        {PRICING.map((plan) => (
          <motion.div
            key={plan.tier}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35 }}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all",
              plan.featured
                ? "conic-border border-transparent bg-zinc-900/80 shadow-2xl shadow-indigo-500/10 md:-mt-4 md:pb-10"
                : "border-white/10 bg-white/[0.02] hover:border-white/20",
            )}
          >
            {plan.featured && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-fuchsia-500/5" />
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 240, damping: 16 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-indigo-500/40 ring-1 ring-white/20">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                </motion.span>
              </>
            )}

            <div className="relative">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">
                {plan.tier}
              </h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{plan.note}</p>
            </div>

            <div className="relative mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <ul className="relative mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-zinc-300"
                >
                  <CheckCircle2
                    className={cn(
                      "mt-0.5 h-4 w-4 flex-shrink-0",
                      plan.featured ? "text-indigo-300" : "text-emerald-400",
                    )}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              className={cn(
                "relative mt-8 h-11 rounded-xl text-sm font-medium",
                plan.featured
                  ? "bg-white text-zinc-950 hover:bg-zinc-100"
                  : "bg-white/[0.06] text-white ring-1 ring-white/15 hover:bg-white/[0.1]",
              )}
            >
              <Link href={plan.cta.href}>
                {plan.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-10 text-center text-xs text-zinc-500">
        Prices in INR. Indonesia, Vietnam & Thailand billing available at parity.
        Cancel anytime.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ accordion                                                             */
/* -------------------------------------------------------------------------- */

function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="relative mx-auto w-full max-w-4xl px-4 py-28 md:px-8 md:py-36">
      <SectionHeading
        eyebrow="FAQs"
        title={
          <>
            Everything you need to know{" "}
            <span className="text-zinc-500">about Cubell.</span>
          </>
        }
        description="Can't find the answer you're looking for? Reach out to our team — we reply within a business day."
      />

      <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className={cn(i > 0 && "border-t border-white/5")}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white/[0.02] md:px-8 md:py-6"
              >
                <span className="text-[15px] font-medium text-white md:text-base">
                  {item.q}
                </span>
                <span
                  className={cn(
                    "grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-all",
                    isOpen && "border-white/20 bg-white/[0.08] text-white",
                  )}
                >
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pr-12 text-sm leading-relaxed text-zinc-400 md:px-8 md:pb-7 md:pr-20 md:text-[15px]">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-zinc-400">Still have a question?</p>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-white/15 bg-white/[0.04] px-4 text-white hover:bg-white/[0.08] hover:text-white"
        >
          <Link href="mailto:hello@cubell.app">Contact support</Link>
        </Button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Final CTA                                                                 */
/* -------------------------------------------------------------------------- */

function FinalCTA() {
  return (
    <section className="relative px-4 pb-28 md:px-8 md:pb-36">
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-700/40 via-zinc-950 to-fuchsia-700/30 px-6 py-20 text-center md:px-12 md:py-28">
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-40" />
        <div className="orb left-[10%] top-[-20%] h-[380px] w-[380px] bg-indigo-600/40" />
        <div className="orb right-[10%] bottom-[-20%] h-[320px] w-[320px] bg-fuchsia-600/30" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-3xl"
        >
          <SectionEyebrow>Ready when you are</SectionEyebrow>

          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
            What will you <span className="gradient-text">create?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-balance text-base text-zinc-300 md:text-lg">
            Join thousands of creators shipping reels, shorts, and TikToks
            daily with Cubell. Start free — upgrade only when you want HD,
            watermark-free exports at scale.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-xl bg-white px-6 text-[15px] font-medium text-zinc-950 shadow-[0_10px_40px_-10px_hsl(0_0%_100%/0.4)] hover:bg-zinc-100"
            >
              <Link href="/auth/register">
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/15 bg-white/[0.04] px-6 text-[15px] text-white backdrop-blur hover:bg-white/[0.08] hover:text-white"
            >
              <Link href="#pricing">See pricing</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-zinc-400">
            No credit card · 5 free generations · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sticky mobile CTA                                                         */
/* -------------------------------------------------------------------------- */

function StickyMobileCTA() {
  const { scrollY } = useScroll();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const unsub = scrollY.on("change", (v) => {
      setShow(v > 600);
    });
    return () => unsub();
  }, [scrollY]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-3 bottom-3 z-30 md:hidden"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/90 p-2 backdrop-blur-xl shadow-2xl">
            <div className="flex-1 px-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                Free to start
              </p>
              <p className="text-xs text-zinc-400">No credit card required</p>
            </div>
            <Button
              asChild
              size="sm"
              className="h-10 rounded-xl bg-white px-4 text-[13px] font-medium text-zinc-950 hover:bg-zinc-100"
            >
              <Link href="/auth/register">
                Try for free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function LandingPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#05060a] text-zinc-50 antialiased selection:bg-indigo-500/30 selection:text-white">
      <MarketingNav />
      <Hero />
      <StatsStrip />
      <ConceptToClarity />
      <SkipBlankCanvas />
      <BuildBetterVideos />
      <Examples />
      <PublishReady />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <MarketingFooter />
      <StickyMobileCTA />
    </main>
  );
}
