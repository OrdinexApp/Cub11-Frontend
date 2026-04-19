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

export function StepShell({ current, backHref, children, title, subtitle }: Props) {
  return (
    <div className="relative min-h-[80dvh]">
      <div className="absolute inset-0 indigo-gradient pointer-events-none" />

      <div className="relative mx-auto w-full max-w-3xl px-4 md:px-6 py-6 md:py-10">
        <div className="mb-6 flex items-center justify-between">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          ) : (
            <span />
          )}

          <ol className="flex items-center gap-2">
            {STEPS.map((s) => {
              const done = s.id < current;
              const active = s.id === current;
              return (
                <li key={s.id} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold transition-colors",
                      done
                        ? "bg-primary text-primary-foreground"
                        : active
                          ? "bg-primary/15 text-primary ring-2 ring-primary/40"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </span>
                  <span
                    className={cn(
                      "hidden sm:inline text-xs font-medium",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                  {s.id < STEPS.length && (
                    <span className="hidden sm:block h-px w-6 bg-border" />
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
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-balance">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>
            )}
          </header>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
