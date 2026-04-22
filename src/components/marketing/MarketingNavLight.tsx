"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
    >
      <rect width="28" height="28" rx="8" fill="#7C3AED" />
      <polygon points="11,8 21,14 11,20" fill="white" />
      <rect x="7" y="8" width="2.5" height="12" rx="1.25" fill="white" />
    </svg>
  );
}

export function MarketingNavLight() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 border-b transition-all duration-300",
        scrolled
          ? "border-gray-200/80 bg-white/85 shadow-[0_1px_24px_rgba(0,0,0,0.06)] backdrop-blur-md"
          : "border-transparent bg-white/55 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-between gap-8 px-4 sm:px-8 lg:px-16">
        <Link
          href="/"
          aria-label="Cubell home"
          className="flex shrink-0 items-center gap-2"
        >
          <Logo size={28} />
          <span className="text-[18px] font-bold tracking-tight text-violet-600">
            Cubell
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link
            href="/auth/login"
            className="rounded-md px-3.5 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-gray-900 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-md p-1.5 text-gray-800 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-gray-200 bg-white/95 px-6 py-4 backdrop-blur-xl md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-gray-100 py-2.5 text-base font-medium text-gray-700 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-semibold text-gray-800"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
