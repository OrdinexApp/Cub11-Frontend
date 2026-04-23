"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { CreditMeter } from "./CreditMeter";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-[0_1px_0_0_rgba(17,24,39,0.03)] md:hidden">
      <Link
        href="/projects"
        className="flex items-center gap-2"
        aria-label="Cubell home"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="28" height="28" rx="8" fill="#7C3AED" />
          <polygon points="11,8 21,14 11,20" fill="white" />
          <rect x="7" y="8" width="2.5" height="12" rx="1.25" fill="white" />
        </svg>
        <span className="text-[15px] font-bold tracking-tight text-[#7C3AED]">
          Cubell
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          aria-label="Search"
          className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <Search className="h-[17px] w-[17px]" />
        </button>
        <CreditMeter compact />
      </div>
    </header>
  );
}
