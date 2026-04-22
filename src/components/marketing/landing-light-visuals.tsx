"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Grid3x3,
  Heart,
  MessageCircle,
  Music,
  Pencil,
  Share2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

/* ========================================================================== */
/*  Shared shell for a gradient feature visual (aspect 4/3 rounded)            */
/* ========================================================================== */

function GradientShell({
  gradient,
  children,
  className = "",
}: {
  gradient: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] ring-1 ring-white/20 ${className}`}
      style={{ background: gradient }}
    >
      {/* Top soft highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/></svg>\")",
          backgroundSize: "140px 140px",
        }}
      />
      <div className="relative z-[1] flex h-full w-full items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}

function GlassIcon({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/25 bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur">
      {children}
    </div>
  );
}

/* ========================================================================== */
/*  01 — Generate with AI                                                      */
/* ========================================================================== */

export function LightFeatureGenerate() {
  return (
    <GradientShell gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
      <div className="flex w-full max-w-[340px] flex-col items-center gap-5 text-white">
        <GlassIcon>
          <Sparkles className="h-6 w-6 text-white" />
        </GlassIcon>
        <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/75">
            <Zap className="h-3 w-3" /> Generating
            <span className="ml-auto font-mono text-white/60">0:24 / 0:42</span>
          </div>
          <div className="space-y-2">
            {[
              { w: 80, label: "Hook" },
              { w: 60, label: "B-roll" },
              { w: 100, label: "Captions" },
              { w: 45, label: "Music" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2">
                <span className="w-16 text-[10px] font-semibold uppercase tracking-wider text-white/65">
                  {row.label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white/85"
                    style={{ width: `${row.w}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GradientShell>
  );
}

/* ========================================================================== */
/*  02 — Style & Edit                                                          */
/* ========================================================================== */

export function LightFeatureEdit() {
  const swatches = [
    { n: "Noir", c: "bg-gradient-to-br from-neutral-900 to-neutral-600" },
    { n: "Vibrant", c: "bg-gradient-to-br from-orange-500 to-amber-200", on: true },
    { n: "Cinema", c: "bg-gradient-to-br from-sky-900 to-pink-800" },
    { n: "Retro", c: "bg-gradient-to-br from-amber-700 to-orange-300" },
  ];
  return (
    <GradientShell gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
      <div className="flex w-full max-w-[340px] flex-col items-center gap-5 text-white">
        <GlassIcon>
          <Pencil className="h-6 w-6 text-white" />
        </GlassIcon>
        <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/75">
            Style presets
          </p>
          <div className="grid grid-cols-4 gap-2">
            {swatches.map((s) => (
              <div
                key={s.n}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-1.5 ${
                  s.on ? "bg-white/25 ring-1 ring-white/70" : ""
                }`}
              >
                <span className={`h-8 w-full rounded-md ${s.c}`} />
                <span className="text-[9px] font-semibold text-white/85">
                  {s.n}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-[11px] text-white/80">
            <span>Pace</span>
            <div className="flex flex-1 items-center px-3">
              <span className="h-0.5 flex-1 rounded bg-white/30" />
              <span className="h-3 w-3 -ml-1 rounded-full border-2 border-white bg-pink-500 shadow" />
              <span className="h-0.5 flex-1 rounded bg-white/15" />
            </div>
            <span className="font-mono">1.2×</span>
          </div>
        </div>
      </div>
    </GradientShell>
  );
}

/* ========================================================================== */
/*  03 — Collaborate                                                           */
/* ========================================================================== */

export function LightFeatureCollab() {
  return (
    <GradientShell gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Scene frames behind */}
        <div className="absolute left-[12%] top-[18%] h-[38%] w-[46%] rounded-xl border-2 border-white/75 bg-white/10 backdrop-blur-sm">
          <span className="absolute -top-5 left-0 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-sky-700">
            Scene 1 · hook
          </span>
        </div>
        <div className="absolute bottom-[18%] right-[10%] h-[32%] w-[38%] rounded-xl border-2 border-white/75 bg-white/10 backdrop-blur-sm">
          <span className="absolute -top-5 left-0 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-sky-700">
            Audio
          </span>
        </div>

        {/* Cursors */}
        {[
          { top: "22%", left: "35%", name: "Alex", bg: "#2563eb" },
          { top: "58%", left: "52%", name: "Riya", bg: "#7c3aed" },
          { top: "40%", left: "72%", name: "Dimas", bg: "#ec4899" },
        ].map((c, i) => (
          <div
            key={c.name}
            className="mk-chip-float absolute flex flex-col items-start gap-1"
            style={{ top: c.top, left: c.left, animationDelay: `${i * 0.5}s` }}
          >
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
              <path
                d="M3 3L9 17L11.5 11.5L17 9L3 3Z"
                fill={c.bg}
                stroke="white"
                strokeWidth="1.2"
              />
            </svg>
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow"
              style={{ background: c.bg }}
            >
              {c.name}
            </span>
          </div>
        ))}

        {/* Comment bubble */}
        <div className="mk-chip-float absolute right-[6%] top-[8%] max-w-[150px] rounded-xl bg-white px-3 py-2 text-[11px] font-medium text-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          <p className="mb-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-sky-600">
            <MessageCircle className="h-2.5 w-2.5" /> Dimas
          </p>
          Add Tamil captions here? ✨
        </div>

        {/* Center icon */}
        <GlassIcon>
          <Users className="h-6 w-6 text-white" />
        </GlassIcon>
      </div>
    </GradientShell>
  );
}

/* ========================================================================== */
/*  04 — Multi-format Export                                                   */
/* ========================================================================== */

export function LightFeatureExport() {
  const targets = [
    { ratio: "9:16", label: "Reels · Shorts · TikTok" },
    { ratio: "4:5", label: "Feed & Ads" },
    { ratio: "1:1", label: "Square posts" },
    { ratio: "16:9", label: "YouTube · Web" },
  ];
  return (
    <GradientShell gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
      <div className="flex w-full max-w-[360px] flex-col items-center gap-4 text-white">
        <GlassIcon>
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden
          >
            <path
              d="M16 6v16M10 16l6 6 6-6"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 26h20"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </GlassIcon>
        <div className="w-full space-y-2">
          {targets.map((t) => (
            <div
              key={t.ratio}
              className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/15 px-3 py-2 backdrop-blur"
            >
              <span className="inline-flex min-w-[48px] justify-center rounded-md bg-white/85 px-2 py-0.5 text-xs font-bold text-rose-600">
                {t.ratio}
              </span>
              <span className="flex-1 text-[13px] font-semibold text-white">
                {t.label}
              </span>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-rose-600">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] font-semibold text-white/85">
          One batch · every platform your audience uses
        </p>
      </div>
    </GradientShell>
  );
}

/* ========================================================================== */
/*  05 — Regional templates                                                    */
/* ========================================================================== */

export function LightFeatureTemplates() {
  const tiles = [
    { name: "Diwali Pop", c: "bg-gradient-to-br from-orange-400 to-amber-200", tag: "IN" },
    { name: "Jakarta", c: "bg-gradient-to-br from-emerald-700 to-lime-300", tag: "ID" },
    { name: "Chennai", c: "bg-gradient-to-br from-fuchsia-800 to-pink-300", tag: "IN" },
    { name: "Bangkok", c: "bg-gradient-to-br from-rose-700 to-amber-300", tag: "TH" },
    { name: "Mumbai Cafe", c: "bg-gradient-to-br from-slate-900 to-sky-300", tag: "IN" },
    { name: "Songkran", c: "bg-gradient-to-br from-amber-800 to-yellow-200", tag: "TH" },
  ];
  return (
    <GradientShell gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
      <div className="flex w-full max-w-[360px] flex-col items-center gap-4 text-white">
        <GlassIcon>
          <Grid3x3 className="h-6 w-6 text-white" />
        </GlassIcon>
        <div className="grid w-full grid-cols-3 gap-2">
          {tiles.map((t) => (
            <div
              key={t.name}
              className="overflow-hidden rounded-lg border border-white/25 bg-white/10 backdrop-blur"
            >
              <div className={`relative h-12 ${t.c}`}>
                <span className="absolute right-1 top-1 rounded bg-black/40 px-1 py-0.5 text-[8px] font-bold text-white">
                  {t.tag}
                </span>
              </div>
              <div className="px-2 py-1 text-[9px] font-semibold text-white">
                {t.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GradientShell>
  );
}

/* ========================================================================== */
/*  06 — Brand consistency                                                     */
/* ========================================================================== */

export function LightFeatureBrand() {
  return (
    <GradientShell gradient="linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)">
      <div className="flex w-full max-w-[340px] flex-col items-center gap-5 text-white">
        <GlassIcon>
          <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden
          >
            <circle
              cx="16"
              cy="16"
              r="10"
              stroke="white"
              strokeWidth="2.2"
              fill="none"
            />
            <path
              d="M16 10v6l4 4"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </GlassIcon>

        <div className="w-full space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/15 px-3 py-2.5 backdrop-blur">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-[11px] font-extrabold text-fuchsia-700">
              C
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white">
                Cubell Brand Kit
              </p>
              <p className="text-[10px] text-white/75">Logo · Fonts · Intro</p>
            </div>
            <span className="rounded-full border border-white/40 bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
              Auto
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-3 py-2 backdrop-blur">
            <span className="text-[11px] font-semibold text-white/85">
              Palette
            </span>
            <div className="flex flex-1 items-center gap-1.5 px-2">
              {["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9"].map(
                (h) => (
                  <span
                    key={h}
                    className="h-5 w-5 rounded-full ring-2 ring-white/80"
                    style={{ background: h }}
                  />
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-3 py-2 backdrop-blur">
            <span className="text-[11px] font-semibold text-white/85">
              Typography
            </span>
            <span className="ml-auto font-mono text-[11px] text-white">
              Inter · 600
            </span>
          </div>
        </div>
      </div>
    </GradientShell>
  );
}

/* ========================================================================== */
/*  Publish-ready phone mock                                                   */
/* ========================================================================== */

export function LightFeaturePublish({
  poster,
  handle = "@dimas.eats",
  caption = "Malam di Jakarta hits differently.",
  tag = "#streetfood #foodreels",
}: {
  poster: string;
  handle?: string;
  caption?: string;
  tag?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-gray-900/10 bg-gradient-to-b from-gray-900 to-black p-2.5 shadow-[0_50px_100px_-30px_rgba(76,29,149,0.35),0_20px_40px_-20px_rgba(0,0,0,0.3)]">
        <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.7rem] ring-1 ring-white/10">
          <Image
            src={poster}
            alt="Published reel"
            fill
            sizes="320px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 text-white">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-pink-500 via-amber-400 to-violet-500 text-[11px] font-bold">
                D
              </span>
              <div>
                <p className="text-[11px] font-semibold leading-none">
                  {handle}
                </p>
                <p className="mt-0.5 text-[9px] text-white/70">
                  2h · Following
                </p>
              </div>
            </div>
            <span className="rounded border border-white/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
              Reel
            </span>
          </div>

          <div className="absolute bottom-20 right-3 flex flex-col items-center gap-3.5 text-white">
            {[
              { I: Heart, v: "12K" },
              { I: MessageCircle, v: "820" },
              { I: Share2, v: "4.2K" },
              { I: Music, v: "Cubell" },
            ].map(({ I, v }, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 ring-1 ring-white/10 backdrop-blur">
                  <I className="h-4 w-4" />
                </span>
                <span className="text-[9px] font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="absolute inset-x-3 bottom-5 text-white">
            <p className="max-w-[78%] text-[12px] font-semibold leading-snug">
              {caption}
            </p>
            <p className="mt-0.5 text-[10px] text-white/75">{tag}</p>
            <p className="mt-1.5 flex items-center gap-1 text-[10px] text-white/80">
              <Music className="h-3 w-3" /> Cubell · dhol groove
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1 h-4 w-20 -translate-x-1/2 rounded-b-xl bg-black" />
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  Section link with animated arrow                                           */
/* ========================================================================== */

export function LightSectionLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-sm font-semibold text-violet-600 transition-all hover:text-violet-700"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
