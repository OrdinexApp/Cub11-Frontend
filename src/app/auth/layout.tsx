"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuroraBackground } from "@/components/marketing/landing-aurora-effects";

/* -------------------------------------------------------------------
   Auth layout
   A continuation of the marketing landing: same aurora background,
   glass card, violet brand, premium Inter typography.
------------------------------------------------------------------- */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Use the same landing root class so the aurora paints over a fallback.
  React.useEffect(() => {
    const html = document.documentElement;
    html.classList.add("mk-landing-root");
    return () => {
      html.classList.remove("mk-landing-root");
    };
  }, []);

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <AuroraBackground />

      <div className="relative z-10 flex min-h-dvh flex-col">
        {/* Top bar — back to home + brand */}
        <header className="flex items-center justify-between px-6 py-5 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Brand />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="px-6 pb-8 text-center text-xs text-gray-500 md:px-10">
          By continuing you agree to our{" "}
          <Link href="#" className="text-gray-700 underline-offset-4 hover:underline">
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link href="#" className="text-gray-700 underline-offset-4 hover:underline">
            Privacy
          </Link>
          .
        </footer>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label="Cubell home">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="8" fill="#7C3AED" />
        <polygon points="11,8 21,14 11,20" fill="white" />
        <rect x="7" y="8" width="2.5" height="12" rx="1.25" fill="white" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight text-[#7C3AED]">Cubell</span>
    </Link>
  );
}
