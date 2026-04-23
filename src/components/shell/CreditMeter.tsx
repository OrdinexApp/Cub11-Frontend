"use client";

import { Coins, ShieldCheck, ArrowUpRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useMe } from "@/lib/api/use-auth";

export function CreditMeter({ compact = false }: { compact?: boolean }) {
  const me = useMe();
  const balance = me.data?.credits_remaining ?? 0;
  const loading = me.isLoading || me.isFetching;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {compact ? (
          <button className="inline-flex items-center gap-1.5 rounded-full border border-violet-600/15 bg-violet-600/10 px-3 py-1.5 text-xs font-semibold text-[#7C3AED]">
            <Coins className="h-3.5 w-3.5" />
            <span className="font-mono">{balance}</span>
          </button>
        ) : (
          <button className="group flex flex-col gap-1 rounded-xl border border-gray-200/70 bg-white/70 p-3 text-left shadow-sm transition hover:border-violet-600/25 hover:bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <Coins className="h-3.5 w-3.5" />
                Credits
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 transition group-hover:text-[#7C3AED]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[22px] font-semibold tracking-tight text-gray-900">
                {balance}
              </span>
              <span className="text-xs text-gray-500">left</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600">
              <ShieldCheck className="h-3 w-3" />
              Failed gens auto-refunded
            </div>
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align={compact ? "end" : "start"}
        className="w-80 rounded-2xl border-gray-200/70 p-0 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)]"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Balance
              </p>
              <p className="font-mono text-[28px] font-semibold text-gray-900">
                {balance}
              </p>
            </div>
            <Link
              href="/account"
              className="inline-flex h-8 items-center rounded-full bg-[#7C3AED] px-3 text-[12.5px] font-semibold text-white shadow-[0_6px_12px_-3px_rgba(124,58,237,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#6D28D9]"
            >
              Top up
            </Link>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            We never charge for failed generations.
          </p>
        </div>
        <Separator />
        <div className="flex items-center justify-between p-4">
          <div className="text-xs text-gray-500">
            Live balance from your account
          </div>
          <button
            onClick={() => me.refetch()}
            className="inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-900"
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
