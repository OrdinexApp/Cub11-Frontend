"use client";

import Link from "next/link";
import { Sparkles, Search } from "lucide-react";
import { CreditMeter } from "./CreditMeter";

export function TopBar() {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/50 bg-background/80 backdrop-blur px-4 py-3">
      <Link href="/projects" className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight">Cube11</span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          aria-label="Search"
          className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40"
        >
          <Search className="h-4.5 w-4.5" />
        </button>
        <CreditMeter compact />
      </div>
    </header>
  );
}
