"use client";

import {
  Coins,
  ShieldCheck,
  Plus,
  LogOut,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useLogout, useMe } from "@/lib/api/use-auth";
import { cn } from "@/lib/utils";

interface Pack {
  credits: number;
  price: string;
  per: string;
  popular?: boolean;
  savings?: string;
}

const PACKS: Pack[] = [
  { credits: 200, price: "$5", per: "$0.025/credit" },
  {
    credits: 500,
    price: "$10",
    per: "$0.020/credit",
    popular: true,
    savings: "Save 20%",
  },
  { credits: 1500, price: "$25", per: "$0.017/credit", savings: "Save 32%" },
];

function initialsOf(name?: string | null, email?: string) {
  const src = name || email || "U";
  const parts = src.split(/\s|@/).filter(Boolean);
  return (
    (parts[0]?.[0] ?? "U").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase()
  );
}

export default function AccountPage() {
  const me = useMe();
  const logout = useLogout();
  const balance = me.data?.credits_remaining ?? 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-10">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[18px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(124,58,237,0.5)]">
            {initialsOf(me.data?.full_name, me.data?.email)}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-gray-900 md:text-[28px]">
              {me.data?.full_name || "Your account"}
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-gray-600">
              <span className="truncate">{me.data?.email ?? "—"}</span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm">
                Free plan
              </span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-[13.5px] font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </header>

      {/* Credits card */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_1px_0_0_rgba(17,24,39,0.04),0_20px_40px_-24px_rgba(17,24,39,0.08)]">
        {/* Subtle gradient wash across the top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-transparent"
        />

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7C3AED]">
                <Coins className="h-3.5 w-3.5" />
                Credits
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-[44px] font-semibold leading-none tracking-tight text-gray-900">
                  {balance}
                </span>
                <span className="text-[14px] font-medium text-gray-500">
                  available
                </span>
              </div>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                We never charge for failed generations. Auto-refund within seconds.
              </p>
            </div>
          </div>

          {/* Top-up packs */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {PACKS.map((p) => (
              <div
                key={p.credits}
                className={cn(
                  "relative rounded-2xl border bg-white p-4 text-left transition-all",
                  p.popular
                    ? "border-[#7C3AED] shadow-[0_10px_24px_-12px_rgba(124,58,237,0.35)] ring-1 ring-[#7C3AED]/20"
                    : "border-gray-200 shadow-sm",
                )}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full bg-[#7C3AED] px-2.5 py-0.5 text-[10.5px] font-semibold text-white shadow-md">
                    Most popular
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[22px] font-semibold text-gray-900">
                    {p.credits}
                  </span>
                  <span className="text-[12px] font-semibold text-gray-500">
                    credits
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[15px] font-semibold text-gray-900">
                    {p.price}
                  </span>
                  {p.savings && (
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-emerald-700">
                      {p.savings}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-gray-500">{p.per}</p>
                <button
                  type="button"
                  disabled
                  className={cn(
                    "mt-3 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-[12.5px] font-semibold transition-colors",
                    p.popular
                      ? "bg-[#7C3AED] text-white shadow-sm hover:bg-[#6D28D9]"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Top up
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-gray-500">
            Payments coming soon — top-up via the API until Stripe checkout is
            wired.
          </p>
        </div>
      </section>

      {/* Plan overview */}
      <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Current plan
            </p>
            <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
              Free · pay as you go
            </h2>
            <p className="mt-1 max-w-md text-[13.5px] leading-relaxed text-gray-600">
              You only pay for what you render. Previews are always free.
            </p>
          </div>
          <ul className="grid gap-1.5 text-[13px] text-gray-700 sm:grid-cols-1">
            {[
              "Unlimited free previews",
              "Auto-refund on failed renders",
              "All templates & styles included",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold tracking-tight text-gray-900">
            Recent activity
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Credits ledger
          </span>
        </div>

        <div className="grid place-items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100">
            <Sparkles className="h-5 w-5 text-[#7C3AED]" />
          </div>
          <p className="mt-3 text-[14px] font-semibold text-gray-900">
            Your credit history will appear here
          </p>
          <p className="mt-1 max-w-sm text-[12.5px] leading-relaxed text-gray-500">
            Once the backend ledger endpoint is live, every charge, refund, and
            top-up will show up in this list — no surprises.
          </p>
        </div>
      </section>

      {/* Footer helper */}
      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-[12px] text-gray-500">
        Need help?{" "}
        <a
          href="mailto:hello@cubell.app"
          className="font-semibold text-[#7C3AED] hover:underline"
        >
          hello@cubell.app
        </a>
      </div>
    </div>
  );
}
