"use client";

import Link from "next/link";
import { Clapperboard } from "lucide-react";

const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "#pricing" },
      { label: "Examples", href: "#examples" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "DPA", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-zinc-950/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 md:grid-cols-6 md:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
              <Clapperboard className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Cubell <span className="font-normal text-zinc-400">Studio</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-zinc-400">
            AI video studio for creators in India, Indonesia, Vietnam, Thailand,
            and beyond. Publish daily, look expensive.
          </p>
          <div className="mt-6 flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
          </div>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-zinc-500 md:flex-row md:items-center md:px-8">
          <p>© {new Date().getFullYear()} Cubell Studio. Made for creators.</p>
          <p className="flex items-center gap-2">
            <span>🇮🇳 India</span>
            <span className="text-zinc-700">•</span>
            <span>🇮🇩 Indonesia</span>
            <span className="text-zinc-700">•</span>
            <span>🇻🇳 Vietnam</span>
            <span className="text-zinc-700">•</span>
            <span>🇹🇭 Thailand</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
