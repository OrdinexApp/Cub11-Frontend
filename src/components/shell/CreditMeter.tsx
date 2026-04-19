"use client";

import { Coins, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreditsStore } from "@/lib/stores/credits-store";
import { timeAgo, cn } from "@/lib/utils";
import type { CreditEntry } from "@/types/project";

const REASON_LABEL: Record<CreditEntry["reason"], string> = {
  preview: "Preview",
  render: "HD render",
  "refund-failed": "Auto-refund",
  topup: "Top-up",
  welcome: "Welcome bonus",
};

export function CreditMeter({ compact = false }: { compact?: boolean }) {
  const { balance, history } = useCreditsStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {compact ? (
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary">
            <Coins className="h-3.5 w-3.5" />
            <span className="font-mono">{balance}</span>
          </button>
        ) : (
          <button className="group flex flex-col gap-1 rounded-2xl border border-border/60 bg-card/50 p-3 text-left transition hover:border-primary/30 hover:bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                <Coins className="h-3.5 w-3.5" />
                Credits
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold tracking-tight">
                {balance}
              </span>
              <span className="text-xs text-muted-foreground">left</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-success">
              <ShieldCheck className="h-3 w-3" />
              Failed gens auto-refunded
            </div>
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align={compact ? "end" : "start"}
        className="w-80 p-0"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Balance
              </p>
              <p className="font-mono text-3xl font-semibold">{balance}</p>
            </div>
            <Button asChild size="sm" variant="soft">
              <Link href="/account">Top up</Link>
            </Button>
          </div>
          <p className="mt-2 text-xs text-success flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            We never charge for failed generations.
          </p>
        </div>
        <Separator />
        <div className="p-2">
          <p className="px-2 pt-1 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent activity
          </p>
          <ScrollArea className="h-64">
            <ul className="flex flex-col">
              {history.slice(0, 30).map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-lg px-2 py-2 hover:bg-accent/40"
                >
                  <div className="min-w-0">
                    <p className="text-sm leading-tight truncate">{e.note}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {REASON_LABEL[e.reason]} · {timeAgo(e.at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-sm shrink-0",
                      e.amount >= 0 ? "text-success" : "text-foreground",
                    )}
                  >
                    {e.amount >= 0 ? "+" : ""}
                    {e.amount}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
