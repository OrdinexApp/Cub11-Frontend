"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Choose" },
  { id: 2, label: "Style" },
  { id: 3, label: "Preview" },
] as const;

interface Props {
  current: 1 | 2 | 3;
  backHref?: string;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function StepShell({
  current,
  backHref,
  children,
  title,
  subtitle,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      {/* Top row: back link + stepper */}
      <div className="mb-8 flex items-center justify-between gap-4">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        ) : (
          <span />
        )}

        <ol className="flex items-center gap-1.5 sm:gap-2">
          {STEPS.map((s, i) => {
            const done = s.id < current;
            const active = s.id === current;
            return (
              <li key={s.id} className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold transition-colors",
                    done
                      ? "bg-[#7C3AED] text-white shadow-[0_4px_10px_-3px_rgba(124,58,237,0.5)]"
                      : active
                        ? "bg-white text-[#7C3AED] ring-2 ring-[#7C3AED]"
                        : "bg-white text-gray-400 ring-1 ring-gray-200",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                </span>
                <span
                  className={cn(
                    "hidden text-[12.5px] font-medium sm:inline",
                    active
                      ? "text-gray-900"
                      : done
                        ? "text-[#7C3AED]"
                        : "text-gray-400",
                  )}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className={cn(
                      "hidden h-px w-8 sm:block",
                      done ? "bg-[#7C3AED]/40" : "bg-gray-200",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <header className="mb-8 md:mb-10">
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-tight text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
              {subtitle}
            </p>
          )}
        </header>
        {children}
      </motion.div>
    </div>
  );
}
