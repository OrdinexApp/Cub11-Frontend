"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

/**
 * Post-login workspace shell.
 *
 * Uses a clean, static light surface (no animated aurora) so data-dense
 * screens — the generate flow, editor, templates, videos — stay quiet
 * and professional. A single static lavender glow in the top-right
 * adds depth without motion; `prefers-reduced-motion` users see the
 * flat `#fafafa` underneath.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const html = document.documentElement;
    html.classList.add("mk-app-root");
    return () => {
      html.classList.remove("mk-app-root");
    };
  }, []);

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#f5f5f7] text-gray-900">
      {/* Static, decorative depth — no animation */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-48 -right-40 z-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08),transparent_65%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-56 -left-32 z-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.06),transparent_65%)] blur-3xl"
      />

      <div className="relative z-10 flex min-h-dvh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
