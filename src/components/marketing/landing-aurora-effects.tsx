"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ========================================================================== */
/*  AuroraBackground                                                           */
/*                                                                             */
/*  Creative multi-angle aurora — pure CSS, no JS.                             */
/*  Outer:  fixed full-viewport surface (#faf8ff) that catches the waves.      */
/*  Inner:  three layered gradient surfaces composited with blur + invert      */
/*          and overlay/difference blend modes; animated by `mk-aurora-drift`, */
/*          `mk-aurora-cross`, and `mk-aurora-sweep` in globals.css.           */
/* ========================================================================== */

export function AuroraBackground() {
  return (
    <div aria-hidden className="mk-aurora-bg">
      <div className="mk-aurora-inner" />
    </div>
  );
}

/* ========================================================================== */
/*  CustomCursor                                                               */
/*  Purple dot that follows the mouse; expands on hover-over interactive.      */
/*  Inside an element flagged `data-cursor-panel`, swaps to a green "You"      */
/*  collaborator cursor and hides the dot.                                     */
/*  Desktop-only and respects prefers-reduced-motion.                          */
/* ========================================================================== */

export function CustomCursor({ youLabel = "You" }: { youLabel?: string }) {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const youRef = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const mql =
      typeof window !== "undefined"
        ? window.matchMedia(
            "(pointer: fine) and (prefers-reduced-motion: no-preference)",
          )
        : null;
    if (!mql) return;

    const apply = () => setEnabled(mql.matches);
    apply();
    mql.addEventListener?.("change", apply);
    return () => mql.removeEventListener?.("change", apply);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const you = youRef.current;
    if (!dot || !you) return;

    let mx = -100;
    let my = -100;
    let frame = 0;
    let overPanel = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
          you.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(8px, 8px)`;
          frame = 0;
        });
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, summary, [role="button"], input, textarea, select',
      );
      dot.classList.toggle("mk-cursor-dot--hover", !!interactive);

      const panel = target.closest("[data-cursor-panel='true']");
      const nowOver = !!panel;
      if (nowOver !== overPanel) {
        overPanel = nowOver;
        dot.classList.toggle("mk-cursor-dot--hidden", overPanel);
        you.style.display = overPanel ? "flex" : "none";
      }
    };

    const onLeaveWindow = () => {
      dot.classList.add("mk-cursor-dot--hidden");
      you.style.display = "none";
    };
    const onEnterWindow = () => {
      dot.classList.remove("mk-cursor-dot--hidden");
    };

    you.style.display = "none";
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="mk-cursor-dot" aria-hidden />
      <div ref={youRef} className="mk-you-cursor" aria-hidden>
        <svg viewBox="0 0 18 18" width="18" height="18" fill="none">
          <path
            d="M2 2L8 16L10.5 10.5L16 8L2 2Z"
            fill="#10B981"
            stroke="#fff"
            strokeWidth="1.2"
          />
        </svg>
        <span className="mk-you-cursor-label">{youLabel}</span>
      </div>
    </>
  );
}

/* ========================================================================== */
/*  ClickRipple                                                                */
/*  Appends a rippling conic-gradient ring on every mousedown, auto-removes.   */
/* ========================================================================== */

export function ClickRipple() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const mql =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: no-preference)")
        : null;
    if (!mql) return;
    const apply = () => setEnabled(mql.matches);
    apply();
    mql.addEventListener?.("change", apply);
    return () => mql.removeEventListener?.("change", apply);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    const onDown = (e: MouseEvent) => {
      // Skip if middle/right click or modifier keys — keeps it feeling natural
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const ring = document.createElement("div");
      ring.className = "mk-ripple";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      window.setTimeout(() => ring.remove(), 700);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [enabled]);

  return null;
}

/* ========================================================================== */
/*  CanvasSpotlight                                                            */
/*  The "Skip the blank canvas" section — dotted grid panel with 3 animated    */
/*  collaborator cursors orbiting around a central frame. Data-cursor-panel    */
/*  flag hands control to the custom cursor for the "You" experience.          */
/* ========================================================================== */

const COLLABORATORS = [
  {
    name: "Alex",
    color: "#3B82F6",
    path: "mk-path-alex",
  },
  {
    name: "Riya",
    color: "#8B5CF6",
    path: "mk-path-riya",
  },
  {
    name: "Dimas",
    color: "#EC4899",
    path: "mk-path-dimas",
  },
];

export function CanvasSpotlight({
  promptText = "A Diwali sale reel in Hindi — 15 seconds, upbeat music, bright festive palette",
}: {
  promptText?: string;
}) {
  return (
    <div
      data-cursor-panel="true"
      className="relative min-h-[600px] overflow-hidden rounded-3xl border border-white/80 bg-white/25 shadow-[0_10px_60px_-20px_rgba(76,29,149,0.25)] backdrop-blur-md md:min-h-[720px]"
    >
      <div className="mk-dot-grid pointer-events-none absolute inset-0" />

      {/* Corner labels */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3 py-1 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Cubell Canvas
        </span>
        <span className="hidden items-center gap-1.5 rounded-full border border-white/80 bg-white/60 px-3 py-1 backdrop-blur md:inline-flex">
          <span className="flex -space-x-1.5">
            {COLLABORATORS.map((c) => (
              <span
                key={c.name}
                className="h-3 w-3 rounded-full border border-white"
                style={{ background: c.color }}
              />
            ))}
          </span>
          3 collaborators
        </span>
      </div>

      {/* Collaborator cursors */}
      {COLLABORATORS.map((c) => (
        <div
          key={c.name}
          className={cn(
            "pointer-events-none absolute z-30 flex flex-col items-start gap-1",
            c.path,
          )}
          aria-hidden
        >
          <svg
            viewBox="0 0 20 20"
            width="22"
            height="22"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
            fill="none"
          >
            <path
              d="M3 3L9 17L11.5 11.5L17 9L3 3Z"
              fill={c.color}
              stroke="white"
              strokeWidth="1.2"
            />
          </svg>
          <span
            className="rounded px-2 py-0.5 text-[11px] font-semibold text-white shadow"
            style={{ background: c.color }}
          >
            {c.name}
          </span>
        </div>
      ))}

      {/* Center frame + prompt bar */}
      <div className="absolute inset-0 flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="relative flex aspect-[16/9] w-full max-w-[640px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/80 bg-white/70 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden
          >
            <rect
              x="8"
              y="14"
              width="32"
              height="20"
              rx="5"
              stroke="#7C3AED"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              fill="none"
              opacity="0.45"
            />
            <polygon points="20,19 20,29 30,24" fill="#7C3AED" opacity="0.45" />
          </svg>
          <span className="text-sm font-medium text-gray-500">
            Your video appears here
          </span>

          {/* Prompt bar */}
          <div className="absolute -bottom-7 left-1/2 flex w-[92%] -translate-x-1/2 items-center gap-2 rounded-full border border-gray-200/80 bg-white/95 px-5 py-3 text-sm text-gray-600 shadow-[0_8px_28px_rgba(0,0,0,0.08)] backdrop-blur">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v12M2 8h12"
                stroke="#7C3AED"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="truncate">{promptText}</span>
            <span className="mk-caret ml-0.5 inline-block h-[14px] w-[2px] shrink-0 translate-y-[1px] rounded-[1px] bg-violet-600" />
          </div>
        </div>
      </div>

      {/* Footer status row */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-5 text-[11px] font-medium text-gray-500">
        <span>Move your cursor — meet the team editing live</span>
        <span className="hidden sm:inline">Auto-save · 2s ago</span>
      </div>
    </div>
  );
}
