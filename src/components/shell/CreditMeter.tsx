"use client";

import { Coins, ShieldCheck, ArrowUpRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/api/use-auth";

export function CreditMeter({ compact = false }: { compact?: boolean }) {
  const me = useMe();
  const balance = me.data?.credits_remaining ?? 0;
  const loading = me.isLoading || me.isFetching;

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

      <PopoverContent align={compact ? "end" : "start"} className="w-80 p-0">
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
        <div className="p-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Live balance from your account
          </div>
          <button
            onClick={() => me.refetch()}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            aria-label="Refresh balance"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
