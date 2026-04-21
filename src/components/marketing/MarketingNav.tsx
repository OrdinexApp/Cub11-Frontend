"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clapperboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Templates", href: "/templates" },
];

export function MarketingNav() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 160], [0, 14]);
  const bg = useTransform(
    scrollY,
    [0, 160],
    ["hsla(240, 10%, 3.9%, 0)", "hsla(240, 10%, 3.9%, 0.72)"],
  );
  const border = useTransform(
    scrollY,
    [0, 160],
    ["hsla(240, 4%, 18%, 0)", "hsla(240, 4%, 18%, 0.6)"],
  );
  const [open, setOpen] = React.useState(false);

  return (
    <motion.header
      style={{
        backdropFilter: blur.get() ? `blur(${blur.get()}px)` : undefined,
        WebkitBackdropFilter: blur.get() ? `blur(${blur.get()}px)` : undefined,
        backgroundColor: bg,
        borderBottomColor: border,
      }}
      className="fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 md:px-8">
        <Link href="/" className="group inline-flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
            <Clapperboard className="h-[18px] w-[18px]" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Cubell
            <span className="ml-1 font-normal text-zinc-400">Studio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-lg text-zinc-200 hover:bg-white/5 hover:text-white"
          >
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-lg bg-white text-zinc-950 hover:bg-zinc-200"
          >
            <Link href="/auth/register">Get started</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-white/5 bg-zinc-950/90 px-4 backdrop-blur-xl md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-1 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-lg bg-white text-zinc-950 hover:bg-zinc-200"
            >
              <Link href="/auth/register">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
